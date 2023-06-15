export type Lead = {
  _embedded: {
    leads: Leads;
  };
};

export type Leads = {
  pipeline_id: number;
  _embedded: {
    contacts: {
      id: number;
    }[];
  };
}[];
