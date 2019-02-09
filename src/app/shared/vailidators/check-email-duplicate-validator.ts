import { AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserService } from '../services/user.service';

export function checkEmailDuplicateValidator(userService: UserService, currentEmail: string): AsyncValidatorFn {
    return (c: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
        return userService.checkEmailExists(c.value).pipe(
            map(res => {
              if (c.value.toLowerCase().trim() === currentEmail.toLowerCase().trim()) {
                return null;
              }

              return res ? { 'duplicate': true } : null;
            })
          );
    };
}
