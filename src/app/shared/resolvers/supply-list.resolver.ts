import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { SupplyService } from '../services/supply.service';
import { UtilitiesService } from '../services/utilities.service';

import { Supply } from '../models/supply.model';

@Injectable()
export class SupplyListResolver implements Resolve<Supply[]> {
    pageNumber = 1;
    pageSize = 10;

    constructor(
        private router: Router,
        private supplyService: SupplyService,
        private utility: UtilitiesService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<Supply[]> {
        return this.supplyService.getAllPaging(this.pageNumber, this.pageSize).pipe(
            catchError(error => this.utility.handleError(error, 'getAllPagingSupply'))
        );
    }
}
