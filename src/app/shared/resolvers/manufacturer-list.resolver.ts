import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ManufacturerService } from '../services/manufacturer.service';
import { NotifyService } from '../services/notify.service';

import { Manufacturer } from '../models/manufacturer.model';

@Injectable()
export class ManufacturerListResolver implements Resolve<Manufacturer[]> {
    pageNumber = 1;
    pageSize = 10;

    constructor(
        private router: Router,
        private manufacturerService: ManufacturerService,
        private notify: NotifyService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<Manufacturer[]> {
        return this.manufacturerService.getAllPaging(this.pageNumber, this.pageSize).pipe(
            catchError(_ => {
                this.notify.error('Có lỗi xảy ra');
                console.log('error getAllPagingManufacturer');
                this.router.navigate(['/']);
                return of(null);
            })
        );
    }
}
