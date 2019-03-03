import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Nghiệp vụ'
        },
        children: [
            {
                path: '',
                redirectTo: 'nhap',
                pathMatch: 'full'
            },
            {
                path: 'nhap',
                loadChildren: './imports/imports.module#ImportsModule'
            },
            {
                path: 'xuat',
                loadChildren: './exports/exports.module#ExportsModule'
            },
            {
                path: 'kho',
                loadChildren: './stores/stores.module#StoresModule'
            },
            {
                path: 'tim-kiem-vat-tu',
                loadChildren: './search-materials/search-materials.module#SearchMaterialsModule'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BusinessesRoutingModule { }
