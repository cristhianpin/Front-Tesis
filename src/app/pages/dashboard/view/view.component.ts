import { AfterViewInit, Component, OnDestroy, OnInit, Optional } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { BaseFormComponent } from '../../../@core/shared/component/base-form.component';
import { DashboardService } from '../../../@core/shared/service/dashboard.service';

@Component({
  selector: 'ngx-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent extends BaseFormComponent implements OnInit, AfterViewInit, OnDestroy {
  stats: any;
  pieChartData: any;
  barChartData: any;
  chartOptions: any;
  barChartOptions : any;
  latestEnrollments: any[] = [];
  public selectedPeriod = '2025'; // valor inicial

  constructor(@Optional() activeDialog: NbDialogRef<any>, private dashboardService: DashboardService) {
    super(activeDialog);
  }

  ngOnInit(): void {
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
    this.loadDashboardData(this.selectedPeriod); // << cargar con el periodo seleccionado inicialmente
  }

  public onPeriodChange(period: string): void {
    this.logger.debug('Cambió periodo a:', period);
    this.selectedPeriod = period;
    this.loadDashboardData(period); // << recargar datos
  }

  private loadDashboardData(period: string): void {
    this.showSpinner = true;

    const suscription$ = this.dashboardService.findIndex({ period }).subscribe((res) => {
      if (res?.data) {
        const data = res.data;
        const byCourse = data.charts.enrollments_by_course;
        this.stats = {
          activeCourses: data.metrics.available_courses,
          totalEnrollments: data.metrics.total_students,
          canceledEnrollments: data.metrics.canceled_enrollments,
        };

        this.barChartData = {
          labels: byCourse.map((item) => item.name),
          datasets: [
            {
              label: 'Matrículas por Curso',
              data: byCourse.map((item) => item.total),
              backgroundColor: '#42A5F5',
            },
          ],
        };



        this.pieChartData = {
          labels: data.charts.enrollments_by_status.map((item) => {
            switch (item.status) {
              case 'COMPLETADA':
                return 'Matrícula Completada';
              case 'CANCELADA':
                return 'Matrícula Cancelada';
              case 'PENDIENTE':
                return 'Matrícula Pendiente';
              default:
                return item.status;
            }
          }),
          datasets: [
            {
              data: data.charts.enrollments_by_status.map((item) => item.count),
              backgroundColor: ['#36A2EB', '#4CAF50', '#FFCE56'],
            },
          ],
        };

        this.chartOptions = {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' },
          },
        };

        this.barChartOptions = {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
            title: {
              display: true,
              text: 'Matrículas por Curso',
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        };

        this.latestEnrollments = data.lists.latest_enrollments;
      }

      this.showSpinner = false;
    });

    this.subscriptions.push(suscription$);
  }
}
