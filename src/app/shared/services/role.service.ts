import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Role } from '../models/role.model';
import { User } from '../models/user.model';
import { PagingParams } from '../params/paging.param';
import { PaginatedResult } from '../models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get(this.baseUrl + 'roles');
  }

  getAllPaging(page?: any, itemsPerPage?: any, pagingParams?: PagingParams): Observable<PaginatedResult<Role[]>> {
    const paginatedResult = new PaginatedResult<Role[]>();

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

    return this.http.get<Role[]>(this.baseUrl + 'roles/getAllPaging', { observe: 'response', params })
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

  editRolesByUser(user: User, roles: {}) {
    return this.http.put(this.baseUrl + 'roles/editRoles/' + user.userName, roles);
  }

  getDetail(id: any) {
    return this.http.get(this.baseUrl + 'roles/' + id);
  }

  addNew(role: Role) {
    return this.http.post(this.baseUrl + 'roles', role);
  }

  update(role: Role) {
    return this.http.put(this.baseUrl + 'roles', role);
  }

  delete(id: any) {
    return this.http.delete(this.baseUrl + 'roles/' + id);
  }

  checkNameExists(name: string) {
    return this.http.get(this.baseUrl + 'roles/checkNameExists/' + name);
  }

  getListPermissionById(id: any) {
    return this.http.get(this.baseUrl + 'roles/getListPermissionByRoleId/' + id);
  }

  getListPermissionByRoles() {
    return this.http.get(this.baseUrl + 'roles/getListPermissionByRoles');
  }

  checkPermission(functionId: string, action: string) {
    return this.http.get(this.baseUrl + `roles/checkPermission/${functionId}/${action}`);
  }

  savePermission(permissionParams) {
    return this.http.post(this.baseUrl + 'roles/savePermission', permissionParams);
  }
}
