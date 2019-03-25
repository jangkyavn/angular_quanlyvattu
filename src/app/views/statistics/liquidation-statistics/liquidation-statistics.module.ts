import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { LiquidationStatisticsRoutingModule } from './liquidation-statistics.routing.module';
import { SharedModule } from 'src/app/shared.module';

import { LiquidationStatisticListComponent } from './liquidation-statistic-list/liquidation-statistic-list.component';
import { LiquidationStatisticDetailComponent } from './liquidation-statistic-detail/liquidation-statistic-detail.component';

import { MaterialDetailResolver } from 'src/app/shared/resolvers/material-detail.resolver';
import { LiquidationStatisticListResolver } from 'src/app/shared/resolvers/liquidation-statistic-list.resolver';

@NgModule({
  imports: [
    FormsModule,
    LiquidationStatisticsRoutingModule,
    SharedModule
  ],
  declarations: [
    LiquidationStatisticListComponent,
    LiquidationStatisticDetailComponent
  ],
  providers: [
    LiquidationStatisticListResolver,
    MaterialDetailResolver
  ]
})
export class LiquidationStatisticsModule { }
