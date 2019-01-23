import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

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

  canActivate(next: ActivatedRouteSnapshot): boolean {
    if (this.authService.loggedIn()) {
      return true;
    }

    this.notify.error('Bạn cần phải đăng nhập');
    this.router.navigate(['/']);
    return false;
  }
}
