// Code generated by goctl. DO NOT EDIT.
package favorite

import (
	"net/http"

	"github.com/vesoft-inc/go-pkg/validator"
	"github.com/vesoft-inc/nebula-studio/server/api/studio/pkg/ecode"

	"github.com/vesoft-inc/nebula-studio/server/api/studio/internal/logic/favorite"
	"github.com/vesoft-inc/nebula-studio/server/api/studio/internal/svc"
	"github.com/vesoft-inc/nebula-studio/server/api/studio/internal/types"
	"github.com/zeromicro/go-zero/rest/httpx"
)

func DeleteHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.DeleteFavoriteRequest
		if err := httpx.Parse(r, &req); err != nil {
			err = ecode.WithCode(ecode.ErrParam, err)
			svcCtx.ResponseHandler.Handle(w, r, nil, err)
			return
		}
		if err := validator.Struct(req); err != nil {
			svcCtx.ResponseHandler.Handle(w, r, nil, err)
			return
		}

		l := favorite.NewDeleteLogic(r.Context(), svcCtx)
		err := l.Delete(req)
		svcCtx.ResponseHandler.Handle(w, r, nil, err)
	}
}
