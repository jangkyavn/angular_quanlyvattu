import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { LiquidationMaterialService } from '../services/liquidation-material.service';
import { NotifyService } from '../services/notify.service';

import { LiquidationMaterial } from '../models/liquidation-material.model';

@Injectable()
export class LiquidationMaterialDetailResolver implements Resolve<LiquidationMaterial> {
    constructor(
        private router: Router,
        private liquidationMaterialService: LiquidationMaterialService,
        private notify: NotifyService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<LiquidationMaterial> {
        return this.liquidationMaterialService.getDetail(route.params['id']).pipe(
            catchError(_ => {
                this.notify.error('Có lỗi xảy ra');
                console.log('error getDetailLiquidationMaterial');
                this.router.navigate(['/']);
                return of(null);
            })
        );
    }
}
