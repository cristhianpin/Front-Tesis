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
  NbToggleModule,
  NbTooltipModule,
} from '@nebular/theme';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MultiSelectModule } from 'primeng/multiselect';
import { ThemeModule } from '../../@theme/theme.module';
import { MovementListComponent } from './movement-list/movement-list.component';
import { MovementRoutingModule, routedComponents } from './movement-routing.module';

@NgModule({
  imports: [
    ThemeModule,
    MovementRoutingModule,
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
  ],
  exports: [MovementListComponent],
  entryComponents: [],
  declarations: [...routedComponents],
  providers: [DatePipe],
})
export class MovementModule {}
