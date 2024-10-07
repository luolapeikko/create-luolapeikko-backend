import { registerHandlers, run, type Handler } from "encore.dev/internal/codegen/appinit";
import { get as getImpl0 } from "../../../../../hello\\hello";

const handlers: Handler[] = [
    {
        service:   "hello",
        name:      "get",
        handler:   getImpl0,
        raw:       false,
        streaming: false,
    },
];

registerHandlers(handlers);
await run();
