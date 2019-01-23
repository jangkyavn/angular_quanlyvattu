import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';

import { SupplyService } from 'src/app/shared/services/supply.service';
import { Supply } from 'src/app/shared/models/supply.model';
import { SupplyAddEditModalComponent } from '../supply-add-edit-modal/supply-add-edit-modal.component';

@Component({
  selector: 'app-supply-list',
  templateUrl: './supply-list.component.html',
  styleUrls: ['./supply-list.component.scss']
})
export class SupplyListComponent implements OnInit {
  supplies: Supply[];
  bsModalRef: BsModalRef;

  constructor(
    private route: ActivatedRoute,
    private supplyService: SupplyService,
    private modalService: BsModalService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.supplies = data['supplies'];
    });
  }

  loadData() {
    this.supplyService.getAll().subscribe((res: Supply[]) => {
      this.supplies = res;
    });
  }

  addNew() {
    const modalOption: ModalOptions = {
      backdrop: 'static',
      initialState: {
        title: 'Thêm nguồn cung cấp',
        supply: {},
        isAddNew: true
      }
    };
    this.bsModalRef = this.modalService.show(SupplyAddEditModalComponent, modalOption);
    this.bsModalRef.content.saveEntity.subscribe((res: boolean) => {
      if (res) {
        this.loadData();
      }
    });
  }

  update(id: number) {
    this.supplyService.getDetail(id).subscribe((supply: Supply) => {
      const modalOption: ModalOptions = {
        backdrop: 'static',
        initialState: {
          title: 'Sửa nguồn cung cấp',
          supply,
          isAddNew: false
        }
      };
      this.bsModalRef = this.modalService.show(SupplyAddEditModalComponent, modalOption);
      this.bsModalRef.content.saveEntity.subscribe((res: boolean) => {
        if (res) {
          this.loadData();
        }
      });
    });
  }
}
