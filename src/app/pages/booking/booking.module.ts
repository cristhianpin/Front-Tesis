import { NgModule } from '@angular/core';
import { TableModule } from 'primeng/table';

import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NbActionsModule,
  NbAlertModule,
  NbAutocompleteModule,
  NbBadgeModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDatepickerModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbRadioModule,
  NbSelectModule,
  NbSpinnerModule,
  NbStepperModule,
  NbTabsetModule,
  NbToggleModule,
  NbTooltipModule,
} from '@nebular/theme';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MultiSelectModule } from 'primeng/multiselect';
import { ThemeModule } from '../../@theme/theme.module';
import { BookingRoutingModule, routedComponents } from './booking-routing.module';
// import { NbDateFnsDateModule } from '@nebular/date-fns';

@NgModule({
  imports: [
    ThemeModule,
    BookingRoutingModule,
    NbActionsModule,
    NbCardModule,
    NbSelectModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,
    NbToggleModule,
    NgbDropdownModule,
    TableModule,
    MultiSelectModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NbTooltipModule,
    NbIconModule,
    NbSpinnerModule,
    NbFormFieldModule,
    NbActionsModule,
    NbCardModule,
    NbSelectModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,
    NbToggleModule,
    NgbDropdownModule,
    TableModule,
    MultiSelectModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NbStepperModule,
    NbRadioModule,
    NbAutocompleteModule,
    NbIconModule,
    NbFormFieldModule,
    NbSpinnerModule,
    NbAlertModule,
    NbTooltipModule,
    NbBadgeModule,
    AutoCompleteModule,
    NbTabsetModule,
    NbDatepickerModule,
  ],
  exports: [],
  entryComponents: [],
  declarations: [...routedComponents],
  providers: [DatePipe],
})
export class BookingModule {}
