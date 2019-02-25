import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InventoryListComponent } from './inventories/inventory-list/inventory-list.component';
import { InventoryListResolver } from 'src/app/shared/resolvers/inventory-list.resolver';
import { ImportMaterialsComponent } from './import-materials/import-materials.component';
import { ImportListComponent } from './imports/import-list/import-list.component';
import { ImportMaterialListResolver } from 'src/app/shared/resolvers/import-list.resolver';
import { ExportMaterialsComponent } from './export-materials/export-materials.component';
import { ExportListComponent } from './exports/export-list/export-list.component';
import { ExportMaterialListResolver } from 'src/app/shared/resolvers/export-list-resolver';
import { UpdateImportMaterialsComponent } from './update-import-materials/update-import-materials.component';
import { ImportMaterialDetailResolver } from 'src/app/shared/resolvers/import-material-detail.resolver';
import { UpdateExportMaterialsComponent } from './update-export-materials/update-export-materials.component';
import { ExportMaterialDetailResolver } from 'src/app/shared/resolvers/export-material-detail.resolver';
import { SearchComponent } from './search/search.component';
import { MaterialListResolver } from 'src/app/shared/resolvers/material-list.resolver';
import { SearchDetailComponent } from './search-detail/search-detail.component';

const routes: Routes = [
  { path: '', redirectTo: 'vat-tu-ton-kho', pathMatch: 'full' },
  {
    path: 'vat-tu-ton-kho', component: InventoryListComponent,
    resolve: { 'inventories': InventoryListResolver }
  },
  {
    path: 'tao-phieu-nhap', component: ImportMaterialsComponent
  },
  {
    path: 'danh-sach-phieu-nhap', component: ImportListComponent,
    resolve: { 'import-materials': ImportMaterialListResolver }
  },
  {
    path: 'sua-phieu-nhap/:id', component: UpdateImportMaterialsComponent,
    resolve: { 'import-material': ImportMaterialDetailResolver }
  },
  {
    path: 'tao-phieu-xuat', component: ExportMaterialsComponent
  },
  {
    path: 'danh-sach-phieu-xuat', component: ExportListComponent,
    resolve: { 'export-materials': ExportMaterialListResolver }
  },
  {
    path: 'sua-phieu-xuat/:id', component: UpdateExportMaterialsComponent,
    resolve: { 'export-material': ExportMaterialDetailResolver }
  },
  {
    path: 'tim-kiem-vat-tu', component: SearchComponent,
    resolve: { 'materials': MaterialListResolver }
  },
  {
    path: 'tim-kiem-vat-tu-chi-tiet/:id', component: SearchDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessesRoutingModule { }
