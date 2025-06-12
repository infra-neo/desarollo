export type CommandMethod = (...args: any[]) => Promise<any>;

export interface CommandDefinition {
  id: string;
  name: string;
  description: string;
  params: Array<{
    id: string;
    name: string;
    type: string;
    selectOptions?: Array<{ id: string; value: string }>;
  }>;
  method: CommandMethod;
}
