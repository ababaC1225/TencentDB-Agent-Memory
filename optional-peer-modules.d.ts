declare module "openclaw/plugin-sdk/core" {
  export interface OpenClawPluginApi {
    [key: string]: any;
  }
}

declare module "node-llama-cpp" {
  export const LlamaLogLevel: { error: number };
  export function getLlama(opts: { logLevel: number }): Promise<unknown>;
  export function resolveModelFile(model: string, cacheDir?: string): Promise<string>;
}
