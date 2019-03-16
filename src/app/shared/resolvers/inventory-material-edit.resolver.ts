import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RoleService } from '../services/role.service';

@Injectable()
export class InventoryMaterialEditResolver implements Resolve<boolean> {
    constructor(
        private roleService: RoleService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
        return this.roleService.checkPermission('PHIEU_KIEM_KE_KHO', 'Update')
            .pipe(map((response: boolean) => response));
    }
}
