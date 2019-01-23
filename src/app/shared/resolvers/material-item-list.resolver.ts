import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { MaterialItemService } from '../services/material-item.service';
import { NotifyService } from '../services/notify.service';

import { MaterialItem } from '../models/material-item.model';

@Injectable()
export class MaterialItemListResolver implements Resolve<MaterialItem[]> {
    constructor(
        private router: Router,
        private materialItemService: MaterialItemService,
        private notify: NotifyService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<MaterialItem[]> {
        return this.materialItemService.getAll().pipe(
            catchError(_ => {
                this.notify.error('Có lỗi xảy ra');
                console.log('error getAllMaterialItem');
                this.router.navigate(['/']);
                return of(null);
            })
        );
    }
}
