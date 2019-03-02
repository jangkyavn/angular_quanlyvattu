import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ProducingCountriesRoutingModule } from './producing-countries.routing.module';
import { SharedModule } from 'src/app/shared.module';

import { ProducingCountryListComponent } from './producing-country-list/producing-country-list.component';
import {
  ProducingCountryAddEditModalComponent
} from './modals/producing-country-add-edit-modal/producing-country-add-edit-modal.component';

import { ProducingCountryListResolver } from 'src/app/shared/resolvers/producing-country.resolver';

@NgModule({
  imports: [
    ReactiveFormsModule,
    ProducingCountriesRoutingModule,
    SharedModule
  ],
  declarations: [
    ProducingCountryListComponent,
    ProducingCountryAddEditModalComponent
  ],
  entryComponents: [ProducingCountryAddEditModalComponent],
  providers: [ProducingCountryListResolver]
})
export class ProducingCountriesModule { }
