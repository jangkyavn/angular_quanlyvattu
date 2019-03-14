import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Kho'
        },
        children: [
            {
                path: '',
                redirectTo: 'vat-tu-ton-kho',
                pathMatch: 'full'
            },
            {
                path: 'vat-tu-ton-kho',
                loadChildren: './inventories/inventories.module#InventoriesModule'
            },
            {
                path: 'thanh-ly-vat-tu',
                loadChildren: './liquidation-materials/liquidation-materials.module#LiquidationMaterialsModule'
            },
            {
                path: 'phieu-kiem-ke-kho',
                loadChildren: './inventory-materials/inventory-materials.module#InventoryMaterialsModule'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StoresRoutingModule { }
