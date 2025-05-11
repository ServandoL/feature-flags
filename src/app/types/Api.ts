import {FlagDescription} from './FlagDescription';

export interface CreateFlagResponse {
  success: boolean;
  flag: FlagDescription;
}

export interface CreateFlagRequest {
  appName: string;
  name: string;
}

export interface AppFlagsResponse {
  appName: string;
  flags: FlagDescription[];
}

export interface CreateAppResponse {
  __typename: 'InsertOne' | 'UpdateOne';
  success: boolean;
  results: {
    message: string;
  };
}
