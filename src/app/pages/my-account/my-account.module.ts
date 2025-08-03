import { NgModule } from '@angular/core';
import { TableModule } from 'primeng/table';

import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NbActionsModule,
  NbAlertModule,
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
} from '@nebular/theme';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
// import { QRCodeModule } from 'angularx-qrcode';
import { MultiSelectModule } from 'primeng/multiselect';
import { ThemeModule } from '../../@theme/theme.module';
import { MyAccountRoutingModule, routedComponents } from './my-account-routing.module';

@NgModule({
  imports: [
    ThemeModule,
    MyAccountRoutingModule,
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
    NbTabsetModule,
    NbSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NbAlertModule,
    NbFormFieldModule,
    NbIconModule,
    // QRCodeModule,
  ],
  exports: [],
  entryComponents: [],
  declarations: [...routedComponents],
  providers: [DatePipe],
})
export class MyAccountModule {}
