import { AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserService } from '../services/user.service';

export function checkUsernameExists(userService: UserService): AsyncValidatorFn {
    return (c: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
        return userService.checkUserNameExists(c.value).pipe(
            map(res => {
              return res ? null : { 'notExists': true };
            })
          );
    };
}
