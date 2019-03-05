import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { AuthGuard } from './shared/guards/auth.guard';

import { DefaultLayoutComponent } from './containers/default-layout/default-layout.component';
import { P404Component } from './views/errors/404/404.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'bang-dieu-khien',
    pathMatch: 'full'
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Trang 404'
    },
  },
  {
    path: 'dang-nhap',
    loadChildren: './views/login/login.module#LoginModule'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Trang chủ'
    },
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'bang-dieu-khien',
        loadChildren: './views/dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'he-thong',
        loadChildren: './views/systems/systems.module#SystemsModule'
      },
      {
        path: 'danh-muc',
        loadChildren: './views/categories/categories.module#CategoriesModule'
      },
      {
        path: 'nghiep-vu',
        loadChildren: './views/businesses/businesses.module#BusinessesModule'
      },
      {
        path: 'thong-ke-bao-cao',
        loadChildren: './views/statistics/statistics.module#StatisticsModule'
      },
      {
        path: 'quan-ly-tai-khoan',
        loadChildren: './views/manage-accounts/manage-accounts.module#ManageAccountsModule'
      }
    ]
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
