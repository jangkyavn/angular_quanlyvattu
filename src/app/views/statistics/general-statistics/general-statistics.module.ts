import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { GeneralStatisticsRoutingModule } from './general-statistics.routing.module';
import { SharedModule } from 'src/app/shared.module';

import { GeneralStatisticListComponent } from './general-statistic-list/general-statistic-list.component';
import { GeneralStatisticDetailComponent } from './general-statistic-detail/general-statistic-detail.component';
import {
  CardImportStatisticsComponent
} from './general-statistic-detail/card-import-statistics/card-import-statistics.component';
import {
  CardExportStatisticsComponent
} from './general-statistic-detail/card-export-statistics/card-export-statistics.component';
import {
  CardLiquidationStatisticsComponent
} from './general-statistic-detail/card-liquidation-statistics/card-liquidation-statistics.component';

import { MaterialDetailResolver } from 'src/app/shared/resolvers/material-detail.resolver';
import { GeneralStatisticListResolver } from 'src/app/shared/resolvers/general-statistic-list.resolver';

@NgModule({
  imports: [
    FormsModule,
    GeneralStatisticsRoutingModule,
    SharedModule
  ],
  declarations: [
    GeneralStatisticListComponent,
    GeneralStatisticDetailComponent,
    CardImportStatisticsComponent,
    CardExportStatisticsComponent,
    CardLiquidationStatisticsComponent
  ],
  providers: [
    GeneralStatisticListResolver,
    MaterialDetailResolver
  ]
})
export class GeneralStatisticsModule { }
