import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ExportMaterialService } from '../services/export-material.service';
import { NotifyService } from '../services/notify.service';

import { ExportMaterial } from '../models/export-material.model';

@Injectable()
export class ExportMaterialResolver implements Resolve<ExportMaterial> {
    constructor(
        private router: Router,
        private exportMaterialService: ExportMaterialService,
        private notify: NotifyService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<ExportMaterial> {
        return this.exportMaterialService.getDetail(route.params['id']).pipe(
            catchError(_ => {
                this.notify.error('Có lỗi xảy ra');
                console.log('error getDetailExportMaterial');
                this.router.navigate(['/']);
                return of(null);
            })
        );
    }
}
