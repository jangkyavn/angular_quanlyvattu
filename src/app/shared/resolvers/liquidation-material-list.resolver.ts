import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { LiquidationMaterialService } from '../services/liquidation-material.service';
import { NotifyService } from '../services/notify.service';

import { LiquidationMaterial } from '../models/liquidation-material.model';
import { PaginatedResult } from '../models/pagination.model';

@Injectable()
export class LiquidationMaterialListResolver implements Resolve<PaginatedResult<LiquidationMaterial[]>> {
    pageNumber = 1;
    pageSize = 10;

    constructor(
        private router: Router,
        private liquidationMaterialService: LiquidationMaterialService,
        private notify: NotifyService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<PaginatedResult<LiquidationMaterial[]>> {
        return this.liquidationMaterialService.getAllPaging(this.pageNumber, this.pageSize);
    }
}
