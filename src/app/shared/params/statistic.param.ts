import { PagingParams } from './paging.param';

export interface StatisticParams extends PagingParams {
    maKho?: number;
    maHM?: number;
    maLoaiVT?: number;
    sortValue?: string;
    sortKey?: string;
    fromDate?: string;
    toDate?: string;
    searchKey?: string;
    searchValue?: string;
}
