// Code generated by goctl. DO NOT EDIT.
package {{.PkgName}}

import (
	"net/http"

	{{if .HasRequest}}"github.com/vesoft-inc/go-pkg/validator"
	"github.com/vesoft-inc/nebula-studio/server/api/studio/pkg/ecode"

	{{end}}{{if .HasRequest}}"github.com/zeromicro/go-zero/rest/httpx"{{end}}
	{{.ImportPackages}}
)

func {{.HandlerName}}(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		{{if .HasRequest}}var req types.{{.RequestType}}
		if err := httpx.Parse(r, &req); err != nil {
			err = ecode.WithErrorMessage(ecode.ErrParam, err)
			svcCtx.ResponseHandler.Handle(w, r, nil, err)
			return
		}
		if err := validator.Struct(req); err != nil {
			svcCtx.ResponseHandler.Handle(w, r, nil, err)
			return
		}

		{{end}}l := {{.LogicName}}.New{{.LogicType}}(r.Context(), svcCtx)
		{{if .HasResp}}data, {{end}}err := l.{{.Call}}({{if .HasRequest}}&req{{end}})
		{{if .HasResp}}svcCtx.ResponseHandler.Handle(w, r, data, err){{else}}svcCtx.ResponseHandler.Handle(w, r, nil, err){{end}}
	}
}
