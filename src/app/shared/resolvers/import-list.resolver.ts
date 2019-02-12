import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ImportMaterialService } from '../services/import-material.service';
import { NotifyService } from '../services/notify.service';

import { ImportMaterial } from '../models/import-material.model';

@Injectable()
export class ImportMaterialListResolver implements Resolve<ImportMaterial[]> {
    pageNumber = 1;
    pageSize = 10;

    constructor(
        private router: Router,
        private importMaterialService: ImportMaterialService,
        private notify: NotifyService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<ImportMaterial[]> {
        return this.importMaterialService.getAllPaging(this.pageNumber, this.pageSize).pipe(
            catchError(_ => {
                this.notify.error('Có lỗi xảy ra');
                console.log('error getAllPagingImportMaterial');
                this.router.navigate(['/']);
                return of(null);
            })
        );
    }
}
