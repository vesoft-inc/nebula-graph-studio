package gpt

import (
	"encoding/json"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/vesoft-inc/nebula-studio/server/api/studio/pkg/gpt"
	"github.com/vesoft-inc/nebula-studio/server/api/studio/pkg/ws/utils"
)

func Middleware(next utils.TNext) utils.TNext {
	return func(msgReceived *utils.MessageReceive, c *utils.Client) *utils.MessagePost {
		if next == nil || msgReceived == nil {
			return nil
		}
		if msgReceived.Body.MsgType != "gpt" {
			return next(msgReceived, c)
		}
		req := msgReceived.Body.Content
		data, err := gpt.Fetch(req, func(str string) {
			content := map[string]any{}
			if strings.Contains(str, "[DONE]") {
				content["done"] = true
			} else if err := json.Unmarshal([]byte(str), &content); err != nil {
				sendError(fmt.Errorf(err.Error(), str), msgReceived, c)
				return
			}
			sendMsg(c, msgReceived, content)
		})
		if err != nil {
			sendError(err, msgReceived, c)
		}
		if data != nil {
			sendMsg(c, msgReceived, data)
		}
		return nil
	}
}

func sendMsg(c *utils.Client, msgReceived *utils.MessageReceive, content map[string]any) {
	msg := utils.MessagePost{
		Header: utils.MessagePostHeader{
			MsgId:    msgReceived.Header.MsgId,
			SendTime: time.Now().UnixMilli(),
		},
		Body: utils.MessagePostBody{
			MsgType: msgReceived.Body.MsgType,
			Content: map[string]any{
				"code":    0,
				"message": content,
			},
		},
	}
	jsonMsg, err := json.Marshal(msg)
	if err != nil {
		log.Printf("send gpt message error: %v", err)
		return
	}
	c.Send <- jsonMsg
}

func sendError(err error, msgReceived *utils.MessageReceive, c *utils.Client) {
	c.Conn.WriteJSON(utils.MessagePost{
		Header: utils.MessagePostHeader{
			MsgId:    msgReceived.Header.MsgId,
			SendTime: time.Now().UnixMilli(),
		},
		Body: utils.MessagePostBody{
			MsgType: msgReceived.Body.MsgType,
			Content: map[string]any{
				"code":    1,
				"message": err.Error(),
			},
		},
	})
}
