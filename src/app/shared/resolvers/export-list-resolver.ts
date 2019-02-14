import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ExportMaterialService } from '../services/export-material.service';
import { NotifyService } from '../services/notify.service';

import { ExportMaterial } from '../models/export-material.model';

@Injectable()
export class ExportMaterialListResolver implements Resolve<ExportMaterial[]> {
    pageNumber = 1;
    pageSize = 10;

    constructor(
        private router: Router,
        private exportMaterialService: ExportMaterialService,
        private notify: NotifyService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<ExportMaterial[]> {
        return this.exportMaterialService.getAllPaging(this.pageNumber, this.pageSize).pipe(
            catchError(_ => {
                this.notify.error('Có lỗi xảy ra');
                console.log('error getAllPagingExportMaterial');
                this.router.navigate(['/']);
                return of(null);
            })
        );
    }
}
