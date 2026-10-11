// This file was bundled by Encore v1.58.6
//
// https://encore.dev

// encore.gen/internal/entrypoints/combined/main.ts
import { registerGateways, registerHandlers, run } from "encore.dev/internal/codegen/appinit";

// hello/hello.ts
import { api } from "encore.dev/api";
var get = api({ expose: true, method: "GET", path: "/api/hello" }, () => {
  return { message: "Hello World" };
});

// hello/encore.service.ts
import { Service } from "encore.dev/service";
var encore_service_default = new Service("hello");

// encore.gen/internal/entrypoints/combined/main.ts
var gateways = [];
var handlers = [
  {
    apiRoute: {
      service: "hello",
      name: "get",
      handler: get,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default.cfg.middlewares || []
  }
];
registerGateways(gateways);
registerHandlers(handlers);
await run(import.meta.url);
//# sourceMappingURL=main.mjs.map
