export type CommandMethod = (...args: any[]) => Promise<any>;

export interface CommandDefinition {
  id: string;
  name: string;
  params: Array<{
    id: string;
    name: string;
    type: string;
  }>;
  method: CommandMethod;
}
