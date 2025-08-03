import { AfterViewInit, Component, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';
import { BaseFormComponent } from '../../../@core/shared/component/base-form.component';
import { CourseService } from '../../../@core/shared/service/course.service';
import { UserDetailService } from '../../../@core/shared/service/user-detail.service';
import { EnrollmentService } from '../../../@core/shared/service/enrollment.service';

@Component({
  selector: 'ngx-enrollment-form',
  templateUrl: './enrollment-form.component.html',
  styleUrls: ['./enrollment-form.component.scss'],
})
export class EnrollmentFormComponent extends BaseFormComponent implements OnInit, AfterViewInit, OnDestroy {
  private obj: any;
  public selectedTabId = '';
  public modelName = '';
  public students: any[] = [];
  public isStatusDisabled = false;
  public courses: any[] = [];
  enrollmentStatuses = [
    { label: 'CANCELADA', value: 'CANCELADA' },
    { label: 'PENDIENTE', value: 'PENDIENTE' },
  ];
  constructor(
    @Optional() activeDialog: NbDialogRef<any>,
    private enrollmentService: EnrollmentService,
    private courseService: CourseService,
    private userDetailService: UserDetailService,
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
    this.getCourses();
    this.getStudents();
    super.setCRUDFlags(this.operation);
    this.objForm = this.createForm(true);

    if (!this.isCreate) {
      this.showSpinner = true;
      setTimeout(() => {
        const suscription$ = this.enrollmentService.find(this.objIdModal).subscribe((res) => {
          if (res) {
            this.obj = res.data;
            this.objModal = this.obj;
            this.modelName = `Matrícula - ${this.objModal.id}`;
            this.logger.debug('objModal : ', this.objModal);
            this.objForm = this.createForm(this.isCreate);
            this.showSpinner = false;
          }
        });
        this.subscriptions.push(suscription$);
      });
    }

  }

  private createForm(create: boolean): FormGroup {
    const enrolledAt = this.objModal?.enrolled_at ? this.objModal.enrolled_at.substring(0, 10) : null;
    if (!create && this.objModal?.status !== 'PENDIENTE') {
      this.isStatusDisabled = true;
    }
    return new FormGroup({
      id: new FormControl({
        value: create ? null : this.objModal.id,
        disabled: this.isReadOnly(),
      }),
      course_id: new FormControl(
        {
          value: create ? null : this.objModal.course_id,
          disabled: this.isReadOnly(),
        },
        [Validators.required],
      ),
      user_detail_id: new FormControl(
        {
          value: create ? null : this.objModal.user_detail_id,
          disabled: this.isReadOnly(),
        },
        [Validators.required],
      ),
      status: new FormControl(
        {
          value: create ? null : this.objModal.status,
          disabled: this.isReadOnly(),
        },
        [Validators.required],
      ),
      enrolled_at: new FormControl(
        {
          value: create ? null : enrolledAt,
          disabled: true,
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
      course_id: this.objForm.controls.course_id.value,
      user_detail_id: this.objForm.controls.user_detail_id.value,
      status: this.objForm.controls.status.value
    };
  }

  private createObj(): void {
    this.logger.debug(`will create : `, this.obj);
    const suscription$ = this.enrollmentService.create(this.obj).subscribe((res) => {
      this.logger.debug('Created : ', res.data);
      this.back(res.data);
    });
    this.subscriptions.push(suscription$);
  }

  private updateObj(): void {
    this.logger.debug(`will update : `, this.obj);
    const suscription$ = this.enrollmentService.update(this.obj).subscribe((res) => {
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

  private getCourses(): void {
    const suscription$ = this.courseService.index().subscribe((res: any) => {
      if (res) {
        this.courses = res.data;
      }
    });
    this.subscriptions.push(suscription$);
  }

  private getStudents(): void {
    const suscription$ = this.userDetailService.getStudents().subscribe((res: any) => {
      if (res) {
        this.students = res.data;
      }
    });
    this.subscriptions.push(suscription$);
  }
}
