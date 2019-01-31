import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';

import { PersonnelService } from 'src/app/shared/services/personnel.service';
import { Personnel } from 'src/app/shared/models/personnel.model';
import { PersonnelAddEditModalComponent } from '../personnel-add-edit-modal/personnel-add-edit-modal.component';

@Component({
  selector: 'app-personnel-list',
  templateUrl: './personnel-list.component.html',
  styleUrls: ['./personnel-list.component.scss']
})
export class PersonnelListComponent implements OnInit {
  personnels: Personnel[];
  bsModalRef: BsModalRef;

  constructor(
    private route: ActivatedRoute,
    private personnelService: PersonnelService,
    private modalService: BsModalService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.personnels = data['personnels'];
    });
  }

  loadData() {
    this.personnelService.getAll().subscribe((res: Personnel[]) => {
      this.personnels = res;
    });
  }

  addNew() {
    const modalOption: ModalOptions = {
      backdrop: 'static',
      initialState: {
        title: 'Thêm nhân sự',
        personnel: {},
        isAddNew: true
      }
    };
    this.bsModalRef = this.modalService.show(PersonnelAddEditModalComponent, modalOption);
    this.bsModalRef.content.saveEntity.subscribe((res: boolean) => {
      if (res) {
        this.loadData();
      }
    });
  }

  update(id: number) {
    this.personnelService.getDetail(id).subscribe((personnel: Personnel) => {
      const modalOption: ModalOptions = {
        backdrop: 'static',
        initialState: {
          title: 'Sửa nhân sự',
          personnel,
          isAddNew: false
        }
      };
      this.bsModalRef = this.modalService.show(PersonnelAddEditModalComponent, modalOption);
      this.bsModalRef.content.saveEntity.subscribe((res: boolean) => {
        if (res) {
          this.loadData();
        }
      });
    });
  }
}
