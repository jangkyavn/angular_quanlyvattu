import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InventoriesRoutingModule } from './inventories.routing.module';
import { SharedModule } from 'src/app/shared.module';

import { InventoryListComponent } from './inventory-list/inventory-list.component';

import { InventoryListResolver } from 'src/app/shared/resolvers/inventory-list.resolver';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InventoriesRoutingModule,
    SharedModule
  ],
  declarations: [
    InventoryListComponent
  ],
  providers: [InventoryListResolver]
})
export class InventoriesModule { }
