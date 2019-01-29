import { AbstractControl } from '@angular/forms';

export function checkPriceKhongAmValidator(c: AbstractControl) {
    if (!c.parent || !c) {
        return;
    }
    const donGia = c.parent.get('donGia').value + '';
    return (donGia.indexOf('-') !== -1) ? { 'isNegative': true } : null;
}
