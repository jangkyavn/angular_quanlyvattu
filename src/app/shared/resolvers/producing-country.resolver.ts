import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ProducingCountryService } from '../services/producing-country.service';
import { UtilitiesService } from '../services/utilities.service';

import { ProducingCountry } from '../models/producing-country.model';

@Injectable()
export class ProducingCountryListResolver implements Resolve<ProducingCountry[]> {
    pageNumber = 1;
    pageSize = 10;

    constructor(
        private producingCountryService: ProducingCountryService,
        private utility: UtilitiesService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<ProducingCountry[]> {
        return this.producingCountryService.getAllPaging(this.pageNumber, this.pageSize).pipe(
            catchError(error => this.utility.handleError(error, 'getAllPagingProducingCountry'))
        );
    }
}
