package importer

import (
	"errors"
	"fmt"
	importconfig "github.com/vesoft-inc/nebula-importer/pkg/config"
	importerErrors "github.com/vesoft-inc/nebula-importer/pkg/errors"
	"github.com/vesoft-inc/nebula-importer/pkg/logger"
	"github.com/vesoft-inc/nebula-studio/server/api/studio/internal/types"
	Config "github.com/vesoft-inc/nebula-studio/server/api/studio/pkg/config"
	"github.com/vesoft-inc/nebula-studio/server/api/studio/pkg/utils"
	"go.uber.org/zap"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"time"

	"gopkg.in/yaml.v2"
)

type ImportResult struct {
	TaskId      string `json:"taskId"`
	TimeCost    string `json:"timeCost"` // Milliseconds
	FailedRows  int64  `json:"failedRows"`
	ErrorResult struct {
		ErrorCode int    `json:"errorCode"`
		ErrorMsg  string `json:"errorMsg"`
	}
}

type ActionResult struct {
	Results []TaskInfo `json:"results"`
	Msg     string     `json:"msg"`
}

func GetNewTaskDir() (string, error) {
	taskId, err := GetTaskMgr().NewTaskID()
	if err != nil {
		return "", err
	}
	taskDir := filepath.Join(Config.Cfg.Web.TasksDir, taskId)
	return taskDir, nil
}

func CreateConfigFile(dir string, config importconfig.YAMLConfig) error {
	fileName := "config.yaml"
	err := utils.CreateDir(dir)
	if err != nil {
		return err
	}
	path := filepath.Join(dir, fileName)
	// erase user information
	address := *config.NebulaClientSettings.Connection.Address
	user := *config.NebulaClientSettings.Connection.User
	password := *config.NebulaClientSettings.Connection.Password
	*config.NebulaClientSettings.Connection.Address = ""
	*config.NebulaClientSettings.Connection.User = ""
	*config.NebulaClientSettings.Connection.Password = ""

	// erase path infomation
	*config.LogPath = "import.log"
	paths := make([]string, 0)
	failDataPaths := make([]string, 0)
	for _, file := range config.Files {
		paths = append(paths, filepath.Join(Config.Cfg.Web.UploadDir, *file.Path))
		failDataPaths = append(failDataPaths, filepath.Join(dir, "err", *file.FailDataPath))
		_, fileName := filepath.Split(*file.Path)
		_, fileDataName := filepath.Split(*file.FailDataPath)
		*file.Path = fileName
		*file.FailDataPath = fileDataName
	}

	outYaml, err := yaml.Marshal(config)
	if err != nil {
		return err
	}
	if err := os.WriteFile(path, outYaml, 0644); err != nil {
		zap.L().Warn("write"+path+"file error", zap.Error(err))
		return err
	}

	*config.NebulaClientSettings.Connection.Address = address
	*config.NebulaClientSettings.Connection.User = user
	*config.NebulaClientSettings.Connection.Password = password
	for i, file := range config.Files {
		*file.Path = paths[i]
		*file.FailDataPath = failDataPaths[i]
	}
	return nil
}

func Import(taskID string, conf *importconfig.YAMLConfig) (err error) {
	runnerLogger := logger.NewRunnerLogger(*conf.LogPath)
	if err := conf.ValidateAndReset("", runnerLogger); err != nil {
		return err
	}

	task, _ := GetTaskMgr().GetTask(taskID)
	go func() {
		result := ImportResult{}
		now := time.Now()
		task.GetRunner().Run(conf)
		timeCost := time.Since(now).Milliseconds()
		result.TaskId = taskID
		result.TimeCost = fmt.Sprintf("%dms", timeCost)
		if rerrs := task.GetRunner().Errors(); len(rerrs) != 0 {
			allErrIsNotCompleteError := true
			for _, rerr := range rerrs {
				err := rerr.(importerErrors.ImporterError)
				if err.ErrCode != importerErrors.NotCompleteError {
					allErrIsNotCompleteError = false
					break
				}
			}
			if allErrIsNotCompleteError {
				task.TaskInfo.TaskStatus = StatusFinished.String()
				result.FailedRows = task.GetRunner().NumFailed
				err1 := GetTaskMgr().FinishTask(taskID)
				if err1 != nil {
					zap.L().Warn("finish task fail", zap.Error(err1))
				}
				zap.L().Debug(fmt.Sprintf("Success to finish a import task: `%s`, task result: `%v`", taskID, result))
				return
			}
			// TODO: return all errors
			task.TaskInfo.TaskStatus = StatusAborted.String()
			err, _ := rerrs[0].(importerErrors.ImporterError)
			result.ErrorResult.ErrorCode = err.ErrCode
			result.ErrorResult.ErrorMsg = err.ErrMsg.Error()
			task.TaskInfo.TaskMessage = err.ErrMsg.Error()
			err1 := GetTaskMgr().AbortTask(taskID)
			if err1 != nil {
				zap.L().Warn("finish task fail", zap.Error(err1))
			}
			zap.L().Warn(fmt.Sprintf("Failed to finish a import task: `%s`, task result: `%v`", taskID, result))
		} else {
			task.TaskInfo.TaskStatus = StatusFinished.String()
			result.FailedRows = task.GetRunner().NumFailed
			err := GetTaskMgr().FinishTask(taskID)
			if err != nil {
				zap.L().Warn("finish task fail", zap.Error(err))
			}
			zap.L().Debug(fmt.Sprintf("Success to finish a import task: `%s`, task result: `%v`", taskID, result))
		}
	}()
	return nil
}

func ImportStatus(taskID string) (*TaskInfo, error) {
	if t, ok := GetTaskMgr().GetTask(taskID); ok {
		if t.GetRunner() != nil {
			err := GetTaskMgr().UpdateTaskInfo(taskID)
			if err != nil {
				return nil, err
			}
		}
		return t.TaskInfo, nil
	}
	return nil, errors.New("task is not exist")
}

func ImportAction(taskID string, address string, username string, taskAction TaskAction) (result ActionResult, err error) {
	zap.L().Debug(fmt.Sprintf("Start a import task action: `%s` for task: `%s`", taskAction.String(), taskID))

	result = ActionResult{}

	switch taskAction {
	case ActionQuery:
		actionQuery(taskID, address, username, &result, false)
	case ActionQueryAll:
		actionQueryAll(address, username, &result)
	case ActionStop:
		actionStop(taskID, address, username, &result, false)
	case ActionStopAll:
		actionStopAll(address, username, &result)
	case ActionDel:
		actionDel(taskID, address, username, &result)
	default:
		err = errors.New("unknown task action")
	}

	zap.L().Debug(fmt.Sprintf("The import task action: `%s` for task: `%s` finished, action result: `%v`", taskAction.String(), taskID, result))

	return result, err
}

func DeleteImportTask(taskID, address, username string) error {
	if id, err := strconv.Atoi(taskID); err != nil {
		zap.L().Warn(fmt.Sprintf("stop task fail, id : %s", taskID), zap.Error(err))
		return errors.New("task not existed")
	} else {
		_, err := taskmgr.db.FindTaskInfoByIdAndAddresssAndUser(id, address, username)
		if err != nil {
			zap.L().Warn(fmt.Sprintf("stop task fail, id : %s", taskID), zap.Error(err))
			return errors.New("task not existed")
		}
	}
	err := GetTaskMgr().DelTask(taskID)
	if err != nil {
		return fmt.Errorf("task del fail, %s", err.Error())
	}
	return nil
}

func GetImportTask(taskID, address, username string) (*types.GetImportTaskData, error) {
	task := Task{}
	result := &types.GetImportTaskData{}

	if id, err := strconv.Atoi(taskID); err != nil {
		zap.L().Warn(fmt.Sprintf("UpdateTaskInfo fail, id : %s", taskID), zap.Error(err))
		return nil, errors.New("task not existed")
	} else {
		_, err := taskmgr.db.FindTaskInfoByIdAndAddresssAndUser(id, address, username)
		if err != nil {
			zap.L().Warn(fmt.Sprintf("UpdateTaskInfo fail, id : %s", taskID), zap.Error(err))
			return nil, errors.New("task not existed")
		}
	}

	err := GetTaskMgr().UpdateTaskInfo(taskID)
	if err != nil {
		zap.L().Warn(fmt.Sprintf("UpdateTaskInfo fail, id : %s", taskID), zap.Error(err))
	}
	if t, ok := GetTaskMgr().GetTask(taskID); ok {
		task = *t
		result.Id = fmt.Sprintf("%d", task.TaskInfo.ID)
		result.Status = task.TaskInfo.TaskStatus
		result.CreateTime = task.TaskInfo.CreatedTime
		result.UpdateTime = task.TaskInfo.UpdatedTime
		result.Address = task.TaskInfo.NebulaAddress
		result.User = task.TaskInfo.User
		result.Name = task.TaskInfo.Name
		result.Space = task.TaskInfo.Space
		result.Stats = types.Stats(task.TaskInfo.Stats)
	}

	return result, nil
}

func GetManyImportTask(address, username string, page, pageSize int) (*types.GetManyImportTaskData, error) {
	result := &types.GetManyImportTaskData{
		Total: 0,
		List:  []types.GetImportTaskData{},
	}

	taskIDs, err := GetTaskMgr().GetAllTaskIDs(address, username)
	if err != nil {
		return nil, err
	}

	start := (page - 1) * pageSize
	stop := page * pageSize
	if len(taskIDs) <= start {
		return nil, errors.New("invalid parameter")
	} else {
		if stop >= len(taskIDs) {
			stop = len(taskIDs)
		}
		result.Total = int64(stop - start)

		for i := start; i < stop; i++ {
			data, _ := GetImportTask(taskIDs[i], address, username)
			result.List = append(result.List, *data)
		}
	}

	return result, nil
}

func StopImportTask(taskID, address, username string) error {
	if id, err := strconv.Atoi(taskID); err != nil {
		zap.L().Warn(fmt.Sprintf("stop task fail, id : %s", taskID), zap.Error(err))
		return errors.New("task not existed")
	} else {
		_, err := taskmgr.db.FindTaskInfoByIdAndAddresssAndUser(id, address, username)
		if err != nil {
			zap.L().Warn(fmt.Sprintf("stop task fail, id : %s", taskID), zap.Error(err))
			return errors.New("task not existed")
		}
	}

	err := GetTaskMgr().StopTask(taskID)
	if err != nil {
		zap.L().Warn(fmt.Sprintf("stop task fail, id : %s", taskID), zap.Error(err))
		return err
	} else {
		return nil
	}
}

func actionDel(taskID string, address string, username string, result *ActionResult) {
	if id, err := strconv.Atoi(taskID); err != nil {
		zap.L().Warn(fmt.Sprintf("stop task fail, id : %s", taskID), zap.Error(err))
		result.Msg = "Task not existed"
		return
	} else {
		_, err := taskmgr.db.FindTaskInfoByIdAndAddresssAndUser(id, address, username)
		if err != nil {
			zap.L().Warn(fmt.Sprintf("stop task fail, id : %s", taskID), zap.Error(err))
			result.Msg = "Task not existed"
			return
		}
	}
	err := GetTaskMgr().DelTask(taskID)
	if err != nil {
		result.Msg = fmt.Sprintf("Task del fail, %s", err.Error())
		return
	}
	result.Msg = fmt.Sprintf("Task del successfully, taskID : %s", taskID)
}

func actionQuery(taskID string, address string, username string, result *ActionResult, skipCheck bool) {
	// a temp task obj for response
	task := Task{}
	if !skipCheck {
		if id, err := strconv.Atoi(taskID); err != nil {
			zap.L().Warn(fmt.Sprintf("UpdateTaskInfo fail, id : %s", taskID), zap.Error(err))
			result.Msg = "Task not existed"
			return
		} else {
			_, err := taskmgr.db.FindTaskInfoByIdAndAddresssAndUser(id, address, username)
			if err != nil {
				zap.L().Warn(fmt.Sprintf("UpdateTaskInfo fail, id : %s", taskID), zap.Error(err))
				result.Msg = "Task not existed"
				return
			}
		}
	}

	err := GetTaskMgr().UpdateTaskInfo(taskID)
	if err != nil {
		zap.L().Warn(fmt.Sprintf("UpdateTaskInfo fail, id : %s", taskID), zap.Error(err))
	}
	if t, ok := GetTaskMgr().GetTask(taskID); ok {
		task = *t
		result.Results = append(result.Results, *task.TaskInfo)
		result.Msg = "Task query successfully"
	} else {
		result.Msg = "Task not existed"
	}
}

/*
	`actionQueryAll` will return all tasks with status Aborted or Processing
*/
func actionQueryAll(address string, username string, result *ActionResult) {
	taskIDs, err := GetTaskMgr().GetAllTaskIDs(address, username)
	if err != nil {
		result.Msg = "Tasks query unsuccessfully"
		return
	}
	for _, taskID := range taskIDs {
		actionQuery(taskID, address, username, result, true)
	}
	sort.Slice(result.Results, func(i, j int) bool {
		return result.Results[i].CreatedTime > result.Results[j].CreatedTime
	})
	result.Msg = "Tasks query successfully"
}

func actionStop(taskID string, address string, username string, result *ActionResult, skipCheck bool) {
	if !skipCheck {
		if id, err := strconv.Atoi(taskID); err != nil {
			zap.L().Warn(fmt.Sprintf("stop task fail, id : %s", taskID), zap.Error(err))
			result.Msg = "Task not existed"
			return
		} else {
			_, err := taskmgr.db.FindTaskInfoByIdAndAddresssAndUser(id, address, username)
			if err != nil {
				zap.L().Warn(fmt.Sprintf("stop task fail, id : %s", taskID), zap.Error(err))
				result.Msg = "Task not existed"
				return
			}
		}
	}

	err := GetTaskMgr().StopTask(taskID)
	actionQuery(taskID, address, username, result, skipCheck)
	if err != nil {
		zap.L().Warn(fmt.Sprintf("stop task fail, id : %s", taskID), zap.Error(err))
		result.Msg = "Task stop failed"
	} else {
		result.Msg = "Task stop successfully"
	}
}

/*
	`actionStopAll` will stop all tasks with status Processing
*/
func actionStopAll(address string, username string, result *ActionResult) {
	taskIDs, err := GetTaskMgr().GetAllTaskIDs(address, username)
	if err != nil {
		result.Msg = "Tasks query unsuccessfully"
		return
	}
	for _, taskID := range taskIDs {
		if _task, ok := GetTaskMgr().GetTask(taskID); ok && _task.TaskInfo.TaskStatus == StatusProcessing.String() {
			actionStop(taskID, address, username, result, true)
		}
	}
	result.Msg = "Tasks stop successfully"
}
