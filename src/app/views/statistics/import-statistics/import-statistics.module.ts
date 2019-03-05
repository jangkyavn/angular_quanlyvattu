import { NgModule } from '@angular/core';

import { ImportStatisticsRoutingModule } from './import-statistics.routing.module';
import { SharedModule } from 'src/app/shared.module';

import { ImportStatisticListComponent } from './import-statistic-list/import-statistic-list.component';

@NgModule({
  imports: [
    ImportStatisticsRoutingModule,
    SharedModule
  ],
  declarations: [ImportStatisticListComponent]
})
export class ImportStatisticsModule { }
