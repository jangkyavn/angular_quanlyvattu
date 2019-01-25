import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InventoryListComponent } from './inventories/inventory-list/inventory-list.component';
import { InventoryListResolver } from 'src/app/shared/resolvers/inventory-list.resolver';
import { ImportMaterialsComponent } from './import-materials/import-materials.component';
import { ImportListComponent } from './imports/import-list/import-list.component';
import { ImportMaterialListResolver } from 'src/app/shared/resolvers/import-list.resolver';

const routes: Routes = [
  { path: '', redirectTo: 'vat-tu-ton-kho', pathMatch: 'full' },
  {
    path: 'vat-tu-ton-kho', component: InventoryListComponent,
    resolve: { 'inventories': InventoryListResolver }
  },
  { path: 'nhap-vat-tu', component: ImportMaterialsComponent },
  {
    path: 'danh-sach-phieu-nhap', component: ImportListComponent,
    resolve: { 'import-materials': ImportMaterialListResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessesRoutingModule { }
