import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { NotifyService } from '../../shared/services/notify.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  returnUrl = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private notify: NotifyService
  ) { }

  ngOnInit() {
    if (this.authService.loggedIn()) {
      this.router.navigate(['/']);
    }

    this.route.queryParams
      .subscribe(params => this.returnUrl = params['returnUrl']);

    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }

  login() {
    this.isLoading = true;

    if (!this.loginForm.valid) {
      // tslint:disable-next-line:forin
      for (const key in this.loginForm.controls) {
        this.loginForm.controls[key].markAsDirty();
        this.loginForm.controls[key].updateValueAndValidity();
      }
      this.isLoading = false;
      return;
    } else {
      const user = Object.assign({}, this.loginForm.value);
      this.authService.login(user).subscribe(res => {
        if (res.status) {
          if (this.returnUrl) {
            this.router.navigateByUrl(this.returnUrl);
          } else {
            this.router.navigate(['/']);
          }
        } else {
          this.notify.warning(res.messsage);
        }
        this.isLoading = false;
      }, _ => {
        this.notify.error('Có lỗi xảy ra');
        this.isLoading = false;
      });
    }
  }
}
