import { AbstractControl } from '@angular/forms';

export function checkChietKhauRangeValidator(c: AbstractControl) {
    if (!c.parent || !c) {
        return;
    }
    const chietKhau = c.parent.get('chietKhau').value;
    return (chietKhau < 0 || chietKhau > 100) ? { 'notRange': true } : null;
}
