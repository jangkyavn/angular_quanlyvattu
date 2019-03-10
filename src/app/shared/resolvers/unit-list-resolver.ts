import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { UnitService } from '../services/unit.service';
import { UtilitiesService } from '../services/utilities.service';

import { Unit } from '../models/unit.model';

@Injectable()
export class UnitListResolver implements Resolve<Unit[]> {
    pageNumber = 1;
    pageSize = 10;

    constructor(
        private unitService: UnitService,
        private utility: UtilitiesService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<Unit[]> {
        return this.unitService.getAllPaging(this.pageNumber, this.pageSize).pipe(
            catchError(error => this.utility.handleError(error, 'getAllPagingUnit'))
        );
    }
}
