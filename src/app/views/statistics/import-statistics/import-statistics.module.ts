import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ImportStatisticsRoutingModule } from './import-statistics.routing.module';
import { SharedModule } from 'src/app/shared.module';

import { ImportStatisticListComponent } from './import-statistic-list/import-statistic-list.component';
import { ImportStatisticDetailComponent } from './import-statistic-detail/import-statistic-detail.component';

import { MaterialDetailResolver } from 'src/app/shared/resolvers/material-detail.resolver';

@NgModule({
  imports: [
    FormsModule,
    ImportStatisticsRoutingModule,
    SharedModule
  ],
  declarations: [
    ImportStatisticListComponent,
    ImportStatisticDetailComponent
  ],
  providers: [MaterialDetailResolver]
})
export class ImportStatisticsModule { }
