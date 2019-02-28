import { Component, OnInit, HostListener } from '@angular/core';
import { Pagination, PaginatedResult } from 'src/app/shared/models/pagination.model';
import { PagingParams } from 'src/app/shared/params/paging.param';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';
import { NotifyService } from 'src/app/shared/services/notify.service';
import { LiquidationMaterialService } from 'src/app/shared/services/liquidation-material.service';
import { LiquidationMaterial } from 'src/app/shared/models/liquidation-material.model';

@Component({
  selector: 'app-liquidation-materials',
  templateUrl: './liquidation-materials.component.html',
  styleUrls: ['./liquidation-materials.component.scss']
})
export class LiquidationMaterialsComponent implements OnInit {
  dataSet = [];
  loading = true;
  sortValue = '';
  sortKey = '';

  startValue = '';
  endValue = '';
  disabledButtonSearch = true;

  pagination: Pagination;
  pagingParams: PagingParams = {
    keyword: '',
    sortKey: '',
    sortValue: '',
    fromDate: '',
    toDate: ''
  };

  @HostListener('window:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent) {
    if (($event.ctrlKey || $event.metaKey) && ($event.keyCode === 73 || $event.keyCode === 105)) {
      ////////////////////////////////////////////////////////////
    }
  }

  constructor(private route: ActivatedRoute,
    private router: Router,
    private modalService: NzModalService,
    private liquidationService: LiquidationMaterialService,
    private notify: NotifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.loading = false;
      this.pagination = data['liquidation-materials'].pagination;
      this.dataSet = data['liquidation-materials'].result;
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
    this.liquidationService.getAllPaging(this.pagination.currentPage, this.pagination.itemsPerPage, this.pagingParams)
      .subscribe((res: PaginatedResult<LiquidationMaterial[]>) => {
        this.loading = false;
        this.pagination = res.pagination;
        this.dataSet = res.result;
      }, error => {
        this.notify.error('Có lỗi xảy ra');
        console.log('error getAllPagingLiquidationMaterial');
      }, () => {
        if (this.dataSet.length === 0 && this.pagination.currentPage !== 1) {
          this.pagination.currentPage -= 1;
          this.loadData();
        }
      });
  }

  delete(id: number) {
    this.notify.confirm('Bạn có chắc chắn muốn xóa không?', () => {
      this.liquidationService.delete(id).subscribe((res: boolean) => {
        if (res) {
          this.loadData();
          this.notify.success('Xóa thành công');
        }
      }, error => {
        console.log('error deleteLiquidationMaterial');
      });
    });
  }

  search(keyword: string) {
    this.pagingParams.keyword = keyword;
    this.pagingParams.fromDate = this.startValue;
    this.pagingParams.toDate = this.endValue;

    this.loadData(true);
  }

  view(id: number) {
    // this.liquidationService.getDetail(id).subscribe((res: any) => {
    //   const modal = this.modalService.create({
    //     nzTitle: 'Xem phiếu xuất',
    //     nzContent: ExportViewDetailModalComponent,
    //     nzMaskClosable: false,
    //     nzClosable: false,
    //     nzWidth: 1000,
    //     nzComponentParams: {
    //       exportMaterialParams: res
    //     },
    //     nzFooter: [
    //       {
    //         label: 'Hủy',
    //         shape: 'default',
    //         onClick: () => modal.destroy()
    //       }
    //     ]
    //   });
    // });
  }

  enableButtonSearch() {
    if (this.startValue > this.endValue) {
      return true;
    }

    return !(this.startValue && this.endValue);
  }

  changeFromDate(value: any) {
    this.startValue = value;

    if (this.endValue === null || this.endValue === '') {
      this.endValue = this.startValue;
    }

    this.disabledButtonSearch = this.enableButtonSearch();

    if ((this.startValue === '' && this.endValue === '') || (this.startValue === null && this.endValue) === '') {
      this.search(this.pagingParams.keyword);
    }
  }

  changeToDate(value: any) {
    this.endValue = value;
    this.disabledButtonSearch = this.enableButtonSearch();

    if ((this.startValue === '' && this.endValue === '') || (this.startValue === null && this.endValue) === '') {
      this.search(this.pagingParams.keyword);
    }
  }
}
