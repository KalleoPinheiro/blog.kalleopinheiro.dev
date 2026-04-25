export class HookError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "HookError";
  }
}

export type HookContext = {
  resource: string;
  action: "CREATE" | "UPDATE" | "DELETE";
  data?: unknown;
  params?: Record<string, unknown>;
};

export type Hook = (context: HookContext) => Promise<void> | void;

export class HooksRegistry {
  private hooks: Map<string, Hook[]> = new Map();

  register(eventName: string, hook: Hook) {
    const hooks = this.hooks.get(eventName);
    if (hooks) {
      hooks.push(hook);
    } else {
      this.hooks.set(eventName, [hook]);
    }
  }

  async run(eventName: string, context: HookContext): Promise<void> {
    const hooks = this.hooks.get(eventName) || [];
    for (const hook of hooks) {
      await hook(context);
    }
  }
}

export const globalHooksRegistry = new HooksRegistry();
