import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { UnitService } from '../services/unit.service';
import { NotifyService } from '../services/notify.service';

import { Unit } from '../models/unit.model';

@Injectable()
export class UnitListResolver implements Resolve<Unit[]> {
    constructor(
        private router: Router,
        private unitService: UnitService,
        private notify: NotifyService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<Unit[]> {
        return this.unitService.getAll().pipe(
            catchError(_ => {
                this.notify.error('Có lỗi xảy ra');
                console.log('error getAllUnit');
                this.router.navigate(['/']);
                return of(null);
            })
        );
    }
}
