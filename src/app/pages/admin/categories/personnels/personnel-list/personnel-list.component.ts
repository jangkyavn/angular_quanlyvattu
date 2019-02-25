import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';

import { PersonnelService } from 'src/app/shared/services/personnel.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

import { Personnel } from 'src/app/shared/models/personnel.model';
import { PersonnelAddEditModalComponent } from '../personnel-add-edit-modal/personnel-add-edit-modal.component';
import { Pagination, PaginatedResult } from 'src/app/shared/models/pagination.model';
import { PagingParams } from 'src/app/shared/params/paging.param';
import { PersonnelViewDetailModalComponent } from '../personnel-view-detail-modal/personnel-view-detail-modal.component';

@Component({
  selector: 'app-personnel-list',
  templateUrl: './personnel-list.component.html',
  styleUrls: ['./personnel-list.component.scss']
})
export class PersonnelListComponent implements OnInit {
  dataSet = [];
  loading = true;
  sortValue = null;
  sortKey = null;

  pagination: Pagination;
  pagingParams: PagingParams = {
    keyword: '',
    sortKey: '',
    sortValue: ''
  };

  @HostListener('window:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent) {
    if (($event.ctrlKey || $event.metaKey) && ($event.keyCode === 73 || $event.keyCode === 105)) {
      this.addNew();
    }
  }

  constructor(
    private route: ActivatedRoute,
    private modalService: NzModalService,
    private personnelService: PersonnelService,
    private notify: NotifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.loading = false;
      this.pagination = data['personnels'].pagination;
      this.dataSet = data['personnels'].result;
    });
  }

  sort(sort: { key: string, value: string }): void {
    this.pagingParams.sortKey = sort.key;
    this.pagingParams.sortValue = sort.value;
    this.loadData();
  }

  loadData(reset: boolean = false): void {
    if (reset) {
      this.pagination.currentPage = 1;
    }
    this.loading = true;
    this.personnelService.getAllPaging(this.pagination.currentPage, this.pagination.itemsPerPage, this.pagingParams)
      .subscribe((res: PaginatedResult<Personnel[]>) => {
        this.loading = false;
        this.pagination = res.pagination;
        this.dataSet = res.result;
      }, error => {
        this.notify.error('Có lỗi xảy ra');
        console.log('error getAllPagingPersonnel');
      }, () => {
        if (this.dataSet.length === 0 && this.pagination.currentPage !== 1) {
          this.pagination.currentPage -= 1;
          this.loadData();
        }
      });
  }

  addNew() {
    const modal = this.modalService.create({
      nzTitle: 'Thêm nhân sự',
      nzContent: PersonnelAddEditModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 880,
      nzComponentParams: {
        personnel: {},
        isAddNew: true
      },
      nzFooter: [
        {
          label: 'Hủy',
          shape: 'default',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Lưu',
          type: 'primary',
          onClick: (componentInstance) => {
            componentInstance.saveChanges();
          }
        }
      ]
    });

    modal.afterClose.subscribe((result: boolean) => {
      if (result) {
        this.loadData();
      }
    });
  }

  update(id: number) {
    this.personnelService.getDetail(id).subscribe((personnel: Personnel) => {
      const modal = this.modalService.create({
        nzTitle: 'Sửa nhân sự',
        nzContent: PersonnelAddEditModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: 880,
        nzComponentParams: {
          personnel,
          isAddNew: false
        },
        nzFooter: [
          {
            label: 'Hủy',
            shape: 'default',
            onClick: () => modal.destroy()
          },
          {
            label: 'Lưu',
            type: 'primary',
            onClick: (componentInstance) => {
              componentInstance.saveChanges();
            }
          }
        ]
      });

      modal.afterClose.subscribe((result: boolean) => {
        if (result) {
          this.loadData();
        }
      });
    });
  }

  view(personnel: Personnel) {
    const modal = this.modalService.create({
      nzTitle: 'Xem nhân sự',
      nzContent: PersonnelViewDetailModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 880,
      nzComponentParams: {
        personnel
      },
      nzFooter: [
        {
          label: 'Hủy',
          shape: 'default',
          onClick: () => modal.destroy()
        }
      ]
    });
  }

  delete(id: number) {
    this.notify.confirm('Bạn có chắc chắn muốn xóa không?', () => {
      this.personnelService.delete(id).subscribe((res: boolean) => {
        if (res) {
          this.notify.success('Xóa thành công!');
          this.loadData();
        } else {
          this.notify.warning('Nhân sự đang được sử dụng. Không được xóa!');
        }
      }, _ => {
        this.notify.error('Có lỗi xảy ra');
        console.log('error deletePersonnel');
      });
    });
  }

  search(keyword: string) {
    this.pagingParams.keyword = keyword;
    this.loadData(true);
  }
}
