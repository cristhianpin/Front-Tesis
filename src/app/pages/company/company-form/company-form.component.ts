import { AfterViewInit, Component, OnDestroy, OnInit, Optional } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';
import { BaseFormComponent } from '../../../@core/shared/component/base-form.component';
import { ICompany } from '../../../@core/shared/model/company.model';
import { CompanyService } from '../../../@core/shared/service/company.service';
import { CommunicationService } from '../../../@core/shared/service/communication.service';
import { v4 as uuidv4 } from 'uuid';
import { PlanSlugEnum } from '../../../@core/shared/enum/plan-slug.enum';

@Component({
  selector: 'ngx-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.scss'],
})
export class CompanyFormComponent extends BaseFormComponent implements OnInit, AfterViewInit, OnDestroy {
  private obj: ICompany;

  private selectedTabId = '';
  public btnSaveActivated: Boolean = true;
  public toggleNgModel = true;
  public toggleNgModelApiKey = false;

  public companyNick = '';

  public showAlert = true;

  public listPlanSlugEnum: string[] = Object.values(PlanSlugEnum);

  constructor(
    @Optional() activeDialog: NbDialogRef<any>,
    private companyService: CompanyService,
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
    super.setCRUDFlags(this.operation);
    this.objForm = this.createForm(true);
    if (!this.isCreate) {
      this.showSpinner = true;
      setTimeout(() => {
        const company$ = this.companyService.findById(this.objIdModal).subscribe((res) => {
          if (res) {
            this.objModal = res.data[0];
            this.companyNick = this.objModal.nick.toUpperCase();

            this.logger.debug('objModal : ', this.objModal);
            this.objForm = this.createForm(this.isCreate);
            this.showSpinner = false;

            this.initSubscriptors();
          }
        });
        this.subscriptions.push(company$);
      });
    }
  }

  private initSubscriptors(): void {
    const createRecord$ = this.communicationService.movementComponent.subscribe((res) => {
      if (res) {
        this.destroySubscriptors();
        this.initValues();
      }
    });
    this.subscriptions.push(createRecord$);
  }

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
      apiKey: new FormControl(
        {
          value: create ? null : this.objModal.apiKey,
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
      balance: new FormControl(
        {
          value: create ? null : this.objModal.balance,
          disabled: this.isReadOnly(),
        },
        [Validators.required],
      ),
      phone: new FormControl(
        {
          value: create ? null : this.objModal.phone,
          disabled: this.isReadOnly(),
        },
        [Validators.required],
      ),
      planSlug: new FormControl(
        {
          value: create ? null : this.objModal.planSlug,
          disabled: this.isReadOnly(),
        },
        [Validators.required],
      ),
      nick: new FormControl(
        {
          value: create ? null : this.objModal.nick,
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
      isHaveApiKey: new FormControl(
        {
          value: create ? false : this.objModal.isHaveApiKey,
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

  private createObj(): void {
    this.logger.debug(`will create : `, this.obj);
    const companyCreate$ = this.companyService.create(this.obj).subscribe((res) => {
      this.logger.debug('Created : ', res);
      this.back(res);
    });
    this.subscriptions.push(companyCreate$);
  }

  private updateObj(): void {
    this.logger.debug(`will update : `, this.obj);
    const companyUpdate$ = this.companyService.update(this.obj).subscribe((res) => {
      this.logger.debug('Updated : ', res.data[0]);
      this.back(res.data[0]);
    });
    this.subscriptions.push(companyUpdate$);
  }

  public back(res): void {
    this.router.navigate([this.isCreate ? '../list' : '../../list'], {
      relativeTo: this.activatedRoute,
    });
  }

  public onChangeTab(evt: any): void {
    this.logger.debug('onChangeTab : ', evt.tabId);
    this.selectedTabId = evt.tabId;

    switch (this.selectedTabId) {
      case 'home':
        this.btnSaveActivated = true;
        break;
      case 'user':
        this.btnSaveActivated = false;
        break;
      case 'pos':
        this.btnSaveActivated = false;
        break;
      case 'platform':
        this.btnSaveActivated = false;
        break;
      case 'bookmark':
        this.btnSaveActivated = false;
        break;
    }
  }

  public generateNewApiKey(): void {
    const nuevoUUID = uuidv4();
    this.logger.debug('New ApiKey: ', nuevoUUID);
    this.objForm.patchValue({
      apiKey: nuevoUUID,
    });
  }

  public onCloseAlert(): void {
    this.logger.debug('onCloseAlert');
    this.showAlert = false;
  }
}
