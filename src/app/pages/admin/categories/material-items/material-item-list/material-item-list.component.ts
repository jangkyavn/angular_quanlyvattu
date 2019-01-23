import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';

import { MaterialItemService } from 'src/app/shared/services/material-item.service';
import { MaterialItem } from 'src/app/shared/models/material-item.model';
import { MaterialItemAddEditModalComponent } from '../material-item-add-edit-modal/material-item-add-edit-modal.component';

@Component({
  selector: 'app-material-item-list',
  templateUrl: './material-item-list.component.html',
  styleUrls: ['./material-item-list.component.scss']
})
export class MaterialItemListComponent implements OnInit {
  materialItems: MaterialItem[];
  bsModalRef: BsModalRef;

  constructor(
    private route: ActivatedRoute,
    private materialItemService: MaterialItemService,
    private modalService: BsModalService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.materialItems = data['material-items'];
    });
  }

  loadData() {
    this.materialItemService.getAll().subscribe((res: MaterialItem[]) => {
      this.materialItems = res;
    });
  }

  addNew() {
    const modalOption: ModalOptions = {
      backdrop: 'static',
      initialState: {
        title: 'Thêm hạng mục vật tư',
        materialItem: {},
        isAddNew: true
      }
    };
    this.bsModalRef = this.modalService.show(MaterialItemAddEditModalComponent, modalOption);
    this.bsModalRef.content.saveEntity.subscribe((res: boolean) => {
      if (res) {
        this.loadData();
      }
    });
  }

  update(id: number) {
    this.materialItemService.getDetail(id).subscribe((materialItem: MaterialItem) => {
      const modalOption: ModalOptions = {
        backdrop: 'static',
        initialState: {
          title: 'Sửa hạng mục vật tư',
          materialItem,
          isAddNew: false
        }
      };
      this.bsModalRef = this.modalService.show(MaterialItemAddEditModalComponent, modalOption);
      this.bsModalRef.content.saveEntity.subscribe((res: boolean) => {
        if (res) {
          this.loadData();
        }
      });
    });
  }
}
