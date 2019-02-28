import { NgModule } from '@angular/core';
import { HighlightSearchPipe } from './shared/pipes/highlight-search.pipe';

@NgModule({
    declarations: [HighlightSearchPipe],
    exports: [HighlightSearchPipe]
})
export class SharedModule { }
