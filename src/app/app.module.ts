import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import { JwtModule } from '@auth0/angular-jwt';

import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';

import { AppComponent } from './app.component';
import { PageErrorComponent } from './pages/page-error/page-error.component';

registerLocaleData(en);

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    PageErrorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NgZorroAntdModule,
    JwtModule.forRoot({
      config: {
         tokenGetter,
         whitelistedDomains: ['localhost:44379'],
         blacklistedRoutes: ['localhost:44379/api/auth']
      }
   }),
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
