import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';

import { ManufacturerService } from 'src/app/shared/services/manufacturer.service';
import { Manufacturer } from 'src/app/shared/models/manufacturer.model';
import { ManufacturerAddEditModalComponent } from '../manufacturer-add-edit-modal/manufacturer-add-edit-modal.component';

@Component({
  selector: 'app-manufacturer-list',
  templateUrl: './manufacturer-list.component.html',
  styleUrls: ['./manufacturer-list.component.scss']
})
export class ManufacturerListComponent implements OnInit {
  manufacturers: Manufacturer[];
  bsModalRef: BsModalRef;

  constructor(
    private route: ActivatedRoute,
    private manufacturerService: ManufacturerService,
    private modalService: BsModalService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.manufacturers = data['manufacturers'];
    });
  }

  loadData() {
    this.manufacturerService.getAll().subscribe((res: Manufacturer[]) => {
      this.manufacturers = res;
    });
  }

  addNew() {
    const modalOption: ModalOptions = {
      backdrop: 'static',
      initialState: {
        title: 'Thêm hãng sản xuất',
        manufacturer: {},
        isAddNew: true
      }
    };
    this.bsModalRef = this.modalService.show(ManufacturerAddEditModalComponent, modalOption);
    this.bsModalRef.content.saveEntity.subscribe((res: boolean) => {
      if (res) {
        this.loadData();
      }
    });
  }

  update(id: number) {
    this.manufacturerService.getDetail(id).subscribe((manufacturer: Manufacturer) => {
      const modalOption: ModalOptions = {
        backdrop: 'static',
        initialState: {
          title: 'Sửa hãng sản xuất',
          manufacturer,
          isAddNew: false
        }
      };
      this.bsModalRef = this.modalService.show(ManufacturerAddEditModalComponent, modalOption);
      this.bsModalRef.content.saveEntity.subscribe((res: boolean) => {
        if (res) {
          this.loadData();
        }
      });
    });
  }
}
