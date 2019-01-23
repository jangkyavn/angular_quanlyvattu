import { Component, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { User } from '../../../../../shared/models/user.model';
import { Role } from '../../../../../shared/models/role.model';
import { RoleService } from '../../../../../shared/services/role.service';

@Component({
  selector: 'app-role-edit-modal',
  templateUrl: './role-edit-modal.component.html',
  styleUrls: ['./role-edit-modal.component.scss']
})
export class RoleEditModalComponent implements OnInit, AfterViewInit {
  @Output() saveRoles = new EventEmitter<Role[]>();
  user: User;
  roles: Role[] = [];

  constructor(
    public bsModalRef: BsModalRef,
    private roleService: RoleService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.roleService.getAll().subscribe((res: Role[]) => {
      const userRoles = this.user.roles;
      const availableRoles: any[] = res;

      for (let i = 0; i < availableRoles.length; i++) {
        let isMatch = false;
        for (let j = 0; j < userRoles.length; j++) {
          if (availableRoles[i].name === userRoles[j]) {
            isMatch = true;
            availableRoles[i].checked = true;
            this.roles.push(availableRoles[i]);
            break;
          }
        }

        if (!isMatch) {
          availableRoles[i].checked = false;
          this.roles.push(availableRoles[i]);
        }
      }
    });
  }

  updateRoles() {
    this.saveRoles.emit(this.roles);
    this.bsModalRef.hide();
  }
}
