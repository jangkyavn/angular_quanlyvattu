import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ImportMaterialService } from '../services/import-material.service';
import { NotifyService } from '../services/notify.service';

import { ImportMaterial } from '../models/import-material.model';

@Injectable()
export class ImportMaterialDetailResolver implements Resolve<ImportMaterial> {
    constructor(
        private router: Router,
        private importMaterialService: ImportMaterialService,
        private notify: NotifyService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<ImportMaterial> {
        return this.importMaterialService.getDetail(route.params['id']).pipe(
            catchError(_ => {
                this.notify.error('Có lỗi xảy ra');
                console.log('error getDetailImportMaterial');
                this.router.navigate(['/']);
                return of(null);
            })
        );
    }
}
