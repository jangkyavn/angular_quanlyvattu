import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ProducingCountryService } from '../services/producing-country.service';
import { NotifyService } from '../services/notify.service';

import { ProducingCountry } from '../models/producing-country.model';

@Injectable()
export class ProducingCountryListResolver implements Resolve<ProducingCountry[]> {
    pageNumber = 1;
    pageSize = 10;

    constructor(
        private router: Router,
        private producingCountryService: ProducingCountryService,
        private notify: NotifyService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<ProducingCountry[]> {
        return this.producingCountryService.getAllPaging(this.pageNumber, this.pageSize).pipe(
            catchError(_ => {
                this.notify.error('Có lỗi xảy ra');
                console.log('error getAllPagingProducingCountry');
                this.router.navigate(['/']);
                return of(null);
            })
        );
    }
}
