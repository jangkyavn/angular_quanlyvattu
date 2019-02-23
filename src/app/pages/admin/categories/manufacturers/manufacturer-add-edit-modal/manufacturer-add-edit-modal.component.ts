import { Component, OnInit, Input, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd';

import { Manufacturer } from 'src/app/shared/models/manufacturer.model';
import { ManufacturerService } from 'src/app/shared/services/manufacturer.service';
import { NotifyService } from 'src/app/shared/services/notify.service';
import { noWhitespaceValidator } from 'src/app/shared/vailidators/no-whitespace-validator';

@Component({
  selector: 'app-manufacturer-add-edit-modal',
  templateUrl: './manufacturer-add-edit-modal.component.html',
  styleUrls: ['./manufacturer-add-edit-modal.component.scss']
})
export class ManufacturerAddEditModalComponent implements OnInit {
  @Input() manufacturer: Manufacturer;
  @Input() isAddNew: boolean;

  manufacturerForm: FormGroup;

  @HostListener('window:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent) {
    if (($event.ctrlKey || $event.metaKey) && $event.keyCode === 13) {
      this.saveChanges();
    }
  }

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private manufacturerService: ManufacturerService,
    private notify: NotifyService
  ) { }

  ngOnInit() {
    this.createForm();
    this.manufacturerForm.reset();
    this.manufacturerForm.patchValue(this.manufacturer);
  }

  createForm() {
    this.manufacturerForm = this.fb.group({
      maHang: [null],
      tenHang: [null, [Validators.required, noWhitespaceValidator]],
      ghiChu: [null]
    });
  }

  saveChanges() {
    if (this.manufacturerForm.invalid) {
      // tslint:disable-next-line:forin
      for (const i in this.manufacturerForm.controls) {
        this.manufacturerForm.controls[i].markAsDirty();
        this.manufacturerForm.controls[i].updateValueAndValidity();
      }
      return;
    }

    const manufacturer = Object.assign({}, this.manufacturerForm.value);
    if (this.isAddNew) {
      this.manufacturerService.addNew(manufacturer).subscribe((res: any) => {
        if (typeof res === 'boolean') {
          if (res) {
            this.notify.success('Thêm thành công!');
            this.modal.destroy(true);
          }
        } else {
          if (res === -1) {
            this.notify.warning('Tên hãng sản xuất đã tồn tại');
          }
        }
      }, error => {
        this.notify.success('Có lỗi xảy ra!');
        console.log('error addManufacturer');
        this.modal.destroy(false);
      });
    } else {
      this.manufacturerService.update(manufacturer).subscribe((res: any) => {
        if (res) {
          this.notify.success('Sửa thành công!');
          this.modal.destroy(true);
        }
      }, error => {
        this.notify.success('Có lỗi xảy ra!');
        console.log('error updateManufacturer');
        this.modal.destroy(false);
      });
    }
  }
}
