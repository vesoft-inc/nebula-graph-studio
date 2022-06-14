// Code generated by goctl. DO NOT EDIT.
package types

type GetHealth struct {
	Status string `json:"status"`
}

type ExecNGQLParams struct {
	Gql       string   `json:"gql"`
	ParamList []string `json:"paramList,optional"`
}

type BatchExecNGQLParams struct {
	Gqls      []string `json:"gqls"`
	ParamList []string `json:"paramList,optional"`
}

type ConnectDBParams struct {
	Address       string `json:"address"`
	Port          int    `json:"port"`
	Authorization string `header:"Authorization"`
}

type ConnectDBResult struct {
	Version string `json:"version"`
}

type AnyResponse struct {
	Data interface{} `json:"data"`
}

type FileDestroyRequest struct {
	Name string `path:"name" validate:"required"`
}

type FileStat struct {
	Content    [][]string `json:"content"`
	WithHeader bool       `json:"withHeader"`
	DataType   string     `json:"dataType"`
	Name       string     `json:"name"`
	Size       int64      `json:"size"`
}

type FilesIndexData struct {
	List []FileStat `json:"list"`
}

type ImportTaskConnection struct {
	User     *string `json:"user" validate:"required"`
	Password *string `json:"password" validate:"required"`
	Address  *string `json:"address" validate:"required"`
}

type ImportTaskClientSettings struct {
	Retry             *int                  `json:"retry,optional"`
	Concurrency       *int                  `json:"concurrency,optional"`
	ChannelBufferSize *int                  `json:"channelBufferSize,optional"`
	Space             *string               `json:"space" validate:"required"`
	Connection        *ImportTaskConnection `json:"connection" validate:"required"`
	PostStart         *ImportTaskPostStart  `json:"postStart,optional"`
	PreStop           *ImportTaskPreStop    `json:"preStop,optional"`
}

type ImportTaskPostStart struct {
	Commands    *string `json:"commands, optional"`
	AfterPeriod *string `json:"afterPeriod, optional"`
}

type ImportTaskPreStop struct {
	Commands *string `json:"commands,optional"`
}

type ImportTaskCSV struct {
	WithHeader *bool   `json:"withHeader,optional"`
	WithLabel  *bool   `json:"withLabel,optional"`
	Delimiter  *string `json:"delimiter,optional"`
}

type ImportTaskVID struct {
	Index    *int64  `json:"index" validate:"required"`
	Type     *string `json:"type" validate:"required"`
	Function *string `json:"function,optional"`
	Prefix   *string `json:"prefix,optional"`
}

type ImportTaskTagProp struct {
	Name  *string `json:"name" validate:"required"`
	Type  *string `json:"type" validate:"required"`
	Index *int64  `json:"index" validate:"required"`
}

type ImportTaskTag struct {
	Name  *string              `json:"name" validate:"required"`
	Props []*ImportTaskTagProp `json:"props" validate:"required"`
}

type ImportTaskVertex struct {
	VID  *ImportTaskVID   `json:"vid" validate:"required"`
	Tags []*ImportTaskTag `json:"tags" validate:"required"`
}

type ImportTaskEdgeID struct {
	Index    *int64  `json:"index" validate:"required"`
	Function *string `json:"function,optional"`
	Type     *string `json:"type" validate:"required"`
	Prefix   *string `json:"prefix,optional"`
}

type ImportTaskEdgeRank struct {
	Index *int64 `json:"index"`
}

type ImportTaskEdgeProp struct {
	Name  *string `json:"name"`
	Type  *string `json:"type"`
	Index *int64  `json:"index"`
}

type ImportTaskEdge struct {
	Name   *string               `json:"name" validate:"required"`
	SrcVID *ImportTaskEdgeID     `json:"srcVID" validate:"required"`
	DstVID *ImportTaskEdgeID     `json:"dstVID" validate:"required"`
	Rank   *ImportTaskEdgeRank   `json:"rank, optional"`
	Props  []*ImportTaskEdgeProp `json:"props" validate:"required"`
}

type ImportTaskSchema struct {
	Type   *string           `json:"type" validate:"required"`
	Edge   *ImportTaskEdge   `json:"edge,optional"`
	Vertex *ImportTaskVertex `json:"vertex,optional"`
}

type ImportTaskFile struct {
	Path         *string           `json:"path" validate:"required"`
	FailDataPath *string           `json:"failDataPath" validate:"required"`
	BatchSize    *int              `json:"batchSize,optional"`
	Limit        *int              `json:"limit, optional"`
	InOrder      *bool             `json:"inOrder, optional"`
	Type         *string           `json:"type" validate:"required"`
	CSV          *ImportTaskCSV    `json:"csv" validate:"required"`
	Schema       *ImportTaskSchema `json:"schema" validate:"required"`
}

type ImportTaskConfig struct {
	Version         *string                   `json:"version" validate:"required"`
	Description     *string                   `json:"description,optional"`
	RemoveTempFiles *bool                     `json:"removeTempFiles,optional"`
	ClientSettings  *ImportTaskClientSettings `json:"clientSettings" validate:"required"`
	Files           []*ImportTaskFile         `json:"files" validate:"required"`
}

type CreateImportTaskRequest struct {
	Name   string           `json:"name" validate:"required"`
	Config ImportTaskConfig `json:"config" validate:"required"`
}

type CreateImportTaskData struct {
	Id string `json:"id"`
}

type GetImportTaskRequest struct {
	Id string `path:"id" validate:"required"`
}

type GetImportTaskData struct {
	Id         string          `json:"id"`
	Name       string          `json:"name"`
	User       string          `json:"user"`
	Address    string          `json:"address"`
	Space      string          `json:"space"`
	Status     string          `json:"status"`
	Message    string          `json:"message"`
	CreateTime int64           `json:"createTime"`
	UpdateTime int64           `json:"updateTime"`
	Stats      ImportTaskStats `json:"stats"`
}

type ImportTaskStats struct {
	NumFailed          int64 `json:"numFailed"`
	NumReadFailed      int64 `json:"numReadFailed"`
	TotalCount         int64 `json:"totalCount"`
	TotalBatches       int64 `json:"totalBatches"`
	TotalLatency       int64 `json:"totalLatency"`
	TotalReqTime       int64 `json:"totalReqTime"`
	TotalBytes         int64 `json:"totalBytes"`
	TotalImportedBytes int64 `json:"totalImportedBytes"`
}

type GetManyImportTaskRequest struct {
	Page     int `form:"page,default=1"`
	PageSize int `form:"pageSize,default=100"`
}

type GetManyImportTaskData struct {
	Total int64               `json:"total"`
	List  []GetImportTaskData `json:"list"`
}

type GetManyImportTaskLogRequest struct {
	Id     string `path:"id" validate:"required"`
	File   string `form:"file" validate:"required"`
	Offset int64  `form:"offset" validate:"min=0"`
	Limit  int64  `form:"limit" validate:"min=1"`
}

type GetManyImportTaskLogData struct {
	Logs []string `json:"logs"`
}

type GetImportTaskLogNamesRequest struct {
	Id string `path:"id" validate:"required""`
}

type GetImportTaskLogNamesData struct {
	Names []string `json:"names"`
}

type DeleteImportTaskRequest struct {
	Id string `path:"id"`
}

type StopImportTaskRequest struct {
	Id string `path:"id"`
}

type DownloadLogsRequest struct {
	Id   string `path:"id" validate:"required"`
	Name string `form:"name" validate:"required"`
}

type DownloadConfigsRequest struct {
	Id string `path:"id" validate:"required"`
}

type GetWorkingDirResult struct {
	TaskDir   string `json:"taskDir,omitempty"`
	UploadDir string `json:"uploadDir,omitempty"`
}
