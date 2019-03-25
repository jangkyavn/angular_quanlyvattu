import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { StatisticService } from '../services/statistic.service';

import { GeneralStatistic } from '../models/general-statistic.model';

@Injectable()
export class GeneralStatisticListResolver implements Resolve<GeneralStatistic[]> {
    statisticParams: any = null;

    constructor(private statisticService: StatisticService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<GeneralStatistic[]> {
        return this.statisticService.getGeneralStatistics(this.statisticParams);
    }
}
