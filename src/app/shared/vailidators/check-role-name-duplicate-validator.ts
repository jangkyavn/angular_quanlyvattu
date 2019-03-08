import { AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RoleService } from '../services/role.service';

export function checkRoleNameDuplicateValidator(roleService: RoleService, currentName: string): AsyncValidatorFn {
  return (c: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return roleService.checkNameExists(c.value).pipe(
      map(res => {
        if (c.value.toLowerCase().trim() === currentName.toLowerCase().trim()) {
          return null;
        }

        return res ? { 'duplicate': true } : null;
      })
    );
  };
}
