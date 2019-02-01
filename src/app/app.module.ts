import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { NgZorroAntdModule, NZ_I18N, vi_VN } from 'ng-zorro-antd';
import { JwtModule } from '@auth0/angular-jwt';

import { registerLocaleData } from '@angular/common';
import vi from '@angular/common/locales/vi';

import { AppComponent } from './app.component';
import { PageErrorComponent } from './pages/page-error/page-error.component';
import { Config } from 'src/assets/config';

registerLocaleData(vi);

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
        whitelistedDomains: [Config.getDomain()],
        blacklistedRoutes: [`${Config.getDomain()}/api/auth`]
      }
    }),
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy },
  { provide: NZ_I18N, useValue: vi_VN }],
  bootstrap: [AppComponent]
})
export class AppModule { }
