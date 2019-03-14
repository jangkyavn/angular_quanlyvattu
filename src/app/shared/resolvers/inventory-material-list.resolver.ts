import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { InventoryMaterialService } from '../services/inventory-material.service';
import { UtilitiesService } from '../services/utilities.service';

import { InventoryMaterial } from '../models/inventory-material.model';

@Injectable()
export class InventoryMaterialListResolver implements Resolve<InventoryMaterial[]> {
    pageNumber = 1;
    pageSize = 10;

    constructor(
        private inventoryMaterialService: InventoryMaterialService,
        private utility: UtilitiesService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<InventoryMaterial[]> {
        return this.inventoryMaterialService.getAllPaging(this.pageNumber, this.pageSize).pipe(
            catchError(error => this.utility.handleError(error, 'getAllPagingInventoryMaterial'))
        );
    }
}
