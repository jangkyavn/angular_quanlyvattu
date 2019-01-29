import { AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ImportMaterialService } from '../services/import-material.service';

export function checkQuantityValidator(importMaterialService:
    ImportMaterialService,
    importId: number,
    inventoryId: number,
    materialId: number,
    quantity: number): AsyncValidatorFn {
    return (c: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
        return importMaterialService.checkQuantity(importId, inventoryId, materialId, quantity).pipe(
            map((res: any) => {
                return res.status ? null : { 'invalid': true, 'quantity': res.soLuong };
            })
        );
    };
}
