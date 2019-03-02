import { NgModule } from '@angular/core';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from 'src/app/shared.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    DashboardRoutingModule,
    SharedModule
  ]
})
export class DashboardModule { }
