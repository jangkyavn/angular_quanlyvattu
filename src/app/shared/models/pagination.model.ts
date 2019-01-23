export interface Pagination {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    firstRowOnPage: number;
    lastRowOnPage: number;
}

export class PaginatedResult<T> {
    result: T;
    pagination: Pagination;
}
