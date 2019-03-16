import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LiquidationMaterialListComponent } from './liquidation-material-list/liquidation-material-list.component';
import { LiquidationMaterialCreateComponent } from './liquidation-material-create/liquidation-material-create.component';
import { LiquidationMaterialEditComponent } from './liquidation-material-edit/liquidation-material-edit.component';

import { LiquidationMaterialListResolver } from 'src/app/shared/resolvers/liquidation-material-list.resolver';
import { LiquidationMaterialResolver } from 'src/app/shared/resolvers/liquidation-material.resolver';
import { LiquidationMaterialCreateResolver } from 'src/app/shared/resolvers/liquidation-material-create.resolver';
import { LiquidationMaterialEditResolver } from 'src/app/shared/resolvers/liquidation-material-edit.resolver';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Thanh lý vật tư'
        },
        children: [
            {
                path: 'danh-sach',
                component: LiquidationMaterialListComponent,
                data: {
                    title: 'Danh sách thanh lý vật tư'
                },
                resolve: { 'liquidation-material-list': LiquidationMaterialListResolver }
            },
            {
                path: 'tao-phieu-thanh-ly',
                component: LiquidationMaterialCreateComponent,
                data: {
                    title: 'Tạo phiếu thanh lý'
                },
                resolve: { 'check-permission-create': LiquidationMaterialCreateResolver }
            },
            {
                path: 'sua-phieu-thanh-ly/:id',
                component: LiquidationMaterialEditComponent,
                data: {
                    title: 'Sửa phiếu thanh lý'
                },
                resolve: {
                    'liquidation-material': LiquidationMaterialResolver,
                    'check-permission-update': LiquidationMaterialEditResolver
                }
            },
            {
                path: '',
                redirectTo: 'danh-sach',
                pathMatch: 'full'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LiquidationMaterialsRoutingModule { }
