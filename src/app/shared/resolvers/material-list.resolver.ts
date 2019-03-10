import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { MaterialService } from '../services/material.service';
import { UtilitiesService } from '../services/utilities.service';

import { Material } from '../models/material.model';

@Injectable()
export class MaterialListResolver implements Resolve<Material[]> {
    pageNumber = 1;
    pageSize = 10;

    constructor(
        private materialService: MaterialService,
        private utility: UtilitiesService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<Material[]> {
        return this.materialService.getAllPaging(this.pageNumber, this.pageSize).pipe(
            catchError(error => this.utility.handleError(error, 'getAllPagingMaterial'))
        );
    }
}
