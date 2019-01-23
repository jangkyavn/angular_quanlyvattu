import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';

import { UnitService } from 'src/app/shared/services/unit.service';
import { Unit } from 'src/app/shared/models/unit.model';
import { UnitAddEditModalComponent } from '../unit-add-edit-modal/unit-add-edit-modal.component';

@Component({
  selector: 'app-unit-list',
  templateUrl: './unit-list.component.html',
  styleUrls: ['./unit-list.component.scss']
})
export class UnitListComponent implements OnInit {
  units: Unit[];
  bsModalRef: BsModalRef;

  constructor(
    private route: ActivatedRoute,
    private unitService: UnitService,
    private modalService: BsModalService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.units = data['units'];
    });
  }

  loadData() {
    this.unitService.getAll().subscribe((res: Unit[]) => {
      this.units = res;
    });
  }

  addNew() {
    const modalOption: ModalOptions = {
      backdrop: 'static',
      initialState: {
        title: 'Thêm đơn vị tính',
        unit: {},
        isAddNew: true
      }
    };
    this.bsModalRef = this.modalService.show(UnitAddEditModalComponent, modalOption);
    this.bsModalRef.content.saveEntity.subscribe((res: boolean) => {
      if (res) {
        this.loadData();
      }
    });
  }

  update(id: number) {
    this.unitService.getDetail(id).subscribe((unit: Unit) => {
      const modalOption: ModalOptions = {
        backdrop: 'static',
        initialState: {
          title: 'Sửa đơn vị tính',
          unit,
          isAddNew: false
        }
      };
      this.bsModalRef = this.modalService.show(UnitAddEditModalComponent, modalOption);
      this.bsModalRef.content.saveEntity.subscribe((res: boolean) => {
        if (res) {
          this.loadData();
        }
      });
    });
  }
}
