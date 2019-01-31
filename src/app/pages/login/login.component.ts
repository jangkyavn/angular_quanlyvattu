import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { NotifyService } from '../../shared/services/notify.service';
import { AuthService } from '../../shared/services/auth.service';
import { checkUsernameExists } from 'src/app/shared/vailidators/check-username-exists-validator';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  returnUrl = '';
  submitted = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private userSerivce: UserService,
    private notify: NotifyService
  ) { }

  ngOnInit() {
    if (this.authService.loggedIn()) {
      this.router.navigate(['/admin']);
    }

    this.route.queryParams
      .subscribe(params => this.returnUrl = params['returnUrl']);

    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      userName: new FormControl('', {
        validators: Validators.required,
        asyncValidators: checkUsernameExists(this.userSerivce),
        updateOn: 'blur'
      }),
      password: [null, [Validators.required]]
    });
  }

  login() {
    // tslint:disable-next-line:forin
    for (const i in this.loginForm.controls) {
      this.loginForm.controls[i].markAsDirty();
      this.loginForm.controls[i].updateValueAndValidity();
    }

    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    const user = Object.assign({}, this.loginForm.value);
    this.authService.login(user).subscribe(res => {
      if (res.status) {
        if (this.returnUrl) {
          this.router.navigateByUrl(this.returnUrl);
        } else {
          this.router.navigate(['/admin']);
        }
      } else {
        this.notify.warning(res.messsage);
      }
      this.isLoading = false;
    }, _ => {
      this.notify.error('Có lỗi xảy ra');
    });
  }
}
