import { NgModule } from '@angular/core';

import { ExportStatisticsRoutingModule } from './export-statistics.routing.module';
import { SharedModule } from 'src/app/shared.module';

import { ExportStatisticListComponent } from './export-statistic-list/export-statistic-list.component';

@NgModule({
  imports: [
    ExportStatisticsRoutingModule,
    SharedModule
  ],
  declarations: [ExportStatisticListComponent]
})
export class ExportStatisticsModule { }
