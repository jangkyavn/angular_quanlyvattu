import { Component, OnInit, Input, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd';

import { MaterialItemService } from 'src/app/shared/services/material-item.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

import { MaterialItem } from 'src/app/shared/models/material-item.model';

@Component({
  selector: 'app-material-item-edit-modal',
  templateUrl: './material-item-edit-modal.component.html',
  styleUrls: ['./material-item-edit-modal.component.scss']
})
export class MaterialItemEditModalComponent implements OnInit {
  @Input() materialItem: MaterialItem;
  materialItemForm: FormGroup;

  @HostListener('window:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent) {
    if (($event.ctrlKey || $event.metaKey) && $event.keyCode === 13) {
      this.saveChanges();
    }
  }

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
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

  saveChanges() {
    if (this.materialItemForm.invalid) {
      // tslint:disable-next-line:forin
      for (const i in this.materialItemForm.controls) {
        this.materialItemForm.controls[i].markAsDirty();
        this.materialItemForm.controls[i].updateValueAndValidity();
      }
      return;
    }

    const materialItem = Object.assign({}, this.materialItemForm.value);
    this.materialItemService.update(materialItem).subscribe((res: any) => {
      if (res) {
        this.notify.success('Sửa thành công!');
        this.modal.destroy(true);
      } else {
        this.notify.success('Sửa thất bại!');
        this.modal.destroy(false);
      }
    }, error => {
      this.notify.success('Có lỗi xảy ra!');
      console.log('error updateMMaterialItem');
      this.modal.destroy(false);
    });
  }
}
