import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Role } from '../models/role.model';
import { User } from '../models/user.model';

@Injectable()
export class RoleService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get(this.baseUrl + 'roles');
  }

  editRolesByUser(user: User, roles: {}) {
    return this.http.put(this.baseUrl + 'roles/editRoles/' + user.userName, roles);
  }
}
