import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { PersonnelService } from '../services/personnel.service';
import { NotifyService } from '../services/notify.service';

import { Personnel } from '../models/personnel.model';

@Injectable()
export class PersonnelListResolver implements Resolve<Personnel[]> {
    pageNumber = 1;
    pageSize = 10;

    constructor(
        private router: Router,
        private personnelService: PersonnelService,
        private notify: NotifyService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<Personnel[]> {
        return this.personnelService.getAllPaging(this.pageNumber, this.pageSize).pipe(
            catchError(_ => {
                this.notify.error('Có lỗi xảy ra');
                console.log('error getAllPagingPersonnel');
                this.router.navigate(['/']);
                return of(null);
            })
        );
    }
}
