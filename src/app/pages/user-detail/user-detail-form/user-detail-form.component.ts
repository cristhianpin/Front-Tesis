import { AfterViewInit, Component, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';
import { BaseFormComponent } from '../../../@core/shared/component/base-form.component';
import { IUserDetail } from '../../../@core/shared/model/user-detail.model';
import { UserDetailService } from '../../../@core/shared/service/user-detail.service';
import { RoleService } from '../../../@core/shared/service/role.service';
import { getRoleLabel } from '../../../@core/shared/enum/role.enum';

@Component({
  selector: 'ngx-user-detail-form',
  templateUrl: './user-detail-form.component.html',
  styleUrls: ['./user-detail-form.component.scss'],
})
export class UserDetailFormComponent extends BaseFormComponent implements OnInit, AfterViewInit, OnDestroy {
  private obj: IUserDetail;
  public selectedTabId = '';
  public modelName = '';
  public roles: any[] = [];
  constructor(
    @Optional() activeDialog: NbDialogRef<any>,
    private userDetailService: UserDetailService,
    private roleService: RoleService,
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
    this.getRole();
    super.setCRUDFlags(this.operation);
    this.objForm = this.createForm(true);

    if (!this.isCreate) {
      this.showSpinner = true;
      setTimeout(() => {
        const suscription$ = this.userDetailService.find(this.objIdModal).subscribe((res) => {
          if (res) {
            this.obj = res.data;
            this.objModal = this.obj;
            this.modelName = `${this.objModal.first_name} ${this.objModal.last_name}`;
            this.logger.debug('objModal : ', this.objModal);
            this.objForm = this.createForm(this.isCreate);
            this.showSpinner = false;
          }
        });
        this.subscriptions.push(suscription$);
      });
    }
  }

  private getRole(): void {
    const suscription$ = this.roleService.index().subscribe((res: any) => {
      if (res) {
        this.roles = res.data;
      }
    });
    this.subscriptions.push(suscription$);
  }

  private createForm(create: boolean): FormGroup {
    const birthDate = this.objModal?.birth_date ? this.objModal.birth_date.substring(0, 10) : null;

    return new FormGroup({
      id: new FormControl({
        value: create ? null : this.objModal.id,
        disabled: this.isReadOnly(),
      }),
      firstName: new FormControl(
        {
          value: create ? null : this.objModal.first_name,
          disabled: this.isReadOnly(),
        },
        Validators.required,
      ),
      lastName: new FormControl(
        {
          value: create ? null : this.objModal.last_name,
          disabled: this.isReadOnly(),
        },
        [Validators.required],
      ),
      roleName: new FormControl(
        {
          value: create ? null : this.objModal.user?.role,
          disabled: this.isReadOnly(),
        },
        [Validators.required],
      ),
      email: new FormControl(
        {
          value: create ? '' : this.objModal.user?.email,
          disabled: !this.isCreate,
        },
        [Validators.required, Validators.email],
      ),
      idNumber: new FormControl(
        {
          value: create ? '' : this.objModal.id_number,
          disabled: this.isReadOnly(),
        },
        [Validators.required, Validators.pattern(/^[0-9]{10}$/)],
      ),
      phone: new FormControl(
        {
          value: create ? '' : this.objModal.phone,
          disabled: this.isReadOnly(),
        },
        [Validators.required, Validators.pattern(/^[0-9]{9,10}$/)],
      ),
      address: new FormControl(
        {
          value: create ? '' : this.objModal.address,
          disabled: this.isReadOnly(),
        },
        [Validators.required],
      ),
      birthDate: new FormControl(
        {
          value: create ? '' : birthDate,
          disabled: this.isReadOnly(),
        },
        Validators.required,
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
      firstName: this.objForm.controls.firstName.value,
      lastName: this.objForm.controls.lastName.value,
      roleName: this.objForm.controls.roleName.value,
      email: this.objForm.controls.email.value,
      idNumber: this.objForm.controls.idNumber.value,
      phone: this.objForm.controls.phone.value,
      birthDate: this.objForm.controls.birthDate.value,
      address: this.objForm.controls.address.value,
      isEnabled: this.objModal?.user?.is_enabled ?? false,
    };
  }

  private createObj(): void {
    this.logger.debug(`will create : `, this.obj);
    const suscription$ = this.userDetailService.create(this.obj).subscribe((res) => {
      this.logger.debug('Created : ', res.data);
      this.back(res.data);
    });
    this.subscriptions.push(suscription$);
  }

  private updateObj(): void {
    this.logger.debug(`will update : `, this.obj);
    const suscription$ = this.userDetailService.update(this.obj).subscribe((res) => {
      this.logger.debug('Updated : ', res.data);
      this.back(res.data);
    });
    this.subscriptions.push(suscription$);
  }

  public back(res): void {
    this.router.navigate([this.isCreate ? '../list' : '../../list'], {
      relativeTo: this.activatedRoute,
    });
  }

  public onChangeTab(evt: any): void {
    this.logger.debug('onChangeTab : ', evt);
    this.selectedTabId = evt.tabId;
  }

  protected readonly getRoleLabel = getRoleLabel;
}
