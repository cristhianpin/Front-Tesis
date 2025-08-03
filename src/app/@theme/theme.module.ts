import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbSecurityModule } from '@nebular/security';
import {
  NbActionsModule,
  NbAlertModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbContextMenuModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbMenuModule,
  NbRadioModule,
  NbSearchModule,
  NbSelectModule,
  NbSidebarModule,
  NbSpinnerModule,
  NbThemeModule,
  NbToggleModule,
  NbUserModule,
} from '@nebular/theme';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FileUploadModule } from 'primeng/fileupload';
import { ListboxModule } from 'primeng/listbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { PasswordStrengthComponent } from '../authentication/password-strength/password-strength.component';
// import { DiagramComponent } from '../pages/diagram/diagram.component';
import {
  AttachedFilesComponent,
  AttachedFilesListComponent,
  FooterComponent,
  HeaderComponent,
  SearchInputComponent,
  ShareDialogComponent,
  TableExportDialogComponent,
  TablePreferenceDialogComponent,
  TermsDialogComponent,
  TinyMCEComponent,
  UiSidebarComponent,
} from './components';
import { OneColumnLayoutComponent, ThreeColumnsLayoutComponent, TwoColumnsLayoutComponent } from './layouts';
import { CapitalizePipe, NumberWithCommasPipe, PluralPipe, RoundPipe, TimingPipe } from './pipes';
import { CORPORATE_THEME } from './styles/theme.corporate';
import { COSMIC_THEME } from './styles/theme.cosmic';
import { DARK_THEME } from './styles/theme.dark';
import { DEFAULT_THEME } from './styles/theme.default';

import { ChipsModule } from 'primeng/chips';

const NB_MODULES = [
  NbLayoutModule,
  NbMenuModule,
  NbToggleModule,
  NbUserModule,
  NbActionsModule,
  NbSearchModule,
  NbSidebarModule,
  NbContextMenuModule,
  NbSecurityModule,
  NbButtonModule,
  NbSelectModule,
  NbCardModule,
  NbRadioModule,
  NbIconModule,
  NbEvaIconsModule,
  FileUploadModule,
  TableModule,
  TranslateModule,
  FormsModule,
  ReactiveFormsModule,
  NbInputModule,
  ListboxModule,
  MultiSelectModule,
  NbCheckboxModule,
  NbCardModule,
  NbSpinnerModule,
  NbAlertModule,
  ChipsModule,
];
const COMPONENTS = [
  HeaderComponent,
  AttachedFilesComponent,
  AttachedFilesListComponent,
  TablePreferenceDialogComponent,
  TableExportDialogComponent,
  ShareDialogComponent,
  TermsDialogComponent,
  UiSidebarComponent,
  FooterComponent,
  SearchInputComponent,
  TinyMCEComponent,
  OneColumnLayoutComponent,
  ThreeColumnsLayoutComponent,
  TwoColumnsLayoutComponent,
  // DiagramComponent,
  PasswordStrengthComponent,
];
const PIPES = [CapitalizePipe, PluralPipe, RoundPipe, TimingPipe, NumberWithCommasPipe];

@NgModule({
  imports: [CommonModule, ...NB_MODULES],
  exports: [CommonModule, ...PIPES, ...COMPONENTS],
  declarations: [...COMPONENTS, ...PIPES],
})
export class ThemeModule {
  static forRoot(): ModuleWithProviders<ThemeModule> {
    return {
      ngModule: ThemeModule,
      providers: [
        ...NbThemeModule.forRoot(
          {
            name: 'corporate',
          },
          [DEFAULT_THEME, COSMIC_THEME, CORPORATE_THEME, DARK_THEME],
        ).providers,
      ],
    };
  }
}
