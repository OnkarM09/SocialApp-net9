
// Pagination interface to be used for pagination in the app
export interface Pagination {
  currentPage : number;
  itemsPerPage : number;
  totalPages : number;
  totalItems : number;
}
export class PaginatedResult<T> {
  items? : T;
  pagination? : Pagination;
}
