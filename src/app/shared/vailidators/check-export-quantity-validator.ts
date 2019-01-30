import { AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ExportMaterialService } from '../services/export-material.service';

export function checkExportQuantityValidator(
    exportMaterialService: ExportMaterialService,
    importId: number,
    materialId: number,
    quantity: number): AsyncValidatorFn {
    return (c: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
        return exportMaterialService.checkQuantity(importId, materialId, quantity).pipe(
            map((res: any) => {
                return res.status ? null : { 'invalid': true, 'quantity': res.soLuong };
            })
        );
    };
}
