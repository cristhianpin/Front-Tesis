import { ErrorHandler, Injectable } from '@angular/core';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandlerService implements ErrorHandler {
  constructor(private toastrService: NbToastrService, private translateService: TranslateService) {}

  handleError(error: any): void {
    let errorMessage = '';
    if (error.error) {
      errorMessage = error.error.error || error.error.message;
    } else {
      errorMessage = error.message || error;
    }
    this.showToastWithIcon('danger', 'Error', errorMessage, 'alert-triangle-outline');
  }

  private showToastWithIcon(status: NbComponentStatus, title: string, body: string, icon: string): void {
    // const iconConfig: NbIconConfig = {
    //     icon: icon,
    //     pack: 'eva',
    //     status: status,
    // };
    // const config: NbToastrConfig = {
    //   position: NbGlobalPhysicalPosition.TOP_RIGHT,
    //   hasIcon: true,
    //   status: '',
    //   preventDuplicates: true,
    //   icon: iconConfig,
    //   limit: 3,
    // };
    this.toastrService.show(this.translateService.instant(body), this.translateService.instant(title), { status });
  }
}
