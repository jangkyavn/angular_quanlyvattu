import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';
import { PaginatedResult } from '../models/pagination.model';
import { PagingParams } from '../params/paging.param';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllPaging(page?: any, itemsPerPage?: any, pagingParams?: PagingParams): Observable<PaginatedResult<User[]>> {
    const paginatedResult = new PaginatedResult<User[]>();

    let params = new HttpParams();
    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    if (pagingParams != null) {
      params = params.append('keyword', pagingParams.keyword);
      params = params.append('sortKey', pagingParams.sortKey);
      params = params.append('sortValue', pagingParams.sortValue);
    }

    return this.http.get<User[]>(this.baseUrl + 'users', { observe: 'response', params })
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        })
      );
  }

  getDetail(id: any) {
    return this.http.get(this.baseUrl + 'users/' + id);
  }

  addNew(user: User) {
    return this.http.post(this.baseUrl + 'users', user);
  }

  update(user: User) {
    return this.http.put(this.baseUrl + 'users', user);
  }

  delete(id: any) {
    return this.http.delete(this.baseUrl + 'users/' + id);
  }

  changeStatus(id: any) {
    return this.http.put(this.baseUrl + 'users/changeStatus/' + id, {});
  }

  checkUserNameExists(userName: string) {
    return this.http.get(this.baseUrl + 'users/checkUserNameExists/' + userName);
  }

  checkEmailExists(email: string) {
    return this.http.get(this.baseUrl + 'users/checkEmailExists/' + email);
  }

  checkCurrentPassword(password: string) {
    return this.http.get(this.baseUrl + 'users/checkCurrentPassword/' + password);
  }

  changePassword(newPassword: string) {
    return this.http.put(this.baseUrl + 'users/changePassword/' + newPassword, {});
  }

  getTotalCount() {
    return this.http.get(this.baseUrl + 'users/getTotalCount');
  }
}
