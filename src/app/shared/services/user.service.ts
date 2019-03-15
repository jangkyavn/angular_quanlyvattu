import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

import { UtilitiesService } from './utilities.service';

import { User } from '../models/user.model';
import { PaginatedResult } from '../models/pagination.model';
import { PagingParams } from '../params/paging.param';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient,
    private utility: UtilitiesService) { }

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
        }),
        catchError(error => this.utility.handleError(error, 'getAllPagingUser'))
      );
  }

  getDetail(id: any) {
    return this.http.get(this.baseUrl + 'users/' + id)
      .pipe(catchError(error => this.utility.handleError(error, 'getDetailUser')));
  }

  addNew(user: User) {
    return this.http.post(this.baseUrl + 'users', user)
      .pipe(catchError(error => this.utility.handleError(error, 'addNewUser')));
  }

  update(user: User) {
    return this.http.put(this.baseUrl + 'users', user)
      .pipe(catchError(error => this.utility.handleError(error, 'updateUser')));
  }

  delete(id: any) {
    return this.http.delete(this.baseUrl + 'users/' + id)
      .pipe(catchError(error => this.utility.handleError(error, 'deleteUser')));
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

  changePasswordForOther(id: any, newPassword: string) {
    return this.http.put(this.baseUrl + `users/changePasswordForOther/${id}/${newPassword}`, {});
  }

  getTotalCount() {
    return this.http.get(this.baseUrl + 'users/getTotalCount');
  }
}
