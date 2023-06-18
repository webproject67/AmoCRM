export interface IData {
  leads: ILead[];
  pipelines: IPipeline[];
  users: IUser[];
}

export interface ILead {
  pipeline_id: number;
  _embedded: {
    contacts: {
      id: number;
    }[];
  };
}

export interface IPipeline {
  id: number;
}

export interface IUser {
  id: number;
}

export interface IContact {
  id: number;
}

export interface IResponseLead {
  _embedded: {
    leads: ILead[];
  };
}

export interface IResponsePipeline {
  _embedded: {
    pipelines: IPipeline[];
  };
}

export interface IResponseUser {
  _embedded: {
    users: IUser[];
  };
}

export interface IResponseContact {
  _embedded: {
    contacts: IContact[];
  };
}

export interface IQueryKit {
  query: string;
}

export interface IToken {
  access_token: string;
  refresh_token: string;
}

export interface IUserDb {
  domain: string;
  refreshToken: string;
}

export interface IBodyParam {
  grant_type: 'refresh_token' | 'authorization_code';
  refresh_token?: string;
  code?: string;
}
