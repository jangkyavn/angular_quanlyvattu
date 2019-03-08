import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { RoleService } from '../services/role.service';
import { NotifyService } from '../services/notify.service';

import { Role } from '../models/role.model';

@Injectable()
export class RoleListResolver implements Resolve<Role[]> {
    pageNumber = 1;
    pageSize = 10;

    constructor(
        private router: Router,
        private roleService: RoleService,
        private notify: NotifyService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<Role[]> {
        return this.roleService.getAllPaging(this.pageNumber, this.pageSize).pipe(
            catchError(_ => {
                this.notify.error('Có lỗi xảy ra');
                console.log('error getAllPagingRoles');
                this.router.navigate(['/']);
                return of(null);
            })
        );
    }
}
