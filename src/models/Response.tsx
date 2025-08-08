export interface IResponseList<Data> {
  data: Data;
  meta: IResponsePagination;
}

export interface IResponsePagination {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}
