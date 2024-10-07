// This file was bundled by Encore v1.41.7
//
// https://encore.dev

// encore.gen/internal/entrypoints/combined/main.ts
import { registerGateways, registerHandlers, run } from "encore.dev/internal/codegen/appinit";

// hello/hello.ts
import { api } from "encore.dev/api";
var get = api({ expose: true, method: "GET", path: "/api/hello" }, () => {
  return { message: "Hello World" };
});

// encore.gen/internal/entrypoints/combined/main.ts
var gateways = [];
var handlers = [
  {
    service: "hello",
    name: "get",
    handler: get,
    raw: false,
    streaming: false
  }
];
registerGateways(gateways);
registerHandlers(handlers);
await run();
//# sourceMappingURL=main.mjs.map
