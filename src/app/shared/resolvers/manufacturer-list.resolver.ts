import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ManufacturerService } from '../services/manufacturer.service';
import { UtilitiesService } from '../services/utilities.service';

import { Manufacturer } from '../models/manufacturer.model';

@Injectable()
export class ManufacturerListResolver implements Resolve<Manufacturer[]> {
    pageNumber = 1;
    pageSize = 10;

    constructor(
        private manufacturerService: ManufacturerService,
        private utility: UtilitiesService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<Manufacturer[]> {
        return this.manufacturerService.getAllPaging(this.pageNumber, this.pageSize).pipe(
            catchError(error => this.utility.handleError(error, 'getAllPagingManufacturer'))
        );
    }
}
