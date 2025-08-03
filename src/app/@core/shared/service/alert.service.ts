import { Injectable, NgZone } from '@angular/core';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { RestResponse } from '../response/rest-response.model';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  // toast variables
  private destroyByClick: boolean;
  private duration: number;
  private hasIcon: boolean;
  private toastPosition: NbGlobalPhysicalPosition;
  private preventDuplicates: boolean;
  private toastConfig = {};
  // toast variables

  constructor(private toastrService: NbToastrService, private translateService: TranslateService, private zone: NgZone) {
    this.initToast();
  }

  private initToast(): void {
    this.destroyByClick = true;
    this.duration = 8000;
    this.hasIcon = true;
    this.toastPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
    this.preventDuplicates = false;
  }

  private configToast(type: string): void {
    this.toastConfig = {
      status: type,
      destroyByClick: this.destroyByClick,
      duration: this.duration,
      hasIcon: this.hasIcon,
      position: this.toastPosition,
      preventDuplicates: this.preventDuplicates,
    };
  }

  /*
    private getToastStatus(status: string): NbComponentStatus {
      //'basic' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'control'
      switch (status) {
        case 'SUCCESS':
          return NbComponentStatus.;
          break;
        case 'INFO':
          return NbToastStatus.INFO;
          break;
        case 'WARNING':
          return NbToastStatus.WARNING;
          break;
        case 'PRIMARY':
          return NbToastStatus.PRIMARY;
          break;
        case 'DANGER':
          return NbToastStatus.DANGER;
          break;
        case 'DEFAULT':
          return NbToastStatus.DEFAULT;
          break;
        default:
          return NbToastStatus.SUCCESS;
          break;
      }
    }
    */

  public showAlert(response: RestResponse): void {
    this.showToastr(response.message.severity, response.message.title, response.message.body);
  }

  public showAlertWithDetails(severity: string, title: string, message: string): void {
    this.showToastr(severity, title, message);
  }

  public showError(message: string): void {
    this.showToastr('danger', 'message.title.error', message);
  }

  public showToastr(toastrStatus: string, titleKey: string, message: string): void {
    this.zone.run(() => {
      this.configToast(toastrStatus);
      this.toastrService.show(
        this.translateService.instant(message),
        this.translateService.instant(titleKey),
        this.toastConfig,
      );
    });
  }
}
