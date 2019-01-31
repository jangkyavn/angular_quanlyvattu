import { Component, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { Personnel } from 'src/app/shared/models/personnel.model';
import { PersonnelService } from 'src/app/shared/services/personnel.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

@Component({
  selector: 'app-personnel-add-edit-modal',
  templateUrl: './personnel-add-edit-modal.component.html',
  styleUrls: ['./personnel-add-edit-modal.component.scss']
})
export class PersonnelAddEditModalComponent implements OnInit, AfterViewInit {
  @Output() saveEntity = new EventEmitter<boolean>();
  title: string;
  personnel: Personnel;
  submitted = false;
  isAddNew: boolean;

  personnelForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public bsModalRef: BsModalRef,
    private personnelService: PersonnelService,
    private notify: NotifyService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  ngAfterViewInit() {
    this.personnelForm.reset();
    this.personnelForm.patchValue(this.personnel);
  }

  createForm() {
    this.personnelForm = this.fb.group({
      maNS: [null],
      hoTen: [null, [Validators.required]],
      ngaySinh: [null, [Validators.required]],
      queQuan: [null, [Validators.required]],
      danToc: [null, [Validators.required]],
      tonGiao: [null],
      capBacSHSQ: [null],
      chucVu: [null],
      ngayNhapNguTuyenDung: [null],
      xuatThan: [null],
      banThan: [null],
      quaTrinhHocTap: [null],
      thanNhan: [null],
      ghiChu: [null]
    });
  }

  saveChanges() {
    this.submitted = true;

    if (this.personnelForm.invalid) {
      return;
    }

    const personnel = Object.assign({}, this.personnelForm.value);
    if (this.isAddNew) {
      this.personnelService.addNew(personnel).subscribe((res: any) => {
        if (res) {
          this.saveEntity.emit(true);
          this.notify.success('Thêm thành công!');
          this.bsModalRef.hide();
        }
      }, error => {
        this.saveEntity.emit(false);
        this.notify.success('Có lỗi xảy ra!');
        console.log('error addPersonnel');
      });
    } else {
      this.personnelService.update(personnel).subscribe((res: any) => {
        if (res) {
          this.saveEntity.emit(true);
          this.notify.success('Sửa thành công!');
          this.bsModalRef.hide();
        }
      }, error => {
        this.saveEntity.emit(false);
        this.notify.success('Có lỗi xảy ra!');
        console.log('error updatePersonnel');
      });
    }
  }

  hideModal() {
    if (this.personnelForm.dirty) {
      const result = confirm('Bạn có chắc chắn muốn tiếp tục không? Mọi sự thay đổi không lưu sẽ bị mất');
      if (result) {
        this.bsModalRef.hide();
      }
    } else {
      this.bsModalRef.hide();
    }
  }
}
