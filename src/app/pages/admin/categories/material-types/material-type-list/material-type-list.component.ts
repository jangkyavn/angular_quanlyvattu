import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';

import { MaterialTypeService } from 'src/app/shared/services/material-type.service';
import { MaterialType } from 'src/app/shared/models/material-type.model';
import { MaterialTypeAddEditModalComponent } from '../material-type-add-edit-modal/material-type-add-edit-modal.component';

@Component({
  selector: 'app-material-type-list',
  templateUrl: './material-type-list.component.html',
  styleUrls: ['./material-type-list.component.scss']
})
export class MaterialTypeListComponent implements OnInit {
  materialTypes: MaterialType[];
  bsModalRef: BsModalRef;

  constructor(
    private route: ActivatedRoute,
    private materialTypeService: MaterialTypeService,
    private modalService: BsModalService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.materialTypes = data['material-types'];
    });
  }

  loadData() {
    this.materialTypeService.getAll().subscribe((res: MaterialType[]) => {
      this.materialTypes = res;
    });
  }

  addNew() {
    const modalOption: ModalOptions = {
      backdrop: 'static',
      initialState: {
        title: 'Thêm loại vật tư',
        materialType: {},
        isAddNew: true
      }
    };
    this.bsModalRef = this.modalService.show(MaterialTypeAddEditModalComponent, modalOption);
    this.bsModalRef.content.saveEntity.subscribe((res: boolean) => {
      if (res) {
        this.loadData();
      }
    });
  }

  update(id: number) {
    this.materialTypeService.getDetail(id).subscribe((materialType: MaterialType) => {
      const modalOption: ModalOptions = {
        backdrop: 'static',
        initialState: {
          title: 'Sửa loại vật tư',
          materialType,
          isAddNew: false
        }
      };
      this.bsModalRef = this.modalService.show(MaterialTypeAddEditModalComponent, modalOption);
      this.bsModalRef.content.saveEntity.subscribe((res: boolean) => {
        if (res) {
          this.loadData();
        }
      });
    });
  }
}
