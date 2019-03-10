import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { MaterialStoreService } from '../services/material-store.service';
import { UtilitiesService } from '../services/utilities.service';

import { MaterialStore } from '../models/material-store.model';

@Injectable()
export class MaterialStoreListResolver implements Resolve<MaterialStore[]> {
    pageNumber = 1;
    pageSize = 10;

    constructor(
        private materialStoreService: MaterialStoreService,
        private utility: UtilitiesService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<MaterialStore[]> {
        return this.materialStoreService.getAllPaging(this.pageNumber, this.pageSize).pipe(
            catchError(error => this.utility.handleError(error, 'getAllPagingMaterialStore'))
        );
    }
}
