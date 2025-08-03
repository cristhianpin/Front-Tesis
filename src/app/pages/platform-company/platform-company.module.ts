import { NgModule } from '@angular/core';
import { TableModule } from 'primeng/table';

import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NbActionsModule,
  NbAlertModule,
  NbAutocompleteModule,
  NbButtonGroupModule,
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
  NbToggleModule,
  NbTooltipModule,
} from '@nebular/theme';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MultiSelectModule } from 'primeng/multiselect';
import { ThemeModule } from '../../@theme/theme.module';
import { PlatformCompanyListComponent } from './platform-company-list/platform-company-list.component';
import { PlatformCompanyRoutingModule, routedComponents } from './platform-company-routing.module';

@NgModule({
  imports: [
    ThemeModule,
    PlatformCompanyRoutingModule,
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
    NbButtonGroupModule,
  ],
  exports: [PlatformCompanyListComponent],
  entryComponents: [],
  declarations: [...routedComponents],
  providers: [DatePipe],
})
export class PlatformCompanyModule {}
