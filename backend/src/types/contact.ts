export type Contact = {
  _embedded: {
    contacts: Contacts;
  };
};

export type Contacts = {
  id: number;
}[];
