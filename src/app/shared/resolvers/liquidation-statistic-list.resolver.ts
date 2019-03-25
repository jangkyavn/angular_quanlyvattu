import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { StatisticService } from '../services/statistic.service';

import { LiquidationStatistic } from '../models/liquidation-statistic.model';

@Injectable()
export class LiquidationStatisticListResolver implements Resolve<LiquidationStatistic[]> {
    statisticParams: any = null;

    constructor(private statisticService: StatisticService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<LiquidationStatistic[]> {
        return this.statisticService.getLiquidationStatistics(this.statisticParams);
    }
}
