import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { InventoryService } from '../services/inventory.service';

import { Inventory } from '../models/inventory.model';
import { PaginatedResult } from '../models/pagination.model';

@Injectable()
export class InventoryListResolver implements Resolve<PaginatedResult<Inventory[]>> {
    pageNumber = 1;
    pageSize = 10;

    constructor(private inventoryService: InventoryService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<PaginatedResult<Inventory[]>> {
        return this.inventoryService.getAllPaging(this.pageNumber, this.pageSize);
    }
}
