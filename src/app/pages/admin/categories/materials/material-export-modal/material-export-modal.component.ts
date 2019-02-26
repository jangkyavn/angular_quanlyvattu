import { Component, OnInit, Input } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd';

@Component({
  selector: 'app-material-export-modal',
  templateUrl: './material-export-modal.component.html',
  styleUrls: ['./material-export-modal.component.scss']
})
export class MaterialExportModalComponent implements OnInit {
  @Input() totalPages: number;
  isGetAll: boolean;
  pageNumber: number;

  constructor(private modal: NzModalRef) { }

  ngOnInit() {
    this.isGetAll = false;
    this.pageNumber = 1;

    console.log(this.totalPages);
  }

  saveChanges() {
    this.modal.destroy({
      isGetAll: this.isGetAll,
      pageNumber: this.pageNumber
    });
  }
}
