export type Contact = {
  _embedded: {
    contacts: Contacts;
  };
};

export type Contacts = {
  responsible_user_id: number;
}[];
