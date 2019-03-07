import { Component, OnInit, Input } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd';

@Component({
  selector: 'app-material-export-excel-modal',
  templateUrl: './material-export-excel-modal.component.html',
  styleUrls: ['./material-export-excel-modal.component.scss']
})
export class MaterialExportExcelModalComponent implements OnInit {
  @Input() totalPages: number;
  isGetAll: boolean;
  pageNumber: number;

  constructor(private modal: NzModalRef) { }

  ngOnInit() {
    this.isGetAll = true;
    this.pageNumber = 1;
  }

  saveChanges() {
    this.modal.destroy({
      isGetAll: this.isGetAll,
      pageNumber: this.pageNumber
    });
  }
}
