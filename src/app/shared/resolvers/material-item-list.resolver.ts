import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { MaterialItemService } from '../services/material-item.service';
import { UtilitiesService } from '../services/utilities.service';

import { MaterialItem } from '../models/material-item.model';

@Injectable()
export class MaterialItemListResolver implements Resolve<MaterialItem[]> {
    pageNumber = 1;
    pageSize = 10;

    constructor(
        private materialItemService: MaterialItemService,
        private utility: UtilitiesService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<MaterialItem[]> {
        return this.materialItemService.getAllPaging(this.pageNumber, this.pageSize).pipe(
            catchError(error => this.utility.handleError(error, 'getAllPagingMaterialItem'))
        );
    }
}
