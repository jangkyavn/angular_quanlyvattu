import { AbstractControl } from '@angular/forms';

export function checkChietKhauNanValidator(c: AbstractControl) {
    if (!c.parent || !c) {
        return;
    }
    const chietKhau = c.parent.get('chietKhau').value;
    if (chietKhau === null || chietKhau === undefined) {
        return { 'invalid': true };
    }

    return isNaN(chietKhau) ? { 'invalid': true } : null;
}
