import { Component, OnInit, Output, EventEmitter, AfterViewInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MaterialItem } from 'src/app/shared/models/material-item.model';
import { MaterialItemService } from 'src/app/shared/services/material-item.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

@Component({
  selector: 'app-material-item-add-edit-modal',
  templateUrl: './material-item-add-edit-modal.component.html',
  styleUrls: ['./material-item-add-edit-modal.component.scss']
})
export class MaterialItemAddEditModalComponent implements OnInit {
  @Input() materialItem: MaterialItem;
  @Input() isAddNew: boolean;

  materialItemForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private materialItemService: MaterialItemService,
    private notify: NotifyService
  ) { }

  ngOnInit() {
    this.createForm();
    this.materialItemForm.reset();
    this.materialItemForm.patchValue(this.materialItem);
  }

  createForm() {
    this.materialItemForm = this.fb.group({
      maHM: [null],
      tenHM: [null, [Validators.required]],
      ghiChu: [null]
    });
  }

  saveChanges(callBack: (result: boolean) => any = null) {
    if (this.materialItemForm.invalid) {
      // tslint:disable-next-line:forin
      for (const i in this.materialItemForm.controls) {
        this.materialItemForm.controls[i].markAsDirty();
        this.materialItemForm.controls[i].updateValueAndValidity();
      }
      return;
    }

    const materialItem = Object.assign({}, this.materialItemForm.value);
    if (this.isAddNew) {
      this.materialItemService.addNew(materialItem).subscribe((res: any) => {
        if (res) {
          this.notify.success('Thêm thành công!');
          callBack(true);
        }
      }, error => {
        this.notify.success('Có lỗi xảy ra!');
        console.log('error addMMaterialItem');
        callBack(false);
      });
    } else {
      this.materialItemService.update(materialItem).subscribe((res: any) => {
        if (res) {
          this.notify.success('Sửa thành công!');
          callBack(true);
        }
      }, error => {
        this.notify.success('Có lỗi xảy ra!');
        console.log('error updateMMaterialItem');
        callBack(false);
      });
    }
  }
}
