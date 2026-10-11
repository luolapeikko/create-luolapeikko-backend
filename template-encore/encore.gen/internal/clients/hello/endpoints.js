import { apiCall, streamIn, streamOut, streamInOut } from "encore.dev/internal/codegen/api";

export async function get(opts) {
    const params = undefined;
    if (typeof ENCORE_DROP_TESTS === "undefined" && process.env.NODE_ENV === "test") {
        // Load this service's test handlers and middleware only when called.
        // Leave caching to the module loader so test module resets still work.
        const endpoints = await import("./endpoints_testing.js");
        return endpoints.get(params, opts);
    }

    return apiCall("hello", "get", params, opts);
}

export class Client {
  constructor() {
    this.get = get;
  }
}

let _client_instance;

export function ref() {
  if (!_client_instance) {
    _client_instance = new Client();
  }
  return _client_instance;
}
