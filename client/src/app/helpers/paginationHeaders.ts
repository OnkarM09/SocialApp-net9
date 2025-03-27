import { HttpParams, HttpResponse } from "@angular/common/http";
import { signal } from "@angular/core";
import { PaginatedResult } from "../models/pagination";

export function setPaginationResponse<T>(response: HttpResponse<T>,
  paginatedResultSignal: ReturnType<typeof signal<PaginatedResult<T> | null>>) {
  paginatedResultSignal.set({
    items: response.body as T,
    pagination: JSON.parse(response.headers.get('Pagination')!)
  });
}

export function setPaginationHeaders(pageNum: number, pageSize: number): HttpParams {
  let params = new HttpParams();
  if (pageSize && pageNum) {
    params = params.append('pageNumber', pageNum);
    params = params.append('pageSize', pageSize);
  }
  return params;
}
