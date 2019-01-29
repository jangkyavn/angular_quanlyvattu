import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';

import { ExportMaterialService } from 'src/app/shared/services/export-material.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

import { ExportMaterial } from 'src/app/shared/models/export-material.model';
import { ExportEditModalComponent } from '../export-edit-modal/export-edit-modal.component';

@Component({
  selector: 'app-export-list',
  templateUrl: './export-list.component.html',
  styleUrls: ['./export-list.component.scss']
})
export class ExportListComponent implements OnInit {
  exportMaterials: ExportMaterial[];
  bsModalRef: BsModalRef;

  constructor(
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private exportMaterialService: ExportMaterialService,
    private notify: NotifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.exportMaterials = data['export-materials'];
    });
  }

  loadData() {
    this.exportMaterialService.getAll().subscribe((res: ExportMaterial[]) => {
      this.exportMaterials = res;
    });
  }

  update(id: number) {
    this.exportMaterialService.getDetail(id).subscribe((xuatVatTuParams: any) => {
      const modalOption: ModalOptions = {
        backdrop: 'static',
        class: 'modal-lg',
        initialState: {
          title: 'Sửa xuất vật tư',
          xuatVatTuParams
        }
      };
      this.bsModalRef = this.modalService.show(ExportEditModalComponent, modalOption);
      this.bsModalRef.content.saveEntity.subscribe((res: boolean) => {
        if (res) {
          this.loadData();
        }
      });
    });
  }

  delete(id: number) {
    this.notify.confirm('Bạn có chắc chắn muốn xóa không?', () => {
      this.exportMaterialService.delete(id).subscribe((res: boolean) => {
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
