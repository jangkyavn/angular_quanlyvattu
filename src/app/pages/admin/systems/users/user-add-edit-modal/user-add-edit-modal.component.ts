import { Component, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { passwordMatchValidator } from '../../../../../shared/vailidators/password-match-validator';
import { User } from '../../../../../shared/models/user.model';
import { UserService } from '../../../../../shared/services/user.service';
import { NotifyService } from '../../../../../shared/services/notify.service';

@Component({
  selector: 'app-user-add-edit-modal',
  templateUrl: './user-add-edit-modal.component.html',
  styleUrls: ['./user-add-edit-modal.component.scss']
})
export class UserAddEditModalComponent implements OnInit, AfterViewInit {
  @Output() saveEntity = new EventEmitter<boolean>();
  title: string;
  user: User;
  isAddNew: boolean;

  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public bsModalRef: BsModalRef,
    private userService: UserService,
    private notify: NotifyService) { }

  ngOnInit() {
    this.createForm();
  }

  ngAfterViewInit() {
    this.userForm.reset();
    this.userForm.patchValue(this.user);
  }

  createForm() {
    if (this.isAddNew) {
      this.userForm = this.fb.group({
        id: [null],
        userName: [null, [Validators.required, Validators.maxLength(20)]],
        password: [null, [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(12)]
        ],
        confirmPassword: [null, [
          Validators.required,
          passwordMatchValidator
        ]],
        fullName: [null, [
          Validators.required,
          Validators.maxLength(50)
        ]],
        email: [null, [
          Validators.required,
          Validators.email,
          Validators.maxLength(50)
        ]],
        phoneNumber: [null, [
          Validators.maxLength(20)
        ]],
        address: [null, [
          Validators.maxLength(100)
        ]]
      });
    } else {
      this.userForm = this.fb.group({
        id: [null],
        userName: [null, [Validators.required, Validators.maxLength(20)]],
        fullName: [null, [
          Validators.required,
          Validators.maxLength(50)
        ]],
        email: [null, [
          Validators.required,
          Validators.email,
          Validators.maxLength(50)
        ]],
        phoneNumber: [null, [
          Validators.maxLength(20)
        ]],
        address: [null, [
          Validators.maxLength(100)
        ]]
      });
    }
  }

  saveChanges() {
    const user = Object.assign({}, this.userForm.value);
    if (this.isAddNew) {
      console.log(user);
      this.userService.addNew(user).subscribe((res: any) => {
        if (res) {
          this.saveEntity.emit(true);
          this.notify.success('Thêm mới người dùng thành công!');
          this.bsModalRef.hide();
        }
      }, error => {
        this.saveEntity.emit(false);
        this.notify.success('Có lỗi xảy ra!');
        console.log('error addUser');
      });
    } else {
      this.userService.update(user).subscribe((res: any) => {
        if (res) {
          this.saveEntity.emit(true);
          this.notify.success('Sửa thông tin người dùng thành công!');
          this.bsModalRef.hide();
        }
      }, error => {
        this.saveEntity.emit(false);
        this.notify.success('Có lỗi xảy ra!');
        console.log('error updateUser');
      });
    }
  }

  hideModal() {
    if (this.userForm.dirty) {
      const result = confirm('Bạn có chắc chắn muốn tiếp tục không? Mọi sự thay đổi không lưu sẽ bị mất');
      if (result) {
        this.bsModalRef.hide();
      }
    } else {
      this.bsModalRef.hide();
    }
  }
}
