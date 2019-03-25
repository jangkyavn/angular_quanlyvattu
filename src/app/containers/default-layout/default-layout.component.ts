import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

import { AuthService } from '../../shared/services/auth.service';
import { RoleService } from 'src/app/shared/services/role.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-default-layout',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit {
  triggerTemplate = null;
  isCollapsed = false;
  width = 256;
  returnUrl = '';
  jwtHelper = new JwtHelperService();
  openMap = {
    sub1: false,
    sub2: false,
    sub3: false,
    sub4: false
  };

  constructor(
    private router: Router,
    public authService: AuthService,
    private roleService: RoleService,
    private notify: NotifyService,
    private utilities: UtilitiesService) { }

  ngOnInit() {
    const token = localStorage.getItem('token');
    const user: User = JSON.parse(localStorage.getItem('user'));

    if (token) {
      this.authService.decodedToken = this.jwtHelper.decodeToken(token);

      const userRoles = this.authService.decodedToken.role as Array<string>;
      if (!userRoles) {
        this.router.navigate(['/dang-nhap'], { queryParams: { returnUrl: this.router.url } });
      }
    }

    if (user) {
      this.authService.currentUser = user;
    }

    this.utilities.currentCollapsed.subscribe((res: boolean) => {
      this.isCollapsed = res;
    });
  }

  openHandler(value: string): void {
    for (const key in this.openMap) {
      if (key !== value) {
        this.openMap[key] = false;
      }
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authService.decodedToken = null;
    this.authService.currentUser = null;
    this.router.navigate(['/dang-nhap']);
  }
}
