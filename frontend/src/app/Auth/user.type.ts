export type User_Details = {
    fullname: string;
    email: string;
    password: string;
}

export type User = {
  _id: string;
  fullname?: string;
  email: string;
  password: string;
};