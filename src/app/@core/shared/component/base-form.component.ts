import { Injectable, Input } from '@angular/core';
import { AbstractControl, FormGroup, Validators } from '@angular/forms';
import { NbComponentStatus, NbDialogRef } from '@nebular/theme';
import { BaseComponent } from './base.component';

@Injectable()
export class BaseFormComponent extends BaseComponent {
  protected objId: string;

  public objForm: FormGroup;
  protected objModal: any;
  public objLoaded = false;
  public createdTrn = false;

  @Input() operation?: string;
  @Input() objIdModal?: string;
  @Input() modalStyle?: string;
  @Input() modalSeverity?: string;

  public isCreate = false;
  public isRead = false;
  public isUpdate = false;
  public isDelete = false;
  public isAttach = false;
  public isSale = false;
  public isClone = false;

  public isModal = false;
  public hasPrevious = false;
  public hasNext = false;
  public submitted = false;

  // public isRoleRoot = this.isRoot;
  // public isRoleAdmin = this.isAdmin;

  public minDate: Date;
  public maxDate: Date;

  protected textValidators = [Validators.maxLength(100), Validators.minLength(5)];

  protected emailValidators = [Validators.maxLength(250), Validators.minLength(5), Validators.pattern(/.+@.+\..+/)];

  constructor(private activeDialog: NbDialogRef<any> = null) {
    super();
  }

  get f(): any {
    return this.objForm.controls;
  }

  public required(fieldName: string, fg?: FormGroup): boolean {
    if (!fg) {
      fg = this.objForm;
    }
    if (fg.get(fieldName).validator) {
      const validator = fg.get(fieldName).validator({} as AbstractControl);
      if (validator && validator.required) {
        return true;
      }
    }
    return false;
  }

  public isRequired(control: AbstractControl): boolean {
    if (control.validator) {
      const validator = control.validator({} as AbstractControl);
      if (validator && validator.required) {
        return true;
      }
    }
    return false;
  }

  public onResetForm(): void {
    this.objForm.reset();
  }

  protected showFormDetailInLog(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control.invalid) {
        this.logger.error('Field error : ', field, control.errors);
      }
    });
  }

  protected setCRUDFlags(operation: string): void {
    switch (operation) {
      case 'C':
        this.isCreate = true;
        this.isRead = false;
        this.isUpdate = false;
        this.isDelete = false;
        this.isAttach = false;
        break;
      case 'R':
        this.isCreate = false;
        this.isRead = true;
        this.isUpdate = false;
        this.isDelete = false;
        this.isAttach = false;
        break;
      case 'U':
        this.isCreate = false;
        this.isRead = false;
        this.isUpdate = true;
        this.isDelete = false;
        this.isAttach = false;
        break;
      case 'S': // sale
        this.isCreate = false;
        this.isRead = false;
        this.isUpdate = false;
        this.isDelete = false;
        this.isAttach = false;
        this.isSale = true;
        break;
      case 'D':
        this.isCreate = false;
        this.isRead = false;
        this.isUpdate = false;
        this.isDelete = true;
        this.isAttach = false;
        break;
      case 'A':
        this.isCreate = false;
        this.isRead = false;
        this.isUpdate = false;
        this.isDelete = false;
        this.isAttach = true;
        break;
      case 'CL':
        this.isCreate = false;
        this.isRead = false;
        this.isUpdate = true;
        this.isDelete = false;
        this.isAttach = false;
        this.isClone = true;
        break;
      default:
        break;
    }
  }

  protected printInputValues(): void {
    this.logger.debug('input operation : ', this.operation);
    this.logger.debug('input objIdModal : ', this.objIdModal);
    this.logger.debug('input modalStyle : ', this.modalStyle);
    this.logger.debug('input modalSeverity : ', this.modalSeverity);
  }

  protected printCRUDFlags(): void {
    this.logger.debug('isCreate : ', this.isCreate);
    this.logger.debug('isRead : ', this.isRead);
    this.logger.debug('isUpdate : ', this.isUpdate);
    this.logger.debug('isDelete : ', this.isDelete);
    this.logger.debug('isAttach : ', this.isAttach);
  }

  public close(): void {
    this.activeDialog.close();
  }

  public closeWithResp(res: any): void {
    this.activeDialog.close(res);
  }

  protected handleSuccessfulSaveObj(response: any): void {
    this.activeDialog.close(response);
  }

  protected handleSuccessfulEditObj(response: any): void {
    this.activeDialog.close(response);
  }

  protected handleSuccessfulDeleteObj(response: any): void {
    this.activeDialog.close(response);
  }

  public isReadOnly(): boolean {
    return !this.isCreate && !this.isUpdate;
  }

  // date operations
  public setStartDate(event): void {
    this.objForm.patchValue({
      startDate: null,
    });
    const _startDate = new Date(event);
    this.objForm.patchValue({
      startDate: _startDate,
    });
    this.minDate = _startDate;
  }

  public setEndDate(event): void {
    this.objForm.patchValue({
      endDate: null,
    });
    const _endDate = new Date(event);
    this.objForm.patchValue({
      endDate: _endDate,
    });
    this.maxDate = _endDate;
  }

  public addMonthsStartDate(event, months: number): void {
    this.objForm.patchValue({
      startDate: null,
    });
    const _evnDate = new Date(event);
    let _startDate = new Date(_evnDate.getFullYear(), _evnDate.getMonth(), _evnDate.getDate());
    _startDate = new Date(super.plusMonths(_startDate, months));
    this.objForm.patchValue({
      startDate: _startDate,
    });
    this.minDate = _startDate;
  }

  public addMonthsEndDate(event, months: number): void {
    this.objForm.patchValue({
      endDate: null,
    });
    const _evnDate = new Date(event);
    let _endDate = new Date(_evnDate.getFullYear(), _evnDate.getMonth(), _evnDate.getDate());
    _endDate = new Date(super.plusMonths(_endDate, months));
    this.objForm.patchValue({
      endDate: _endDate,
    });
    this.maxDate = _endDate;
  }
  // date operations

  public enableNext(): void {
    this.hasNext = true;
  }

  public enablePrevious(): void {
    this.hasPrevious = true;
  }

  public disableNext(): void {
    this.hasNext = false;
  }

  public disablePrevious(): void {
    this.hasPrevious = false;
  }

  public getObjId(): string {
    return this.objId;
  }

  protected showCRUDToast(response: any, operation: string, modelName: string, status: NbComponentStatus): void {
    let msgTitle = '';
    let msgBody = '';
    switch (operation) {
      case 'C':
        msgTitle = 'message.title.create-success';
        msgBody = `Se ha creado ${modelName}`;
        break;
      case 'U':
        msgTitle = 'message.title.update-success';
        msgBody = `Se ha actualizado ${modelName}`;
        break;
      case 'D':
        msgTitle = 'message.title.delete-success';
        msgBody = `Se ha eliminado ${modelName}`;
        break;
      default:
        break;
    }
    super.showToastWithIcon(msgBody, msgTitle, status);
  }

  public decimalValidator(control) {
    const value = control.value;
    if (value === null || value === undefined || value === '') {
      return null; // Si el valor es nulo o vacío, se considera válido
    }

    if (!/^-?\d*\.?\d+$/.test(value)) {
      return { invalidDecimal: true }; // El valor no es un número decimal válido
    }

    return null; // El valor es un número decimal válido
  }

  public isDecimalKey(evt): boolean {
    const charCode = evt.which ? evt.which : evt.keyCode;
    this.logger.debug('charCode: ', charCode);
    //if (charCode !== 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
    if (
      (charCode >= 48 && charCode <= 57) || // Números
      charCode === 46 || // Punto decimal
      charCode === 190 || // Punto decimal
      charCode === 8 // Tecla de retroceso (backspace)
    ) {
      this.logger.debug('charCode: true, decimal');
      return true;
    }
    this.logger.debug('charCode: false,  not decimal');
    return false;
  }
}
