import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { HighlightSearchPipe } from './shared/pipes/highlight-search.pipe';

@NgModule({
    imports: [CommonModule, NgZorroAntdModule],
    declarations: [HighlightSearchPipe],
    exports: [CommonModule, NgZorroAntdModule, HighlightSearchPipe]
})
export class SharedModule { }
