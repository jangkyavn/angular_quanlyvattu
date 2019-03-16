import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { InventoryMaterialService } from '../services/inventory-material.service';

import { InventoryMaterial } from '../models/inventory-material.model';
import { PaginatedResult } from '../models/pagination.model';

@Injectable()
export class InventoryMaterialListResolver implements Resolve<PaginatedResult<InventoryMaterial[]>> {
    pageNumber = 1;
    pageSize = 10;

    constructor(private inventoryMaterialService: InventoryMaterialService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<PaginatedResult<InventoryMaterial[]>> {
        return this.inventoryMaterialService.getAllPaging(this.pageNumber, this.pageSize);
    }
}
