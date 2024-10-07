import { apiCall } from "encore.dev/internal/codegen/api";
import { registerTestHandler } from "encore.dev/internal/codegen/appinit";

export async function get(params) {
    const handler = (await import("../../../../hello\\hello")).get;
    registerTestHandler({ service: "hello", name: "get", raw: false, handler, streaming: false });
    return apiCall("hello", "get", params);
}

