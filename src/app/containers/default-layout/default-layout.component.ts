import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

import { AuthService } from '../../shared/services/auth.service';
import { User } from '../../shared/models/user.model';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

@Component({
  selector: 'app-default-layout',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit {
  triggerTemplate = null;
  isCollapsed = false;
  width = 256;
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
    private utilities: UtilitiesService) { }

  ngOnInit() {
    const token = localStorage.getItem('token');
    const user: User = JSON.parse(localStorage.getItem('user'));

    if (token) {
      this.authService.decodedToken = this.jwtHelper.decodeToken(token);
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