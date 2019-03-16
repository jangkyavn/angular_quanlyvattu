import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { ImportMaterialService } from '../services/import-material.service';

import { ImportMaterial } from '../models/import-material.model';
import { PaginatedResult } from '../models/pagination.model';

@Injectable()
export class ImportMaterialListResolver implements Resolve<PaginatedResult<ImportMaterial[]>> {
    pageNumber = 1;
    pageSize = 10;

    constructor(private importMaterialService: ImportMaterialService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<PaginatedResult<ImportMaterial[]>> {
        return this.importMaterialService.getAllPaging(this.pageNumber, this.pageSize);
    }
}
