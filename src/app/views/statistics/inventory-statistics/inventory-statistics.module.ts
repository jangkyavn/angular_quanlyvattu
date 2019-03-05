import { NgModule } from '@angular/core';

import { InventoryStatisticsRoutingModule } from './inventory-statistics.routing.module';
import { SharedModule } from 'src/app/shared.module';

import { InventoryStatisticListComponent } from './inventory-statistic-list/inventory-statistic-list.component';

@NgModule({
  imports: [
    InventoryStatisticsRoutingModule,
    SharedModule
  ],
  declarations: [InventoryStatisticListComponent]
})
export class InventoryStatisticsModule { }
