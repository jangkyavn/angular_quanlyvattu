import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { StatisticService } from '../services/statistic.service';

import { ImportStatistic } from '../models/import-statistic.model';

@Injectable()
export class ImportStatisticListResolver implements Resolve<ImportStatistic[]> {
    statisticParams: any = null;

    constructor(private statisticService: StatisticService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<ImportStatistic[]> {
        return this.statisticService.getImportStatistics(this.statisticParams);
    }
}
