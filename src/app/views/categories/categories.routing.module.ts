import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Danh mục'
        },
        children: [
            {
                path: '',
                redirectTo: 'nguon-cung-cap',
                pathMatch: 'full'
            },
            {
                path: 'nguon-cung-cap',
                loadChildren: './supplies/supplies.module#SuppliesModule'
            },
            {
                path: 'don-vi-tinh',
                loadChildren: './units/units.module#UnitsModule'
            },
            {
                path: 'kho-vat-tu',
                loadChildren: './material-stores/material-stores.module#MaterialStoresModule'
            },
            {
                path: 'hang-san-xuat',
                loadChildren: './manufacturers/manufacturers.module#ManufacturersModule'
            },
            {
                path: 'nuoc-san-xuat',
                loadChildren: './producing-countries/producing-countries.module#ProducingCountriesModule'
            },
            {
                path: 'nhan-su',
                loadChildren: './personnels/personnels.module#PersonnelsModule'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CategoriesRoutingModule { }
