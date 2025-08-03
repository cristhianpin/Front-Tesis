import { AfterViewInit, Component, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';
import { BaseFormComponent } from '../../../@core/shared/component/base-form.component';
import { CourseService } from '../../../@core/shared/service/course.service';

@Component({
  selector: 'ngx-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss'],
})
export class RegistrationFormComponent extends BaseFormComponent implements OnInit, AfterViewInit, OnDestroy {
  public selectedTabId = '';
  public modelName = '';
  public btnSaveActivated = true;
  public recommended_courses: any[] = [];
  public allCourses: any[] = [];

  public interestOptions = [
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
      this.operation = data['operation'] ?? this.operation;
    });

    this.activatedRoute.params.subscribe((params) => {
      this.objIdModal = params['objId'] ?? this.objIdModal;
    });

    this.initValues();
  }

  ngAfterViewInit(): void {
    this.logger.debug('ngAfterViewInit');
  }

  ngOnDestroy(): void {
    this.logger.debug('ngOnDestroy');
    this.destroySubscriptors();
  }

  private initValues(): void {
    super.setCRUDFlags(this.operation);
    this.objForm = this.createForm(true);
    this.loadAllCourses();
  }

  onFileChange(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    // Definir tipos permitidos según el campo
    const allowedTypes = {
      identification_path: ['application/pdf'],
      photo_path: ['image/jpeg', 'image/png'],
    };

    const isValidType = allowedTypes[controlName]?.includes(file.type);

    if (!isValidType) {
      const msg =
        controlName === 'identification_path'
          ? 'La copia de cédula debe ser un archivo PDF.'
          : 'La fotografía debe ser una imagen JPEG o PNG.';

      alert(msg);
      input.value = '';
      this.objForm.patchValue({ [controlName]: null });
      return;
    }

    this.objForm.patchValue({ [controlName]: file });
  }

  private createForm(create: boolean): FormGroup {
    const formGroup: any = {
      course_id: new FormControl('', [Validators.required]),
      id_number: new FormControl('', [Validators.required]),
      birth_date: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      identification_path: new FormControl(null, [Validators.required]),
      photo_path: new FormControl(null, [Validators.required]),
    };

    this.interestOptions.forEach((option) => {
      formGroup[option.key] = new FormControl(false);
    });

    return new FormGroup(formGroup);
  }

  public get f() {
    return this.objForm.controls;
  }

  public onSubmit(): void {
    this.submitted = true;
    this.logger.debug('Form status : ', this.objForm.status);
    if (this.objForm.invalid) {
      this.showFormDetailInLog(this.objForm);
      return;
    }
    const formData = new FormData();
    Object.entries(this.objForm.value).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (typeof value === 'boolean') {
        formData.append(key, value ? '1' : '0');
      } else {
        formData.append(key, String(value ?? ''));
      }
    });
    this.logger.debug('Inscripción enviada: ', formData);
    const subscription$ = this.courseService.saveRegistration(formData).subscribe((res) => {
      this.logger.debug('Registrado: ', res);
      super.showToast('success', 'Matrícula exitosa', 'El curso fue asignado correctamente.');
      this.back();
    });
    this.subscriptions.push(subscription$);
  }

  public refreshRecommendations(): void {
    const selectedInterests = this.interestOptions.filter((opt) => this.f[opt.key].value).map((opt) => opt.label);

    const studentData = {
      interests: selectedInterests,
    };
    const sub$ = this.courseService.recommendedCourses(studentData).subscribe((res) => {
      this.recommended_courses = res.data;
    });
    this.subscriptions.push(sub$);
  }

  public loadAllCourses(): void {
    const sub$ = this.courseService.getAllActiveCourses().subscribe((res) => {
      this.allCourses = res.data;
    });
    this.subscriptions.push(sub$);
  }

  public back(): void {
    this.router.navigate(['/pages/registration/list'], {
      relativeTo: this.activatedRoute,
    });
  }
}
