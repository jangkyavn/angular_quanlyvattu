import { AbstractControl } from '@angular/forms';

export function checkNewPasswordValidator(c: AbstractControl) {
    if (!c.parent || !c) {
        return;
    }
    const currentPassword = c.parent.get('currentPassword');
    const newPassword = c.parent.get('newPassword');

    if (!currentPassword || !newPassword) {
        return;
    }
    if (currentPassword.value === newPassword.value) {
        return { isSame: true };
    }
}
