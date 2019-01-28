import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NotifyService } from '../../shared/services/notify.service';
import { AuthService } from '../../shared/services/auth.service';

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
    private notify: NotifyService
  ) { }

  ngOnInit() {
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
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    const user = this.loginForm.value;
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
