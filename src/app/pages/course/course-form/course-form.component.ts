import { AfterViewInit, Component, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';
import { BaseFormComponent } from '../../../@core/shared/component/base-form.component';
import { CourseService } from '../../../@core/shared/service/course.service';

@Component({
  selector: 'ngx-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss'],
})
export class CourseFormComponent extends BaseFormComponent implements OnInit, AfterViewInit, OnDestroy {
  private obj: any;
  public selectedTabId = '';
  public modelName = '';
  public roles: any[] = [];
  public btnSaveActivated = true;
  public tags: string[] = [];
  public minXDate = '';
  public maxXDate = '';
  modalities = [
    { label: 'Presencial', value: 'Presencial' },
    { label: 'Remoto', value: 'Remoto' },
    { label: 'Semipresencial', value: 'Semipresencial' },
  ];
  public tagOptions = [
    { key: 'tag_modelaje', label: 'Modelaje' },
    { key: 'tag_pasarela', label: 'Pasarela' },
    { key: 'tag_fotografia', label: 'Fotografía' },
    { key: 'tag_etiqueta', label: 'Etiqueta' },
    { key: 'tag_comercial', label: 'Comercial' },
    { key: 'tag_curvy', label: 'Curvy / Plus Size' },
    { key: 'tag_videoclips', label: 'Videoclips y Medios' },
    { key: 'tag_infantil', label: 'Infantil' },
    { key: 'tag_alta_costura', label: 'Alta Costura' },
    { key: 'tag_digital', label: 'Contenido Digital' },
  ];
  constructor(
    @Optional() activeDialog: NbDialogRef<any>,
    private courseService: CourseService,
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

    this.subscribeToPeriodChanges();

    if (!this.isCreate) {
      this.showSpinner = true;
      setTimeout(() => {
        const suscription$ = this.courseService.find(this.objIdModal).subscribe((res) => {
          if (res) {
            this.obj = res.data;
            this.objModal = this.obj;
            this.modelName = `${this.objModal.name}`;
            this.logger.debug('objModal : ', this.objModal);
            this.objForm = this.createForm(this.isCreate);
            this.subscribeToPeriodChanges();
            this.showSpinner = false;
          }
        });
        this.subscriptions.push(suscription$);
      });
    }
  }

  private subscribeToPeriodChanges(): void {
    this.objForm.get('period')?.valueChanges.subscribe((period: number) => {
      if (period) {
        this.minXDate = `${period}-01-01`;
        this.maxXDate = `${period}-12-31`;

        // Validación opcional para forzar que las fechas existentes estén dentro del nuevo rango
        const start = this.objForm.get('start_date')?.value;
        const end = this.objForm.get('end_date')?.value;

        if (start && (start < this.minXDate || start > this.maxXDate)) {
          this.objForm.get('start_date')?.setValue(this.minXDate);
        }

        if (end && (end < this.minXDate || end > this.maxXDate)) {
          this.objForm.get('end_date')?.setValue(this.maxXDate);
        }
      }
    });
  }

  private createForm(create: boolean): FormGroup {
    const startDate = this.objModal?.start_date ? this.objModal.start_date.substring(0, 10) : null;
    const endDate = this.objModal?.end_date ? this.objModal.end_date.substring(0, 10) : null;
    const formGroupConfig: any = {
      id: new FormControl({
        value: create ? null : this.objModal.id,
        disabled: this.isReadOnly(),
      }),

      name: new FormControl(
        {
          value: create ? null : this.objModal.name,
          disabled: this.isReadOnly(),
        },
        [Validators.required, Validators.maxLength(149)],
      ),

      description: new FormControl(
        {
          value: create ? null : this.objModal.description,
          disabled: this.isReadOnly(),
        },
        [Validators.required, Validators.maxLength(255)],
      ),
      period: new FormControl(
        {
          value: create ? null : this.objModal.period,
          disabled: this.isReadOnly(),
        },
        [Validators.required],
      ),

      total_seats: new FormControl(
        {
          value: create ? null : this.objModal.total_seats,
          disabled: this.isReadOnly(),
        },
        [Validators.required, Validators.min(1)],
      ),

      start_date: new FormControl(
        {
          value: create ? null : startDate,
          disabled: this.isReadOnly(),
        },
        Validators.required,
      ),

      end_date: new FormControl(
        {
          value: create ? null : endDate,
          disabled: this.isReadOnly(),
        },
        Validators.required,
      ),

      modality: new FormControl(
        {
          value: create ? null : this.objModal.modality,
          disabled: this.isReadOnly(),
        },
        [Validators.required],
      ),
    };

    // Inicializa cada tag como FormControl con valor booleano
    this.tagOptions.forEach((tag) => {
      const isSelected = this.objModal?.tags?.includes(tag.label) ?? false;
      formGroupConfig[tag.key] = new FormControl({ value: isSelected, disabled: this.isReadOnly() });
    });

    return new FormGroup(formGroupConfig);
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
    const selectedTags = this.tagOptions.filter((tag) => this.objForm.get(tag.key)?.value).map((tag) => tag.label);
    this.obj = {
      id: this.objForm.controls.id.value,
      name: this.objForm.controls.name.value,
      description: this.objForm.controls.description.value,
      total_seats: this.objForm.controls.total_seats.value,
      start_date: this.objForm.controls.start_date.value,
      end_date: this.objForm.controls.end_date.value,
      modality: this.objForm.controls.modality.value,
      period: this.objForm.controls.period.value,
      tags: selectedTags.join(','),
    };
  }

  private createObj(): void {
    this.logger.debug(`will create : `, this.obj);
    const suscription$ = this.courseService.create(this.obj).subscribe((res) => {
      this.logger.debug('Created : ', res.data);
      this.toUpdate(res.data);
    });
    this.subscriptions.push(suscription$);
  }

  private updateObj(): void {
    this.logger.debug(`will update : `, this.obj);
    const suscription$ = this.courseService.update(this.obj).subscribe((res) => {
      this.logger.debug('Updated : ', res.data);
      this.back();
    });
    this.subscriptions.push(suscription$);
  }

  public toUpdate(res: any): void {
    this.router.navigateByUrl(`/pages/courses/edit/${res.id}`);
  }

  public back(): void {
    this.router.navigate([this.isCreate ? '../list' : '../../list'], {
      relativeTo: this.activatedRoute,
    });
  }

  public onChangeTab(evt: any): void {
    this.logger.debug('onChangeTab : ', evt.tabId);
    this.selectedTabId = evt.tabId;

    switch (this.selectedTabId) {
      case 'briefcase':
        this.btnSaveActivated = true;
        break;
      case 'studyPlan':
        this.btnSaveActivated = false;
        break;
    }
  }
}
