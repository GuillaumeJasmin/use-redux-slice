export type Slice = {
  name: string;
  selectors: Record<string, (state: any, ...params: any[]) => any>;
  actions: Record<string, (...params: any[]) => any>;
};
