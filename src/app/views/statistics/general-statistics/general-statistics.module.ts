import { NgModule } from '@angular/core';

import { GeneralStatisticsRoutingModule } from './general-statistics.routing.module';
import { SharedModule } from 'src/app/shared.module';

import { GeneralStatisticListComponent } from './general-statistic-list/general-statistic-list.component';

@NgModule({
  imports: [
    GeneralStatisticsRoutingModule,
    SharedModule
  ],
  declarations: [GeneralStatisticListComponent]
})
export class GeneralStatisticsModule { }
