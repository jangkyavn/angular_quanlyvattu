import { Component, OnInit, Input, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd';

import { MaterialStoreService } from 'src/app/shared/services/material-store.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

import { MaterialStore } from 'src/app/shared/models/material-store.model';
import { noWhitespaceValidator } from 'src/app/shared/vailidators/no-whitespace-validator';

@Component({
  selector: 'app-material-store-add-edit-modal',
  templateUrl: './material-store-add-edit-modal.component.html',
  styleUrls: ['./material-store-add-edit-modal.component.scss']
})
export class MaterialStoreAddEditModalComponent implements OnInit {
  @Input() materialStore: MaterialStore;
  @Input() isAddNew: boolean;

  materialStoreForm: FormGroup;

  @HostListener('window:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent) {
    if (($event.ctrlKey || $event.metaKey) && $event.keyCode === 13) {
      this.saveChanges();
    }
  }

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private materialStoreService: MaterialStoreService,
    private notify: NotifyService
  ) { }

  ngOnInit() {
    this.createForm();
    this.materialStoreForm.reset();
    this.materialStoreForm.patchValue(this.materialStore);
  }

  createForm() {
    this.materialStoreForm = this.fb.group({
      maKho: [null],
      tenKho: [null, [Validators.required, noWhitespaceValidator]],
      dienThoai: [null, [Validators.pattern('[0-9]+')]],
      diaChi: [null],
      ghiChu: [null]
    });
  }

  saveChanges() {
    if (this.materialStoreForm.invalid) {
      // tslint:disable-next-line:forin
      for (const i in this.materialStoreForm.controls) {
        this.materialStoreForm.controls[i].markAsDirty();
        this.materialStoreForm.controls[i].updateValueAndValidity();
      }
      return;
    }

    const materialStore = Object.assign({}, this.materialStoreForm.value);
    if (this.isAddNew) {
      this.materialStoreService.addNew(materialStore).subscribe((res: any) => {
        if (typeof res === 'boolean') {
          if (res) {
            this.notify.success('Thêm thành công!');
            this.modal.destroy(true);
          }
        } else {
          if (res === -1) {
            this.notify.warning('Tên kho vật tư đã tồn tại');
          }
        }
      });
    } else {
      this.materialStoreService.update(materialStore).subscribe((res: any) => {
        if (res) {
          this.notify.success('Sửa thành công!');
          this.modal.destroy(true);
        }
      });
    }
  }
}
