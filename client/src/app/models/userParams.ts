import { User } from "./user";

export class UserParams{
  gender : string;
  minAge = 18;
  maxAge = 150;
  pageNumber = 1;
  pageSize = 12;
  orderBy = 'lastActive';
  searchString  = '';

  constructor(user : User | null){
    this.gender = ""
  }
}
