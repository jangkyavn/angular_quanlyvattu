import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';

import { MaterialService } from 'src/app/shared/services/material.service';
import { Material } from 'src/app/shared/models/material.model';
import { MaterialAddEditModalComponent } from '../material-add-edit-modal/material-add-edit-modal.component';

@Component({
  selector: 'app-material-list',
  templateUrl: './material-list.component.html',
  styleUrls: ['./material-list.component.scss']
})
export class MaterialListComponent implements OnInit {
  materials: Material[];
  bsModalRef: BsModalRef;

  constructor(
    private route: ActivatedRoute,
    private materialService: MaterialService,
    private modalService: BsModalService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.materials = data['materials'];
    });
  }

  loadData() {
    this.materialService.getAll().subscribe((res: Material[]) => {
      this.materials = res;
    });
  }

  addNew() {
    const modalOption: ModalOptions = {
      backdrop: 'static',
      initialState: {
        title: 'Thêm danh mục vật tư',
        material: {},
        isAddNew: true
      }
    };
    this.bsModalRef = this.modalService.show(MaterialAddEditModalComponent, modalOption);
    this.bsModalRef.content.saveEntity.subscribe((res: boolean) => {
      if (res) {
        this.loadData();
      }
    });
  }

  update(id: number) {
    this.materialService.getDetail(id).subscribe((material: Material) => {
      const modalOption: ModalOptions = {
        backdrop: 'static',
        initialState: {
          title: 'Sửa danh mục vật tư',
          material,
          isAddNew: false
        }
      };
      this.bsModalRef = this.modalService.show(MaterialAddEditModalComponent, modalOption);
      this.bsModalRef.content.saveEntity.subscribe((res: boolean) => {
        if (res) {
          this.loadData();
        }
      });
    });
  }
}
