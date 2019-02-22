import { Component, OnInit, Output, EventEmitter, AfterViewInit, Input, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd';

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
