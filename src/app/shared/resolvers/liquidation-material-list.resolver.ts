import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { LiquidationMaterialService } from '../services/liquidation-material.service';
import { NotifyService } from '../services/notify.service';

import { LiquidationMaterial } from '../models/liquidation-material.model';

@Injectable()
export class LiquidationMaterialListResolver implements Resolve<LiquidationMaterial[]> {
    pageNumber = 1;
    pageSize = 10;

    constructor(
        private router: Router,
        private liquidationMaterialService: LiquidationMaterialService,
        private notify: NotifyService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<LiquidationMaterial[]> {
        return this.liquidationMaterialService.getAllPaging(this.pageNumber, this.pageSize).pipe(
            catchError(_ => {
                this.notify.error('Có lỗi xảy ra');
                console.log('error getAllPagingLiquidationMaterial');
                this.router.navigate(['/']);
                return of(null);
            })
        );
    }
}
