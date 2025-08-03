import { NgModule } from '@angular/core';
import { TableModule } from 'primeng/table';

import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NbAccordionModule,
  NbActionsModule,
  NbAlertModule,
  NbButtonGroupModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbSelectModule,
  NbSpinnerModule,
  NbTabsetModule,
  NbToggleModule,
  NbTooltipModule,
} from '@nebular/theme';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MultiSelectModule } from 'primeng/multiselect';
import { ThemeModule } from '../../@theme/theme.module';
import { PlatformClientRoutingModule, routedComponents } from './platform-client-routing.module';
import { DataViewModule } from 'primeng/dataview';

@NgModule({
  imports: [
    ThemeModule,
    PlatformClientRoutingModule,
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
    NbTabsetModule,
    NbAlertModule,
    NbButtonGroupModule,
  ],
  exports: [],
  entryComponents: [],
  declarations: [...routedComponents],
  providers: [DatePipe],
})
export class PlatformClientModule {}
