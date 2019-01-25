import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';

import { ImportMaterialService } from 'src/app/shared/services/import-material.service';
import { ImportMaterial } from 'src/app/shared/models/import-material.model';

import { ImportEditModalComponent } from '../import-edit-modal/import-edit-modal.component';
import { NotifyService } from 'src/app/shared/services/notify.service';

@Component({
  selector: 'app-import-list',
  templateUrl: './import-list.component.html',
  styleUrls: ['./import-list.component.scss']
})
export class ImportListComponent implements OnInit {
  importMaterials: ImportMaterial[];
  bsModalRef: BsModalRef;

  constructor(
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private importMaterialService: ImportMaterialService,
    private notify: NotifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.importMaterials = data['import-materials'];
    });
  }

  loadData() {
    this.importMaterialService.getAll().subscribe((res: ImportMaterial[]) => {
      this.importMaterials = res;
    });
  }

  update(id: number) {
    this.importMaterialService.getDetail(id).subscribe((nhapVatTuParams: any) => {
      const modalOption: ModalOptions = {
        backdrop: 'static',
        class: 'modal-lg',
        initialState: {
          title: 'Sửa nhập vật tư',
          nhapVatTuParams
        }
      };
      this.bsModalRef = this.modalService.show(ImportEditModalComponent, modalOption);
      this.bsModalRef.content.saveEntity.subscribe((res: boolean) => {
        if (res) {
          this.loadData();
        }
      });
    });
  }

  delete(id: number) {
    this.notify.confirm('Bạn có chắc chắn muốn xóa không?', () => {
      this.importMaterialService.delete(id).subscribe((res: boolean) => {
        if (res) {
          this.loadData();
          this.notify.success('Xóa thành công');
        }
      }, error => {
        console.log('error deleteImport');
      });
    });
  }
}
