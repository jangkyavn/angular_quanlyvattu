import { AbstractControl } from '@angular/forms';

export function checkQuantityKhongAmValidator(c: AbstractControl) {
    if (!c.parent || !c) {
        return;
    }
    const cQuantity = c.parent.get('soLuong');

    if (cQuantity.value <= 0) {
        return { isAm: true };
    }
}
