import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MaterialStore } from 'src/app/shared/models/material-store.model';
import { MaterialStoreService } from 'src/app/shared/services/material-store.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

@Component({
  selector: 'app-material-store-add-edit-modal',
  templateUrl: './material-store-add-edit-modal.component.html',
  styleUrls: ['./material-store-add-edit-modal.component.scss']
})
export class MaterialStoreAddEditModalComponent implements OnInit {
  @Input() materialStore: MaterialStore;
  @Input() isAddNew: boolean;

  materialStoreForm: FormGroup;

  constructor(
    private fb: FormBuilder,
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
      tenKho: [null, [Validators.required]],
      dienThoai: [null, [Validators.required]],
      diaChi: [null, [Validators.required]],
      ghiChu: [null]
    });
  }

  saveChanges(callBack: (result: boolean) => any = null) {
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
        if (res) {
          this.notify.success('Thêm thành công!');
          callBack(true);
        }
      }, error => {
        this.notify.success('Có lỗi xảy ra!');
        console.log('error addMaterialStore');
        callBack(false);
      });
    } else {
      this.materialStoreService.update(materialStore).subscribe((res: any) => {
        if (res) {
          this.notify.success('Sửa thành công!');
          callBack(true);
        }
      }, error => {
        this.notify.success('Có lỗi xảy ra!');
        console.log('error updateMaterialStore');
        callBack(false);
      });
    }
  }
}
