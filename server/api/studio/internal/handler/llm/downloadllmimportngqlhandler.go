// Code generated by goctl. DO NOT EDIT.
package llm

import (
	"net/http"

	"github.com/vesoft-inc/go-pkg/validator"
	"github.com/vesoft-inc/nebula-studio/server/api/studio/pkg/ecode"

	"github.com/vesoft-inc/nebula-studio/server/api/studio/internal/logic/llm"
	"github.com/vesoft-inc/nebula-studio/server/api/studio/internal/svc"
	"github.com/vesoft-inc/nebula-studio/server/api/studio/internal/types"
	"github.com/zeromicro/go-zero/rest/httpx"
)

func DownloadLLMImportNgqlHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.DownloadLLMImportNgqlRequest
		if err := httpx.Parse(r, &req); err != nil {
			err = ecode.WithErrorMessage(ecode.ErrParam, err)
			svcCtx.ResponseHandler.Handle(w, r, nil, err)
			return
		}
		if err := validator.Struct(req); err != nil {
			svcCtx.ResponseHandler.Handle(w, r, nil, err)
			return
		}

		l := llm.NewDownloadLLMImportNgqlLogic(r.Context(), svcCtx)
		data, err := l.DownloadLLMImportNgql(req)
		svcCtx.ResponseHandler.Handle(w, r, data, err)
	}
}
