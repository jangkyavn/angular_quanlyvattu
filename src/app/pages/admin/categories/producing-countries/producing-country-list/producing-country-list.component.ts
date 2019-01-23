import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';

import { ProducingCountryService } from 'src/app/shared/services/producing-country.service';
import { ProducingCountry } from 'src/app/shared/models/producing-country.model';
import { ProducingCountryAddEditModalComponent } from '../producing-country-add-edit-modal/producing-country-add-edit-modal.component';

@Component({
  selector: 'app-producing-country-list',
  templateUrl: './producing-country-list.component.html',
  styleUrls: ['./producing-country-list.component.scss']
})
export class ProducingCountryListComponent implements OnInit {
  producingCountries: ProducingCountry[];
  bsModalRef: BsModalRef;

  constructor(
    private route: ActivatedRoute,
    private producingCountryService: ProducingCountryService,
    private modalService: BsModalService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.producingCountries = data['producing-countries'];
    });
  }

  loadData() {
    this.producingCountryService.getAll().subscribe((res: ProducingCountry[]) => {
      this.producingCountries = res;
    });
  }

  addNew() {
    const modalOption: ModalOptions = {
      backdrop: 'static',
      initialState: {
        title: 'Thêm nước sản xuất',
        producingCountry: {},
        isAddNew: true
      }
    };
    this.bsModalRef = this.modalService.show(ProducingCountryAddEditModalComponent, modalOption);
    this.bsModalRef.content.saveEntity.subscribe((res: boolean) => {
      if (res) {
        this.loadData();
      }
    });
  }

  update(id: number) {
    this.producingCountryService.getDetail(id).subscribe((producingCountry: ProducingCountry) => {
      const modalOption: ModalOptions = {
        backdrop: 'static',
        initialState: {
          title: 'Sửa nước sản xuất',
          producingCountry,
          isAddNew: false
        }
      };
      this.bsModalRef = this.modalService.show(ProducingCountryAddEditModalComponent, modalOption);
      this.bsModalRef.content.saveEntity.subscribe((res: boolean) => {
        if (res) {
          this.loadData();
        }
      });
    });
  }
}
