import { AfterViewInit, Component, Input, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';
import { BaseFormComponent } from '../../../@core/shared/component/base-form.component';
import { CourseService } from '../../../@core/shared/service/course.service';

@Component({
  selector: 'ngx-plan-form',
  templateUrl: './plan-form.component.html',
  styleUrls: ['./plan-form.component.scss'],
})
export class PlanFormComponent extends BaseFormComponent implements OnInit, AfterViewInit, OnDestroy {
  private obj: any;
  @Input() courseId!: string;
  studyPlans: any[] = [];
  selectedPlanId: string | null = null;

  constructor(
    @Optional() activeDialog: NbDialogRef<any>,
    private courseService: CourseService,
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

    this.showSpinner = true;
    this.plans();
  }

  private createForm(create: boolean): FormGroup {
    return new FormGroup({
      id: new FormControl(create ? null : this.objModal?.id),
      title: new FormControl(create ? '' : this.objModal?.title, [Validators.required, Validators.maxLength(149)]),
      description: new FormControl(create ? '' : this.objModal?.description, [Validators.required, Validators.maxLength(255)]),
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

    if (this.selectedPlanId) {
      this.updateObj();
    } else {
      this.createObj();
    }
  }

  private formsToModel(): void {
    this.obj = {
      id: this.objForm.controls.id.value,
      title: this.objForm.controls.title.value,
      description: this.objForm.controls.description.value,
      course_id: this.courseId,
    };
  }

  private createObj(): void {
    this.logger.debug('Creating:', this.obj);
    const suscription$ = this.courseService.createPlan(this.obj).subscribe((res) => {
      this.logger.debug('Created:', res.data);
      super.showToast('success', 'message.title.success', 'message.body.create-success');
      this.cancelEdit();
      this.plans();
    });
    this.subscriptions.push(suscription$);
  }

  private updateObj(): void {
    this.logger.debug('Updating:', this.obj);
    const suscription$ = this.courseService.updatePlan(this.obj).subscribe((res) => {
      this.logger.debug('Updated:', res.data);
      super.showToast('success', 'message.title.success', 'message.body.update-success');
      this.cancelEdit();
      this.plans();
    });
    this.subscriptions.push(suscription$);
  }

  public editPlan(plan: any): void {
    this.selectedPlanId = plan.id;
    this.objModal = plan;
    this.objForm.patchValue({
      id: plan.id,
      title: plan.title,
      description: plan.description,
    });
  }

  public cancelEdit(): void {
    this.selectedPlanId = null;
    this.objModal = {};
    this.objForm.reset();
    this.submitted = false;
  }

  get f() {
    return this.objForm.controls;
  }

  private plans(): void {
    setTimeout(() => {
      const suscription$ = this.courseService.planIndex(this.objIdModal).subscribe((res) => {
        if (res) {
          this.studyPlans = res.data;
          this.objForm = this.createForm(this.isCreate);
          this.showSpinner = false;
        }
      });
      this.subscriptions.push(suscription$);
    });
  }

  public deletePlan(id: string): void {
    const suscription$ = this.courseService.deletePlan(id).subscribe(() => {
      this.logger.debug(`Módulo eliminado: ${id}`);
      super.showToast('success', 'message.title.success', 'message.body.update-success');
      if (this.selectedPlanId === id) {
        this.cancelEdit();
      }

      this.plans();
    });
    this.subscriptions.push(suscription$);
  }
}
