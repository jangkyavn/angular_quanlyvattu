import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { PageErrorComponent } from './pages/page-error/page-error.component';

const routes: Routes = [
  { path: '', redirectTo: 'dang-nhap', pathMatch: 'full' },
  { path: 'dang-nhap', loadChildren: './pages/login/login.module#LoginModule' },
  { path: 'admin', loadChildren: './pages/admin/admin.module#AdminModule' },
  { path: '**', component: PageErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
