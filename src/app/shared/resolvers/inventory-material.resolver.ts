import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

import { InventoryMaterialService } from '../services/inventory-material.service';
import { UtilitiesService } from '../services/utilities.service';

import { InventoryMaterial } from '../models/inventory-material.model';

@Injectable()
export class InventoryMaterialResolver implements Resolve<InventoryMaterial> {
    constructor(
        private inventoryMaterialService: InventoryMaterialService,
        private utility: UtilitiesService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<InventoryMaterial> {
        return this.inventoryMaterialService.getDetail(route.params['id']);
    }
}
