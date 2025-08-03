import { AfterViewInit, Component, Input, OnDestroy, OnInit, Optional } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';
import { BaseFormComponent } from '../../../@core/shared/component/base-form.component';
import { IPlatform } from '../../../@core/shared/model/platform.model';
import { PlatformService } from '../../../@core/shared/service/platform.service';
import { EnumService } from '../../../@core/shared/service/enum.service';
import { PlataformDurationEnum } from '../../../@core/shared/enum/platform-duration.enum';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'ngx-platform-form',
  templateUrl: './platform-form.component.html',
  styleUrls: ['./platform-form.component.scss'],
})
export class PlatformFormComponent extends BaseFormComponent implements OnInit, AfterViewInit, OnDestroy {
  private obj: IPlatform;

  @Input() platformTypes: string[];
  public selectedTabId = '';

  public platformName = '';

  public listPlatformDurationEnum: string[] = Object.values(PlataformDurationEnum);
  public toggleNgModel = true;

  constructor(
    @Optional() activeDialog: NbDialogRef<any>,
    private platformService: PlatformService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    super(activeDialog);
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
    this.objForm = this.createForm(true);

    if (!this.isCreate) {
      this.showSpinner = true;
      setTimeout(() => {
        const platform$ = this.platformService.findById(this.objIdModal).subscribe((res) => {
          if (res) {
            this.obj = res.data[0];
            this.objModal = this.obj;

            this.platformName = this.objModal.name.toUpperCase();

            this.logger.debug('objModal : ', this.objModal);
            this.objForm = this.createForm(this.isCreate);
            this.showSpinner = false;
          }
        });
        this.subscriptions.push(platform$);
      });
    } else {
      const dataList$ = this.platformService.findAllAdm().subscribe((res: any) => {
        if (res) {
          this.objForm.patchValue({
            code: '' + res.data.length,
          });
        }
      });
    }
  }

  // private listPlatformTypes(): void {
  //   const platformTypes$ = this.enumService.listPlatformType().subscribe((res: any) => {
  //     if (res) {
  //       this.platformTypes = res;
  //       this.logger.debug('platform types : ', this.platformTypes);
  //     }
  //   });
  //   this.subscriptions.push(platformTypes$);
  // }

  private createForm(create: boolean): FormGroup {
    return new FormGroup({
      id: new FormControl({
        value: create ? null : this.objModal.id,
        disabled: this.isReadOnly(),
      }),
      code: new FormControl(
        {
          value: create ? null : this.objModal.code,
          disabled: this.isReadOnly(),
        },
        Validators.required,
      ),
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
      cost: new FormControl(
        {
          value: create ? null : this.objModal.cost,
          disabled: this.isReadOnly(),
        },
        [Validators.required, this.decimalValidator],
      ),
      // price: new FormControl(
      //   {
      //     value: create ? null : this.objModal.price,
      //     disabled: this.isReadOnly(),
      //   },
      //   [Validators.required, this.decimalValidator],
      // ),
      pricePublic: new FormControl(
        {
          value: create ? null : this.objModal.pricePublic,
          disabled: this.isReadOnly(),
        },
        [Validators.required, this.decimalValidator],
      ),
      stockMin: new FormControl(
        {
          value: create ? null : this.objModal.stockMin,
          disabled: this.isReadOnly(),
        },
        [],
      ),
      duration: new FormControl(
        {
          value: create ? null : this.objModal.duration,
          disabled: this.isReadOnly(),
        },
        [Validators.required],
      ),
      image: new FormControl(
        {
          value: create ? null : this.objModal.image,
          disabled: this.isReadOnly(),
        },
        [Validators.required],
      ),
      isEnabled: new FormControl(
        {
          value: create ? false : this.objModal.isEnabled,
          disabled: this.isReadOnly(),
        },
        [Validators.required],
      ),
      expirationDays: new FormControl(
        {
          value: create ? null : this.objModal.expirationDays,
          disabled: this.isReadOnly(),
        },
        [],
      ),
    });
  }

  public onSubmit(): void {
    this.submitted = true;
    this.logger.debug('Form status : ', this.objForm.status);
    if (this.objForm.invalid) {
      this.showFormDetailInLog(this.objForm);
      return;
    }
    // this.obj = this.objForm.value;

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
      code: this.objForm.controls.code.value,
      name: this.objForm.controls.name.value,
      description: this.objForm.controls.description.value,
      cost: this.objForm.controls.cost.value,
      // price: this.objForm.controls.price.value,
      pricePublic: this.objForm.controls.pricePublic.value,
      stockMin: this.objForm.controls.stockMin.value ? this.objForm.controls.stockMin.value : -9999,
      expirationDays: this.objForm.controls.expirationDays.value ? this.objForm.controls.expirationDays.value : 3,
      duration: this.objForm.controls.duration.value,
      image: this.objForm.controls.image.value,
      isEnabled: this.objForm.controls.isEnabled.value,
    };
  }

  private getObjs(): void {
    this.obj = this.objForm.value;
  }

  private createObj(): void {
    this.logger.debug(`will create : `, this.obj);
    const platformCreate$ = this.platformService.create(this.obj).subscribe((res) => {
      this.logger.debug('Created : ', res.data[0]);
      this.back(res.data[0]);
    });
    this.subscriptions.push(platformCreate$);
  }

  private updateObj(): void {
    this.logger.debug(`will update : `, this.obj);
    const platformUpdate$ = this.platformService.update(this.obj).subscribe((res) => {
      this.logger.debug('Updated : ', res.data[0]);
      this.back(res.data[0]);
    });
    this.subscriptions.push(platformUpdate$);
  }

  public back(res): void {
    this.router.navigate([this.isCreate ? '../list' : '../../list'], {
      relativeTo: this.activatedRoute,
    });
  }

  public onInputDecimal(evt: any): void {
    this.logger.debug('onInputDecimal, evt.target.value: ', evt.target.value);
    if (!this.isDecimalKey(evt)) {
      evt.preventDefault();
      this.getObjs();
    }
    this.getObjs();
  }

  public onChangeTab(evt: any): void {
    this.logger.debug('onChangeTab : ', evt);
    this.selectedTabId = evt.tabId;
  }
}
