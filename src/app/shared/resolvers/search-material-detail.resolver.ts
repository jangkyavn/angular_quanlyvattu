import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RoleService } from '../services/role.service';

@Injectable()
export class SearchMaterialDetailResolver implements Resolve<boolean> {
    pageNumber = 1;
    pageSize = 10;

    constructor(private roleService: RoleService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
        return this.roleService.checkPermission('TIM_KIEM_VAT_TU', 'Read')
            .pipe(map((response: boolean) => response));
    }
}
