import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { MaterialService } from '../services/material.service';
import { NotifyService } from '../services/notify.service';

import { Material } from '../models/material.model';

@Injectable()
export class MaterialDetailResolver implements Resolve<Material> {
    constructor(
        private router: Router,
        private materialService: MaterialService,
        private notify: NotifyService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<Material> {
        return this.materialService.getDetail(route.params['id']).pipe(
            catchError(_ => {
                this.notify.error('Có lỗi xảy ra');
                console.log('error getDetailMaterial');
                this.router.navigate(['/']);
                return of(null);
            })
        );
    }
}
