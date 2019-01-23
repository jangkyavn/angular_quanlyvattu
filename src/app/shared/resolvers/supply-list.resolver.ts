import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { SupplyService } from '../services/supply.service';
import { NotifyService } from '../services/notify.service';

import { Supply } from '../models/supply.model';

@Injectable()
export class SupplyListResolver implements Resolve<Supply[]> {
    constructor(
        private router: Router,
        private supplyService: SupplyService,
        private notify: NotifyService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<Supply[]> {
        return this.supplyService.getAll().pipe(
            catchError(_ => {
                this.notify.error('Có lỗi xảy ra');
                console.log('error getAllSupply');
                this.router.navigate(['/']);
                return of(null);
            })
        );
    }
}
