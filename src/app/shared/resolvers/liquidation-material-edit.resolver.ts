import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RoleService } from '../services/role.service';

@Injectable()
export class LiquidationMaterialEditResolver implements Resolve<boolean> {
    constructor(
        private roleService: RoleService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
        return this.roleService.checkPermission('THANH_LY_VAT_TU', 'Update')
            .pipe(map((response: boolean) => response));
    }
}
