import { AbstractControl } from '@angular/forms';

export function checkChangePasswordConfirmValidator(c: AbstractControl) {
    if (!c.parent || !c) {
        return;
    }
    const pwd = c.parent.get('newPassword');
    const cpwd = c.parent.get('confirmNewPassword');

    if (!pwd || !cpwd) {
        return;
    }
    if (pwd.value !== cpwd.value) {
        return { notSame: true };
    }
}
