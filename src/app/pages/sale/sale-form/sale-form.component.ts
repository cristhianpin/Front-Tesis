import { AfterViewInit, Component, Input, OnDestroy, OnInit, Optional } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';
import { BaseFormComponent } from '../../../@core/shared/component/base-form.component';
import { ISale } from '../../../@core/shared/model/sale.model';
import { SaleService } from '../../../@core/shared/service/sale.service';
import { EnumService } from '../../../@core/shared/service/enum.service';
import { DecimalPipe } from '@angular/common';
import { CommunicationService } from '../../../@core/shared/service/communication.service';

@Component({
  selector: 'ngx-sale-form',
  templateUrl: './sale-form.component.html',
  styleUrls: ['./sale-form.component.scss'],
})
export class SaleFormComponent extends BaseFormComponent implements OnInit, AfterViewInit, OnDestroy {
  private obj: ISale;

  @Input() saleTypes: string[];
  public selectedTabId = '';

  public toggleNgModel = true;

  constructor(
    @Optional() activeDialog: NbDialogRef<any>,
    private saleService: SaleService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private communicationService: CommunicationService,
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
    //this.listSaleTypes();
    super.setCRUDFlags(this.operation);
    this.objForm = this.createForm(true);

    if (!this.isCreate) {
      this.showSpinner = true;
      setTimeout(() => {
        const sale$ = this.saleService.findById(this.objIdModal).subscribe((res) => {
          if (res) {
            this.obj = res.data[0];
            this.objModal = this.obj;
            this.logger.debug('objModal : ', this.objModal);
            this.objForm = this.createForm(this.isCreate);
            this.showSpinner = false;
          }
        });
        this.subscriptions.push(sale$);
      });
    } else {
      const dataList$ = this.saleService.findAllAdm().subscribe((res: any) => {
        if (res) {
          this.objForm.patchValue({
            code: '' + res.data.length,
          });
        }
      });
    }
  }

  // private listSaleTypes(): void {
  //   const saleTypes$ = this.enumService.listSaleType().subscribe((res: any) => {
  //     if (res) {
  //       this.saleTypes = res;
  //       this.logger.debug('sale types : ', this.saleTypes);
  //     }
  //   });
  //   this.subscriptions.push(saleTypes$);
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
      price: new FormControl(
        {
          value: create ? null : this.objModal.price,
          disabled: this.isReadOnly(),
        },
        [Validators.required, this.decimalValidator],
      ),
      pricePublic: new FormControl(
        {
          value: create ? null : this.objModal.pricePublic,
          disabled: this.isReadOnly(),
        },
        [Validators.required, this.decimalValidator],
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
    });
  }

  public onSubmit(): void {
    this.submitted = true;
    this.logger.debug('Form status : ', this.objForm.status);
    if (this.objForm.invalid) {
      this.showFormDetailInLog(this.objForm);
      return;
    }
    this.obj = this.objForm.value;
    if (this.isCreate) {
      this.createObj();
    } else if (this.isUpdate) {
      this.updateObj();
    }
  }

  private getObjs(): void {
    this.obj = this.objForm.value;
  }

  private createObj(): void {
    this.logger.debug(`will create : `, this.obj);
    const saleCreate$ = this.saleService.create(this.obj).subscribe((res) => {
      this.logger.debug('Created : ', res.data[0]);
      this.back(res.data[0]);
    });
    this.subscriptions.push(saleCreate$);
  }

  private updateObj(): void {
    this.logger.debug(`will update : `, this.obj);
    const saleUpdate$ = this.saleService.update(this.obj).subscribe((res) => {
      this.logger.debug('Updated : ', res.data[0]);
      this.back(res.data[0]);
    });
    this.subscriptions.push(saleUpdate$);
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
