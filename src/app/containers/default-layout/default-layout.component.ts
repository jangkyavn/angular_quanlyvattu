import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

import { AuthService } from '../../shared/services/auth.service';
import { RoleService } from 'src/app/shared/services/role.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

import { User } from '../../shared/models/user.model';
import { Permission } from 'src/app/shared/models/permission.model';

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
  permissions: Permission[] = [];
  userRoles: any[] = [];
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
    private utilities: UtilitiesService) { }

  ngOnInit() {
    const token = localStorage.getItem('token');
    const user: User = JSON.parse(localStorage.getItem('user'));

    if (token) {
      this.authService.decodedToken = this.jwtHelper.decodeToken(token);

      this.userRoles = this.authService.decodedToken.role as Array<string>;
      if (!this.userRoles) {
        this.router.navigate(['/dang-nhap'], { queryParams: { returnUrl: this.router.url } });
      }
    }

    if (user) {
      this.authService.currentUser = user;
    }

    this.utilities.currentCollapsed.subscribe((res: boolean) => {
      this.isCollapsed = res;
    });

    this.getListPermissionByRoles();
  }

  getListPermissionByRoles() {
    this.roleService.getListPermissionByRoles().subscribe((res: any) => {
      if (res.status) {
        this.permissions = res.data;
      }
    });
  }

  checkFunctionPermission(functionId: string, action: string = 'READ') {
    if (this.userRoles.includes('Admin')) {
      return true;
    }

    const length = this.permissions.length;
    for (let i = 0; i < length; i++) {
      if (this.permissions[i].maChucNang === functionId && this.permissions[i].maHanhDong === action) {
        return true;
      }
    }

    return false;
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
