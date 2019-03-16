import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { MaterialService } from '../services/material.service';

import { Material } from '../models/material.model';
import { PaginatedResult } from '../models/pagination.model';

@Injectable()
export class SearchMaterialListResolver implements Resolve<PaginatedResult<Material[]>> {
    pageNumber = 1;
    pageSize = 10;

    constructor(private materialService: MaterialService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<PaginatedResult<Material[]>> {
        return this.materialService.getAllPagingSearch(this.pageNumber, this.pageSize);
    }
}
