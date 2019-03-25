import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ExportStatisticsRoutingModule } from './export-statistics.routing.module';
import { SharedModule } from 'src/app/shared.module';

import { ExportStatisticListComponent } from './export-statistic-list/export-statistic-list.component';
import { ExportStatisticDetailComponent } from './export-statistic-detail/export-statistic-detail.component';

import { MaterialDetailResolver } from 'src/app/shared/resolvers/material-detail.resolver';
import { ExportStatisticListResolver } from 'src/app/shared/resolvers/export-statistic-list.resolver';

@NgModule({
  imports: [
    FormsModule,
    ExportStatisticsRoutingModule,
    SharedModule
  ],
  declarations: [
    ExportStatisticListComponent,
    ExportStatisticDetailComponent
  ],
  providers: [
    ExportStatisticListResolver,
    MaterialDetailResolver
  ]
})
export class ExportStatisticsModule { }
