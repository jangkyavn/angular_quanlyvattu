import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { UserService } from '../services/user.service';
import { NotifyService } from '../services/notify.service';

import { User } from '../models/user.model';
import { PaginatedResult } from '../models/pagination.model';

@Injectable()
export class UserListResolver implements Resolve<PaginatedResult<User[]>> {
    pageNumber = 1;
    pageSize = 10;

    constructor(private userService: UserService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<PaginatedResult<User[]>> {
        return this.userService.getAllPaging(this.pageNumber, this.pageSize);
    }
}
