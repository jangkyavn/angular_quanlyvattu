import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Thông tin vật tư'
        },
        children: [
            {
                path: '',
                redirectTo: 'hang-muc-vat-tu',
                pathMatch: 'full'
            },
            {
                path: 'hang-muc-vat-tu',
                loadChildren: './material-items/material-items.module#MaterialItemsModule'
            },
            {
                path: 'loai-vat-tu',
                loadChildren: './material-types/material-types.module#MaterialTypesModule'
            },
            {
                path: 'vat-tu',
                loadChildren: './materials/materials.module#MaterialsModule'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MaterialInformationsRoutingModule { }
