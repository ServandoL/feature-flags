export enum Rooms {
  FEATURE_FLAGS = 'feature-flags',
}

export enum PublishEvents {
  FLAG = 'flag'
}

export interface AppFlags {
  appName: string;
  flags: FlagDescription[];
}

export interface FlagDescription {
  name: string;
  enabled: boolean;
}
