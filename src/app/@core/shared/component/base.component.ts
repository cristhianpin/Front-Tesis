import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RoleEnum } from '../enum/role.enum';
import { ServiceInjector } from '../injector/service-injector.module';
import { IJwtUser } from '../model/jwt-user.model';
import { IUserPreference } from '../model/user-preference.model';

export class BaseComponent {
  public readonly DATE_FORMAT_LONG = environment.DATE_FORMAT_LONG;
  public readonly DATE_FORMAT_SHORT = environment.DATE_FORMAT_SHORT;
  public readonly TZ = environment.TZ;
  public readonly LOCALE = environment.LOCALE;
  public readonly NUMBER_FORMAT = environment.NUMBER_FORMAT;
  public readonly ROLE_PREFIX = 'ROLE_';

  public showSpinner = false;
  public spinnerMessage = 'spinner.loading';

  protected subscriptions: Subscription[] = [];
  public userPreference: IUserPreference = {} as IUserPreference;

  protected readonly EXCEL_EXTENSION = '.' + environment.EXCEL_EXTENSION;
  protected readonly CSV_EXTENSION = '.' + environment.CSV_EXTENSION;
  protected readonly PDF_EXTENSION = '.' + environment.PDF_EXTENSION;
  protected readonly EXCEL_TYPE = environment.EXCEL_EXTENSION;
  protected readonly CSV_TYPE = environment.CSV_EXTENSION;
  protected readonly PDF_TYPE = environment.PDF_EXTENSION;
  protected readonly CSV_SEPARATOR = environment.CSV_SEPARATOR;

  private loggedUser: IJwtUser;
  private toastConfig: any = {};

  public formAction: any;

  private authService: NbAuthService;
  private toastrService: NbToastrService;
  protected translateService: TranslateService;
  protected logger: NGXLogger;
  protected dialogService: NbDialogService;
  private decimalPipe: DecimalPipe;
  private currencyPipe: CurrencyPipe;

  protected currentToken: string;

  constructor() {
    this.authService = ServiceInjector.get(NbAuthService);
    this.toastrService = ServiceInjector.get(NbToastrService);
    this.translateService = ServiceInjector.get(TranslateService);
    this.logger = ServiceInjector.get(NGXLogger);
    this.dialogService = ServiceInjector.get(NbDialogService);
    this.decimalPipe = ServiceInjector.get(DecimalPipe);
    this.currencyPipe = ServiceInjector.get(CurrencyPipe);
    this.setLoggedUser();
    this.initConfigs();
  }

  private setLoggedUser(): void {
    this.authService.onTokenChange().subscribe((token: NbAuthJWTToken) => {
      if (token.isValid()) {
        this.currentToken = token.getValue();
        this.loggedUser = token.getPayload();
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.currentToken}`);
        this.logger.setCustomHttpHeaders(headers);
      }
    });
  }

  private initConfigs(): void {
    this.toastConfig = {
      position: NbGlobalPhysicalPosition.TOP_RIGHT,
      duration: 3000,
      hasIcon: true,
      destroyByClick: true,
      preventDuplicates: false,
      status: 'success',
    };
  }

  protected refresToken(): void {
    this.logger.debug('refreshing token');
    this.authService.getToken().subscribe((token: NbAuthJWTToken) => {
      this.authService.refreshToken('email', { token: token.getValue() }).subscribe((tokenRefreshed) => {
        this.logger.debug('token refreshed : ', tokenRefreshed);
      });
    });
  }

  protected destroySubscriptors(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  get formActionValue(): any {
    return this.formAction.characterValue;
  }

  get isModalFormAction(): boolean {
    return this.formAction.characterValue === 'modal';
  }

  get isPageFormAction(): boolean {
    return this.formAction.characterValue === 'page';
  }

  get loggedInUser(): IJwtUser {
    return this.loggedUser;
  }

  get role(): string {
    //const auth = this.loggedInUser.scopes[0].authority;
    return this.loggedInUser.scopes[0];
    //return auth.substring(auth.indexOf('_') + 1);
    //return 'GENERAL';
  }

  get isSystem(): boolean {
    return this.loggedInUser && this.loggedInUser.scopes.includes(RoleEnum.ROOT);
    //return true;
  }

  get isRoot(): boolean {
    return this.loggedInUser && this.loggedInUser.scopes.includes(RoleEnum.ROOT);
    //return true;
  }

  get isAdmin(): boolean {
    return this.loggedInUser && this.loggedInUser.scopes.includes(RoleEnum.ADMINISTRADOR);
    // return this.loggedInUser && this.loggedInUser.scopes.includes(`${this.ROLE_PREFIX}${RoleEnum.ADMINISTRADOR}`);
    //return true;
  }

  get isGeneral(): boolean {
    return this.loggedInUser && this.loggedInUser.scopes.includes(RoleEnum.ESTUDIANTE);
    // return this.loggedInUser && this.loggedInUser.scopes.includes(`${this.ROLE_PREFIX}${RoleEnum.APPROVER}`);
    //return true;
  }

  // get isApprover(): boolean {
  //   // return this.loggedInUser && this.loggedInUser.scopes.includes(`${this.ROLE_PREFIX}${RoleEnum.APPROVER}`);
  //   return true;
  // }

  // get isOperator(): boolean {
  //   // return this.loggedInUser && this.loggedInUser.scopes.includes(`${this.ROLE_PREFIX}${RoleEnum.OPERATOR}`);
  //   return true;
  // }

  // get isViewer(): boolean {
  //   // return this.loggedInUser && this.loggedInUser.scopes.includes(`${this.ROLE_PREFIX}${RoleEnum.VIEWER}`);
  //   return true;
  // }

  // get isReporter(): boolean {
  //   // return this.loggedInUser && this.loggedInUser.scopes.includes(`${this.ROLE_PREFIX}${RoleEnum.REPORTER}`);
  //   return true;
  // }

  public getTranslation(key: string): string {
    return this.translateService.instant(key);
  }

  protected getNumberFormatted(amount: number): string {
    return this.decimalPipe.transform(amount, this.NUMBER_FORMAT, this.LOCALE);
  }

  protected getCurrencyFormatted(amount: number, currCode: string): string {
    return this.currencyPipe.transform(amount, currCode, 'symbol', this.NUMBER_FORMAT, this.LOCALE);
  }

  // date operations
  protected plusMonths(_date: Date, months: number): number {
    return _date.setMonth(_date.getMonth() + months);
  }

  protected minusMonths(_date: Date, months: number): number {
    return _date.setMonth(_date.getMonth() - months);
  }

  protected getDateFormatted(date: Date = new Date(), isLong = false): string {
    const datePipe = new DatePipe(this.LOCALE);
    // const datetz = this.DATE_FORMAT_SHORT + ':' + this.TZ;
    if (isLong) {
      return datePipe.transform(date, this.DATE_FORMAT_LONG);
    } else {
      return datePipe.transform(date, this.DATE_FORMAT_SHORT, this.TZ);
    }

    // date: DATE_FORMAT_SHORT:TZ
    // return datePipe.transform(date, isLong ? this.DATE_FORMAT_LONG : this.DATE_FORMAT_SHORT) | ;
  }

  // date operations

  protected showToast(status: any, title: string, body: string): void {
    this.toastConfig.status = status;
    this.toastrService.show(this.translateService.instant(body), this.translateService.instant(title), this.toastConfig);
  }

  protected showToastWithIcon(body: string, title: string, status: NbComponentStatus): void {
    this.toastConfig.status = status;
    this.toastrService.show(this.translateService.instant(body), this.translateService.instant(title), this.toastConfig);
  }
  // Toast

  // Handle error
  protected handleError<T>(operation = 'operation', result?: T): void {
    this.logger.error('Operation : ', operation);
    this.logger.error('result : ', result);
  }
  // Handle error

  openVoucher(base64: string): void {
    if (!base64) {
      this.showToastWithIcon('No se encontró el archivo.', 'Error', 'danger');
      return;
    }

    try {
      const base64Parts = base64.split(',');
      const mimeMatch = base64.match(/data:(.*);base64/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
      const data = base64Parts.length > 1 ? base64Parts[1] : base64Parts[0];

      const byteCharacters = atob(data);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);

        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: mimeType });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    } catch (error) {
      console.error('Error al abrir archivo base64', error);
      this.showToastWithIcon('Error al abrir el archivo.', 'Error', 'danger');
    }
  }
}
