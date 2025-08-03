import { AfterViewInit, Component, Input, OnDestroy, OnInit, Optional } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbIconLibraries } from '@nebular/theme';

import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseFormComponent } from '../../../@core/shared/component/base-form.component';
import { IMovement } from '../../../@core/shared/model/movement.model';
import { MovementService } from '../../../@core/shared/service/movement.service';
import { CommunicationService } from '../../../@core/shared/service/communication.service';
import { MovementReasonInEnum } from '../../../@core/shared/enum/movement-reason-in.enum';

@Component({
  selector: 'ngx-movement-form',
  templateUrl: './movement-form.component.html',
  styleUrls: ['./movement-form.component.scss'],
})
export class MovementFormComponent extends BaseFormComponent implements OnInit, AfterViewInit, OnDestroy {
  //
  private obj: IMovement;
  public listReasonInEnum: string[] = Object.values(MovementReasonInEnum);

  constructor(
    @Optional() activeDialog: NbDialogRef<unknown>,
    private movementService: MovementService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private iconLibraries: NbIconLibraries,
    private communicationService: CommunicationService,
  ) {
    super(activeDialog);
    this.iconLibraries.registerFontPack('font-awesome', { packClass: 'fas', iconClassPrefix: 'fa' });
  }

  ngOnInit(): void {
    this.logger.debug('ngOnInit');
    this.activatedRoute.data.subscribe((data) => {
      this.operation = data['operation'] ? data['operation'] : this.operation;
    });

    this.activatedRoute.params.subscribe((params) => {
      this.objIdModal = params['objId'] ? params['objId'] : this.objIdModal;
    });
    this.printInputVals();
    this.initValues();
  }

  ngAfterViewInit(): void {
    this.logger.debug('ngAfterViewInit');
  }

  ngOnDestroy(): void {
    this.logger.debug('ngOnDestroy');
    this.destroySubscriptors();
  }

  private printInputVals(): void {
    super.printInputValues();
  }

  private initValues(): void {
    super.setCRUDFlags(this.operation);
    this.objForm = this.createDataForm(true);

    if (!this.isCreate) {
      this.showSpinner = true;
      setTimeout(() => {
        const movement$ = this.movementService.findById(this.objIdModal).subscribe((res) => {
          if (res) {
            this.objModal = res.data[0];
            this.logger.debug('initValues, objModal : ', this.objModal);
            this.objForm = this.createDataForm(this.isCreate);
            this.showSpinner = false;
          }
        });
        this.subscriptions.push(movement$);
      });
    } else {
      const dataList$ = this.movementService.findAllByCompanyId(this.objIdModal).subscribe((res: any) => {
        if (res) {
          this.objForm.patchValue({
            code: '' + res.data.length,
          });
        }
      });
    }
  }

  private createDataForm(create: boolean): FormGroup {
    return new FormGroup({
      id: new FormControl({
        value: create ? null : this.objModal.id,
        disabled: this.isReadOnly(),
      }),
      name: new FormControl(
        {
          value: create ? null : this.objModal.name,
          disabled: this.isReadOnly(),
        },
        [Validators.required],
      ),
      description: new FormControl(
        {
          value: create ? null : this.objModal.description,
          disabled: this.isReadOnly(),
        },
        [Validators.required],
      ),
      code: new FormControl(
        {
          value: create ? null : this.objModal.code,
          disabled: this.isReadOnly(),
        },
        [],
      ),
      action: new FormControl(
        {
          value: create ? null : this.objModal.action,
          disabled: this.isReadOnly(),
        },
        [],
      ),
      type: new FormControl(
        {
          value: create ? null : this.objModal.type,
          disabled: this.isReadOnly(),
        },
        [],
      ),
      value: new FormControl(
        {
          value: create ? null : this.objModal.value,
          disabled: this.isReadOnly(),
        },
        [Validators.required, this.decimalValidator],
      ),
    });
  }

  public onSubmit(): void {
    this.submitted = true;

    // if (this.registeredBankInput.nativeElement.value) {
    //   this.objForm.get('registeredBank').setValue(this.registeredBankInput.nativeElement.value);
    // }

    this.logger.debug('Data Form status : ', this.objForm.status);
    if (this.objForm.invalid) {
      this.showFormDetailInLog(this.objForm);
      return;
    }

    this.formsToModel();

    if (this.isCreate) {
      this.createObj();
    } else if (this.isUpdate) {
      this.updateObj();
    }
  }

  private formsToModel(): void {
    this.obj = {
      id: this.objForm.controls.id.value,
      name: this.objForm.controls.name.value,
      description: this.objForm.controls.description.value,
      value: this.objForm.controls.value.value,
      type: this.objForm.controls.type.value,
      code: this.objForm.controls.code.value,
      action: this.objForm.controls.action.value,
      companyId: this.isCreate ? this.objIdModal : this.objModal.companyId,
    };
  }

  private createObj(): void {
    this.logger.debug(`will create : `, this.obj);
    this.showSpinner = true;
    this.spinnerMessage = 'spinner.saving';
    const movementCreate$ = this.movementService.createDeposit(this.obj).subscribe((res) => {
      if (res) {
        this.logger.debug('Created : ', res);
        if (this.isModal) {
          super.handleSuccessfulSaveObj(res);
          this.communicationService.createMovementComponent(res.data[0]);
        } else {
          this.router.navigate([this.isCreate ? '../list' : '../../list'], {
            relativeTo: this.activatedRoute,
          });
        }
        this.showSpinner = false;
      }
    });
    this.subscriptions.push(movementCreate$);
  }

  private updateObj(): void {
    this.logger.debug(`will update : `, this.obj);
    this.showSpinner = true;
    this.spinnerMessage = 'spinner.updating';
    const movementUpdate$ = this.movementService.update(this.obj).subscribe((res) => {
      if (res) {
        this.logger.debug('Updated : ', res[0]);
        if (this.isModal) {
          super.handleSuccessfulEditObj(res);
          this.communicationService.updateMovementComponent(res.data[0]);
        } else {
          this.router.navigate([this.isCreate ? '../list' : '../../list'], {
            relativeTo: this.activatedRoute,
          });
        }
        this.showSpinner = false;
      }
    });
    this.subscriptions.push(movementUpdate$);
  }

  get f(): any {
    return this.objForm.controls;
  }

  public onInputDecimal(evt: any): void {
    this.logger.debug('onInputDecimal, evt.target.value: ', evt.target.value);
    if (!this.isDecimalKey(evt)) {
      evt.preventDefault();
      this.getObjs();
    }
    this.getObjs();
  }

  private getObjs(): void {
    this.obj = this.objForm.value;
  }
}
