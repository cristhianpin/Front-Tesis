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
  NbInputModule,
  NbSelectModule,
  NbSpinnerModule,
  NbToggleModule,
} from '@nebular/theme';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MultiSelectModule } from 'primeng/multiselect';
import { DeleteDialogRoutingModule, routedComponents } from './delete-dialog-routing.module';

@NgModule({
  imports: [
    DeleteDialogRoutingModule,
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
    NbSpinnerModule,
    NbAlertModule,
  ],
  exports: [],
  entryComponents: [],
  declarations: [...routedComponents],
  providers: [DatePipe],
})
export class DeleteDialogModule {}
