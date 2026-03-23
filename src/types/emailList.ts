export interface IEmailContact {
  id: string;
  emailListId: string;
  email: string;
  name?: string;
  createdAt: string;
}

export interface IEmailList {
  id: string;
  ownerId: string;
  name: string;
  createdAt: string;
  emailContacts?: IEmailContact[];
  _count?: {
    emailContacts: number;
  };
}