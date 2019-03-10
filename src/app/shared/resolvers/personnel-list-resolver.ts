import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { PersonnelService } from '../services/personnel.service';
import { UtilitiesService } from '../services/utilities.service';

import { Personnel } from '../models/personnel.model';

@Injectable()
export class PersonnelListResolver implements Resolve<Personnel[]> {
    pageNumber = 1;
    pageSize = 10;

    constructor(
        private personnelService: PersonnelService,
        private utility: UtilitiesService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<Personnel[]> {
        return this.personnelService.getAllPaging(this.pageNumber, this.pageSize).pipe(
            catchError(error => this.utility.handleError(error, 'getAllPagingPersonnel'))
        );
    }
}
