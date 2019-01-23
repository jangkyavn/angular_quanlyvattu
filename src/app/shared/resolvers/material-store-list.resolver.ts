import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { MaterialStoreService } from '../services/material-store.service';
import { NotifyService } from '../services/notify.service';

import { MaterialStore } from '../models/material-store.model';

@Injectable()
export class MaterialStoreListResolver implements Resolve<MaterialStore[]> {
    constructor(
        private router: Router,
        private materialStoreService: MaterialStoreService,
        private notify: NotifyService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<MaterialStore[]> {
        return this.materialStoreService.getAll().pipe(
            catchError(_ => {
                this.notify.error('Có lỗi xảy ra');
                console.log('error getAllMaterialStore');
                this.router.navigate(['/']);
                return of(null);
            })
        );
    }
}
