import { AfterViewInit, Component, Input, OnDestroy, OnInit, Optional } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';
import { BaseFormComponent } from '../../../@core/shared/component/base-form.component';
import { SettingService } from '../../../@core/shared/service/setting.service';
@Component({
  selector: 'ngx-setting-form',
  templateUrl: './setting-form.component.html',
  styleUrls: ['./setting-form.component.scss'],
})
export class SettingFormComponent extends BaseFormComponent implements OnInit, AfterViewInit, OnDestroy {
  private obj: any;
  public selectedTabId = '';
  public recordName = '';
  public imagePreview: string | ArrayBuffer | null = null;
  private selectedFile: File | null = null;
  private formData: FormData;
  constructor(
    @Optional() activeDialog: NbDialogRef<any>,
    private settingService: SettingService,
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
        const platform$ = this.settingService.find(this.objIdModal).subscribe((res) => {
          if (res) {
            this.obj = res.data;
            this.objModal = this.obj;

            this.recordName = this.objModal.key.toUpperCase();
            if (this.objModal.value) {
              this.imagePreview = this.objModal.value;
            }

            this.logger.debug('objModal : ', this.objModal);
            this.objForm = this.createForm(this.isCreate);
            this.showSpinner = false;
          }
        });
        this.subscriptions.push(platform$);
      });
    }
  }

  private createForm(create: boolean): FormGroup {
    return new FormGroup({
      id: new FormControl({
        value: create ? null : this.objModal.id,
        disabled: this.isReadOnly(),
      }),
      name: new FormControl({ value: create ? '' : this.objModal.name, disabled: this.isReadOnly() }, [Validators.required]),
      description: new FormControl({ value: create ? '' : this.objModal.description, disabled: this.isReadOnly() }),
      value: new FormControl(null),
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
    this.formData = new FormData();
    this.formData.append('id', this.objForm.controls.id.value);
    this.formData.append('name', this.objForm.controls.name.value);
    this.formData.append('description', this.objForm.controls.description.value);
    if (this.selectedFile) {
      this.formData.append('value', this.selectedFile);
    }
  }

  private createObj(): void {
    this.logger.debug(`will create : `, this.obj);
    const suscription$ = this.settingService.create(this.obj).subscribe((res) => {
      this.logger.debug('Created : ', res.data);
      this.back(res.data);
    });
    this.subscriptions.push(suscription$);
  }

  private updateObj(): void {
    this.logger.debug(`will update : `, this.obj);
    const suscription$ = this.settingService.save(this.formData).subscribe((res) => {
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  public onChangeTab(evt: any): void {
    this.logger.debug('onChangeTab : ', evt);
    this.selectedTabId = evt.tabId;
  }
}
