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
import { AccountRoutingModule, routedComponents } from './account-routing.module';
import { FileUploadModule } from 'primeng/fileupload';

@NgModule({
  imports: [
    ThemeModule,
    AccountRoutingModule,
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
    FileUploadModule,
  ],
  exports: [],
  entryComponents: [],
  declarations: [...routedComponents],
  providers: [DatePipe],
})
export class AccountModule {}
