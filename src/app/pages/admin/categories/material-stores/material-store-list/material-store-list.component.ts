import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';

import { MaterialStoreService } from 'src/app/shared/services/material-store.service';
import { MaterialStore } from 'src/app/shared/models/material-store.model';
import { MaterialStoreAddEditModalComponent } from '../material-store-add-edit-modal/material-store-add-edit-modal.component';

@Component({
  selector: 'app-material-store-list',
  templateUrl: './material-store-list.component.html',
  styleUrls: ['./material-store-list.component.scss']
})
export class MaterialStoreListComponent implements OnInit {
  materialStores: MaterialStore[];
  bsModalRef: BsModalRef;

  constructor(
    private route: ActivatedRoute,
    private materialStoreService: MaterialStoreService,
    private modalService: BsModalService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.materialStores = data['material-stores'];
    });
  }

  loadData() {
    this.materialStoreService.getAll().subscribe((res: MaterialStore[]) => {
      this.materialStores = res;
    });
  }

  addNew() {
    const modalOption: ModalOptions = {
      backdrop: 'static',
      initialState: {
        title: 'Thêm kho vật tư',
        materialStore: {},
        isAddNew: true
      }
    };
    this.bsModalRef = this.modalService.show(MaterialStoreAddEditModalComponent, modalOption);
    this.bsModalRef.content.saveEntity.subscribe((res: boolean) => {
      if (res) {
        this.loadData();
      }
    });
  }

  update(id: number) {
    this.materialStoreService.getDetail(id).subscribe((materialStore: MaterialStore) => {
      const modalOption: ModalOptions = {
        backdrop: 'static',
        initialState: {
          title: 'Sửa kho vật tư',
          materialStore,
          isAddNew: false
        }
      };
      this.bsModalRef = this.modalService.show(MaterialStoreAddEditModalComponent, modalOption);
      this.bsModalRef.content.saveEntity.subscribe((res: boolean) => {
        if (res) {
          this.loadData();
        }
      });
    });
  }
}
