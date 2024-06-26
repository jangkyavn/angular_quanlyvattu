import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { NotifyService } from '../services/notify.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private notify: NotifyService) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.decodedToken) {
      const userRoles = this.authService.decodedToken.role as Array<string>;
      if (!userRoles) {
        this.notify.error('Bạn không có quyền vào trang này');
        this.router.navigate(['/dang-nhap'], { queryParams: { returnUrl: state.url } });
        return false;
      }
    }

    if (this.authService.loggedIn()) {
      return true;
    }

    this.notify.error('Bạn cần phải đăng nhập');
    this.router.navigate(['/dang-nhap'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
