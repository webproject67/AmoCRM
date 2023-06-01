export type Lead = {
  _embedded: {
    leads: Leads;
  };
};

export type Leads = {
  pipeline_id: number;
  responsible_user_id: number;
}[];
