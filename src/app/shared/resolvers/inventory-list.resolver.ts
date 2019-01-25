import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { InventoryService } from '../services/inventory.service';
import { NotifyService } from '../services/notify.service';

import { Inventory } from '../models/inventory.model';

@Injectable()
export class InventoryListResolver implements Resolve<Inventory[]> {
    constructor(
        private router: Router,
        private inventoryService: InventoryService,
        private notify: NotifyService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<Inventory[]> {
        return this.inventoryService.getAll().pipe(
            catchError(_ => {
                this.notify.error('Có lỗi xảy ra');
                console.log('error getAllInventory');
                this.router.navigate(['/']);
                return of(null);
            })
        );
    }
}
