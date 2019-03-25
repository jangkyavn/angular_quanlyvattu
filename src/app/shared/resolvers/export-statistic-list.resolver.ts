import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { StatisticService } from '../services/statistic.service';

import { ExportStatistic } from '../models/export-statistic.model';

@Injectable()
export class ExportStatisticListResolver implements Resolve<ExportStatistic[]> {
    statisticParams: any = null;

    constructor(private statisticService: StatisticService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<ExportStatistic[]> {
        return this.statisticService.getExportStatistics(this.statisticParams);
    }
}
