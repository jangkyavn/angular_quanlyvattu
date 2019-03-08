import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { HighlightSearchPipe } from './shared/pipes/highlight-search.pipe';
import { HasRoleDirective } from './shared/directives/has-role.directive';

@NgModule({
    imports: [CommonModule, NgZorroAntdModule],
    declarations: [HighlightSearchPipe, HasRoleDirective],
    exports: [CommonModule, NgZorroAntdModule, HighlightSearchPipe, HasRoleDirective]
})
export class SharedModule { }
