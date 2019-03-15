import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { User } from 'src/app/shared/models/user.model';
import { Role } from 'src/app/shared/models/role.model';

import { RoleService } from 'src/app/shared/services/role.service';
import { RoleListComponent } from './role-list/role-list.component';

@Component({
  selector: 'app-role-edit-modal',
  templateUrl: './role-edit-modal.component.html',
  styleUrls: ['./role-edit-modal.component.scss']
})
export class RoleEditModalComponent implements OnInit {
  @ViewChild('roleList') roleList: RoleListComponent;
  @Input() user: User;
  tabListTitle: string;
  tabDetailTitle: string;
  visibleTabDetail: boolean;
  selectedIndex = 1;
  role: Role;

  constructor(private roleService: RoleService) { }

  ngOnInit() {
    this.tabListTitle = 'Quyền';
    this.visibleTabDetail = false;
  }

  updateRoles(callBack: (result: Role[]) => any) {
    this.roleList.updateRoles((res: Role[]) => {
      callBack(res);
    });
  }

  viewPermission(event: any) {
    if (event.showPermission) {
      this.role = event.role;
      this.tabListTitle = 'Quay lại';
      this.tabDetailTitle = this.role.name;
      this.visibleTabDetail = true;
      this.selectedIndex = 2;
    }
  }

  backToList() {
    if (this.selectedIndex === 2) {
      this.tabListTitle = 'Quyền';
      this.tabDetailTitle = 'Chức năng';
      this.visibleTabDetail = false;
      this.selectedIndex = 1;
    }
  }
}
