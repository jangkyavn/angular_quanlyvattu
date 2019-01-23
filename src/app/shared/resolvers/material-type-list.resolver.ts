import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { MaterialTypeService } from '../services/material-type.service';
import { NotifyService } from '../services/notify.service';

import { MaterialType } from '../models/material-type.model';

@Injectable()
export class MaterialTypeListResolver implements Resolve<MaterialType[]> {
    constructor(
        private router: Router,
        private materialTypeService: MaterialTypeService,
        private notify: NotifyService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<MaterialType[]> {
        return this.materialTypeService.getAll().pipe(
            catchError(_ => {
                this.notify.error('Có lỗi xảy ra');
                console.log('error getAllMaterialType');
                this.router.navigate(['/']);
                return of(null);
            })
        );
    }
}
