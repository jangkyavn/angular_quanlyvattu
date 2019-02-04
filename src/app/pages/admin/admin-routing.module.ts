import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from '../../shared/guards/auth.guard';

const routes: Routes = [
  {
    path: '', component: AdminComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'trang-chu', pathMatch: 'full' },
      { path: 'trang-chu', component: HomeComponent },
      { path: 'he-thong', loadChildren: './systems/systems.module#SystemsModule' },
      { path: 'danh-muc', loadChildren: './categories/categories.module#CategoriesModule' },
      { path: 'nghiep-vu', loadChildren: './businesses/businesses.module#BusinessesModule' },
      { path: 'quan-ly-tai-khoan', loadChildren: './accounts/accounts.module#AccountsModule' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
