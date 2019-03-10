import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { MaterialTypeService } from '../services/material-type.service';
import { UtilitiesService } from '../services/utilities.service';

import { MaterialType } from '../models/material-type.model';

@Injectable()
export class MaterialTypeListResolver implements Resolve<MaterialType[]> {
    pageNumber = 1;
    pageSize = 10;

    constructor(
        private materialTypeService: MaterialTypeService,
        private utility: UtilitiesService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<MaterialType[]> {
        return this.materialTypeService.getAllPaging(this.pageNumber, this.pageSize).pipe(
            catchError(error => this.utility.handleError(error, 'getAllPagingMaterialType'))
        );
    }
}
