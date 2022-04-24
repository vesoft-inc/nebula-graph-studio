// Code generated by goctl. DO NOT EDIT.
package handler

import (
	"net/http"

	gateway "github.com/vesoft-inc/nebula-studio/server/api/studio/internal/handler/gateway"
	health "github.com/vesoft-inc/nebula-studio/server/api/studio/internal/handler/health"
	"github.com/vesoft-inc/nebula-studio/server/api/studio/internal/svc"

	"github.com/zeromicro/go-zero/rest"
)

func RegisterHandlers(server *rest.Server, serverCtx *svc.ServiceContext) {
	server.AddRoutes(
		[]rest.Route{
			{
				Method:  http.MethodGet,
				Path:    "/health",
				Handler: health.GetHandler(serverCtx),
			},
		},
	)

	server.AddRoutes(
		[]rest.Route{
			{
				Method:  http.MethodPost,
				Path:    "/exec",
				Handler: gateway.ExecNGQLHandler(serverCtx),
			},
		},
		rest.WithPrefix("/api-nebula/db"),
	)

	server.AddRoutes(
		[]rest.Route{
			{
				Method:  http.MethodPost,
				Path:    "/connect",
				Handler: gateway.ConnectHandler(serverCtx),
			},
		},
		rest.WithPrefix("/api-nebula/db"),
	)
}
