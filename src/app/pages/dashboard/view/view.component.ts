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
  barChartOptions: any;
  coursesPieChartData: any; // Nuevo pie chart para cursos
  coursesPieChartOptions: any; // Opciones para el pie chart de cursos
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
    // Forzar redimensionamiento de gráficos después de la vista
    setTimeout(() => {
      this.forceChartResize();
    }, 500);

    // Agregar listener para resize de ventana
    window.addEventListener('resize', () => {
      setTimeout(() => {
        this.forceChartResize();
      }, 100);
    });
  }

  private forceChartResize(): void {
    // Forzar el ancho del canvas a ocupar todo el contenedor
    const canvasElements = document.querySelectorAll('.chart-container-pie-fullwidth canvas');
    canvasElements.forEach((canvas: HTMLCanvasElement) => {
      const container = canvas.closest('.chart-container-pie-fullwidth') as HTMLElement;
      if (container) {
        const containerWidth = container.clientWidth - 50; // Restar padding

        // Aplicar estilos directamente al canvas
        canvas.style.setProperty('width', `${containerWidth}px`, 'important');
        canvas.style.setProperty('max-width', 'none', 'important');
        canvas.setAttribute('width', containerWidth.toString());

        // También ajustar el div padre si existe
        const parentDiv = canvas.parentElement;
        if (parentDiv) {
          parentDiv.style.setProperty('width', `${containerWidth}px`, 'important');
        }

        // Buscar y ajustar el componente p-chart
        const pChart = container.querySelector('p-chart > div');
        if (pChart) {
          (pChart as HTMLElement).style.setProperty('width', `${containerWidth}px`, 'important');
        }
      }
    });
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

        // Debug: verificar estructura de datos del backend
        console.log('Dashboard data from backend:', data);

        const byCourse = data.charts?.enrollments_by_course || [];

        // Debug: verificar datos de cursos
        console.log('Enrollments by course:', byCourse);

        this.stats = {
          activeCourses: data.metrics?.available_courses || 0,
          totalEnrollments: data.metrics?.total_students || 0,
          canceledEnrollments: data.metrics?.canceled_enrollments || 0,
          pendingEnrollments: data.charts?.enrollments_by_status?.find(item => item.status === 'PENDIENTE')?.count || 0,
          completedEnrollments: data.charts?.enrollments_by_status?.find(item => item.status === 'COMPLETADA')?.count || 0,
        };

        // Validar y configurar datos del gráfico de barras (TODAS las personas matriculadas por curso)
        if (byCourse && byCourse.length > 0) {
          console.log('Processing bar chart data for ALL enrollments by course');
          console.log('Raw course data:', byCourse);

          const labels = [];
          const data = [];

          byCourse.forEach((item) => {
            const courseName = item.name || item.course_name || item.course || 'Curso sin nombre';

            // CONTAR TODAS las personas matriculadas (todos los estados)
            let totalEnrolledCount = 0;

            // Si hay enrollments individuales, contar todos
            if (item.enrollments && Array.isArray(item.enrollments)) {
              totalEnrolledCount = item.enrollments.length;
              console.log(`Curso: ${courseName}, Total enrollments individuales: ${totalEnrolledCount}`);
            } else {
              // Buscar campo específico para total de matriculados
              if (item.total_enrolled !== undefined) {
                totalEnrolledCount = parseInt(item.total_enrolled) || 0;
              } else if (item.total_students !== undefined) {
                totalEnrolledCount = parseInt(item.total_students) || 0;
              } else if (item.enrolled_count !== undefined) {
                totalEnrolledCount = parseInt(item.enrolled_count) || 0;
              } else if (item.total_enrollments !== undefined) {
                totalEnrolledCount = parseInt(item.total_enrollments) || 0;
              } else if (item.students_count !== undefined) {
                totalEnrolledCount = parseInt(item.students_count) || 0;
              } else if (item.matriculados !== undefined) {
                totalEnrolledCount = parseInt(item.matriculados) || 0;
              } else if (item.total !== undefined) {
                // Usar total como el número de matriculados
                totalEnrolledCount = parseInt(item.total) || 0;
                console.log(`✅ Curso: ${courseName} - Usando total: ${totalEnrolledCount}`);
              } else if (item.count !== undefined) {
                totalEnrolledCount = parseInt(item.count) || 0;
                console.log(`✅ Curso: ${courseName} - Usando count: ${totalEnrolledCount}`);
              } else {
                totalEnrolledCount = 0;
                console.warn(`Curso: ${courseName} - No se encontraron datos válidos`);
              }
            }

            // Agregar curso si tiene datos válidos (incluso si es 0 para mostrar cursos sin matriculados)
            console.log(`📊 Curso: ${courseName}, Total Matriculados: ${totalEnrolledCount}`);
            labels.push(courseName);
            data.push(totalEnrolledCount);
          });

          console.log('Final pie chart labels:', labels);
          console.log('Final pie chart data:', data);

          // Solo crear pie chart si hay datos válidos
          if (labels.length > 0 && data.some(value => value > 0)) {
            // Crear pie chart para distribución de personas por curso
            this.coursesPieChartData = {
              labels: labels,
              datasets: [
                {
                  data: data,
                  backgroundColor: [
                    '#007BFF', // Azul principal
                    '#28A745', // Verde
                    '#FFC107', // Amarillo
                    '#DC3545', // Rojo
                    '#6F42C1', // Púrpura
                    '#FD7E14', // Naranja
                    '#20C997', // Turquesa
                    '#E83E8C', // Rosa
                    '#17A2B8', // Info
                    '#6C757D'  // Gris
                  ],
                  borderColor: [
                    '#0056B3', // Azul oscuro
                    '#1E7E34', // Verde oscuro
                    '#E0A800', // Amarillo oscuro
                    '#A71E2B', // Rojo oscuro
                    '#4C2A85', // Púrpura oscuro
                    '#C55A11', // Naranja oscuro
                    '#17A085', // Turquesa oscuro
                    '#B02A5C', // Rosa oscuro
                    '#117A8B', // Info oscuro
                    '#545B62'  // Gris oscuro
                  ],
                  borderWidth: 2
                },
              ],
            };

            console.log('Pie chart data configured for course distribution:', this.coursesPieChartData);
          } else {
            // No hay datos válidos, establecer null para mostrar mensaje
            console.log('No valid course data found');
            this.coursesPieChartData = null;
          }
        } else {
          // No hay datos del backend, establecer null
          console.log('No course data from backend');
          this.coursesPieChartData = null;
        }



        // Configurar gráfico circular de estados
        const statusData = data.charts?.enrollments_by_status || [];

        if (statusData && statusData.length > 0) {
          const labels = [];
          const dataValues = [];
          const backgroundColors = [];
          const borderColors = [];

          statusData.forEach((item) => {
            switch (item.status) {
              case 'COMPLETADA':
                labels.push('Matrícula Completada');
                dataValues.push(parseInt(item.count) || 0);
                backgroundColors.push('#28A745'); // Verde para completadas
                borderColors.push('#1E7E34');
                break;
              case 'PENDIENTE':
                labels.push('Matrícula Pendiente');
                dataValues.push(parseInt(item.count) || 0);
                backgroundColors.push('#FFC107'); // Amarillo para pendientes
                borderColors.push('#E0A800');
                break;
              case 'CANCELADA':
                labels.push('Matrícula Cancelada');
                dataValues.push(parseInt(item.count) || 0);
                backgroundColors.push('#DC3545'); // Rojo para canceladas
                borderColors.push('#A71E2B');
                break;
              default:
                labels.push(item.status);
                dataValues.push(parseInt(item.count) || 0);
                backgroundColors.push('#6C757D'); // Gris para otros estados
                borderColors.push('#495057');
                break;
            }
          });

          // Solo crear gráfico si hay datos válidos
          if (dataValues.some(value => value > 0)) {
            this.pieChartData = {
              labels: labels,
              datasets: [
                {
                  data: dataValues,
                  backgroundColor: backgroundColors,
                  borderColor: borderColors,
                  borderWidth: 2
                },
              ],
            };
          } else {
            this.pieChartData = null;
          }
        } else {
          // No hay datos del backend, establecer null
          this.pieChartData = null;
          console.log('No status data from backend');
        }

        // Configurar opciones de gráficos
        this.setupChartOptions();

        this.latestEnrollments = data.lists.latest_enrollments;

        // Debug: verificar datos
        console.log('Latest enrollments from backend:', this.latestEnrollments);

        // Si no hay datos, establecer array vacío
        if (!this.latestEnrollments || this.latestEnrollments.length === 0) {
          this.latestEnrollments = [];
          console.log('No latest enrollments data from backend');
        }
      } else {
        // Si no hay datos del backend, inicializar con valores vacíos
        console.log('No data from backend, initializing empty dashboard');
        this.stats = {
          activeCourses: 0,
          totalEnrollments: 0,
          canceledEnrollments: 0,
          pendingEnrollments: 0,
          completedEnrollments: 0,
        };

        this.pieChartData = null;
        this.coursesPieChartData = null;
        this.latestEnrollments = [];

        // Configurar opciones de gráficos
        this.setupChartOptions();
      }

      this.showSpinner = false;

      // Forzar redimensionamiento después de cargar datos
      setTimeout(() => {
        this.forceChartResize();
      }, 100);
    }, (error) => {
      // Manejo de errores - no usar datos de ejemplo
      console.error('Error loading dashboard data:', error);

      this.stats = {
        activeCourses: 0,
        totalEnrollments: 0,
        canceledEnrollments: 0,
        pendingEnrollments: 0,
        completedEnrollments: 0,
      };

      this.pieChartData = null;
      this.coursesPieChartData = null;
      this.latestEnrollments = [];

      // Configurar opciones de gráficos
      this.setupChartOptions();

      this.showSpinner = false;
    });

    this.subscriptions.push(suscription$);
  }

  public getStatusBadgeType(status: string): string {
    switch (status) {
      case 'COMPLETADA':
        return 'success';
      case 'CANCELADA':
        return 'danger';
      case 'PENDIENTE':
        return 'warning';
      default:
        return 'basic';
    }
  }

  public getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'COMPLETADA':
        return 'badge-success';
      case 'CANCELADA':
        return 'badge-danger';
      case 'PENDIENTE':
        return 'badge-warning';
      default:
        return 'badge-basic';
    }
  }

  public getStatusDisplayText(status: string): string {
    switch (status) {
      case 'COMPLETADA':
        return '✅ COMPLETADA';
      case 'CANCELADA':
        return '❌ CANCELADA';
      case 'PENDIENTE':
        return '⏳ PENDIENTE';
      default:
        return status;
    }
  }

  private setupChartOptions(): void {
    // Configuración mejorada para gráfico de pastel de ancho completo
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 20,
          bottom: 30,
          left: 20,
          right: 20
        }
      },
      plugins: {
        legend: {
          position: 'right', // Cambiar a la derecha para aprovechar el ancho
          align: 'center',
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 14,
              weight: 'bold'
            },
            boxWidth: 20,
            boxHeight: 20,
            generateLabels: function (chart) {
              const data = chart.data;
              if (data.labels.length && data.datasets.length) {
                return data.labels.map((label, i) => {
                  const dataset = data.datasets[0];
                  const value = dataset.data[i];
                  const total = dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = ((value / total) * 100).toFixed(1);
                  return {
                    text: `${label}: ${value} (${percentage}%)`,
                    fillStyle: dataset.backgroundColor[i],
                    strokeStyle: dataset.borderColor[i],
                    lineWidth: dataset.borderWidth,
                    pointStyle: 'circle',
                    hidden: false,
                    index: i
                  };
                });
              }
              return [];
            }
          }
        },
        tooltip: {
          titleFont: {
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            size: 13
          },
          callbacks: {
            label: function (context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((context.parsed / total) * 100).toFixed(1);
              return `${context.label}: ${context.parsed} matrículas (${percentage}%)`;
            }
          }
        }
      },
      elements: {
        arc: {
          borderWidth: 3,
          borderColor: '#ffffff'
        }
      }
    };

    // Configuración mejorada para gráfico de barras de ancho completo
    this.barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index'
      },
      layout: {
        padding: {
          top: 30,
          bottom: 60, // Aumentar padding inferior para las etiquetas rotadas
          left: 30,
          right: 30
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 14,
              weight: 'bold'
            },
            boxWidth: 20,
            boxHeight: 20
          }
        },
        title: {
          display: true,
          text: 'Personas Matriculadas por Curso',
          font: {
            size: 16,
            weight: 'bold'
          },
          padding: {
            top: 10,
            bottom: 20
          }
        },
        tooltip: {
          titleFont: {
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            size: 13
          },
          callbacks: {
            label: function (context) {
              return `${context.dataset.label}: ${context.parsed.y} personas matriculadas`;
            }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: {
            display: false
          },
          ticks: {
            maxRotation: 45,
            minRotation: 30,
            font: {
              size: 12,
              weight: 'bold'
            },
            padding: 10,
            maxTicksLimit: false, // Permitir todas las etiquetas
            autoSkip: false, // No omitir etiquetas automáticamente
            callback: function (value, index, values) {
              // Asegurar que se muestren todas las etiquetas
              const label = this.getLabelForValue(value);
              return label;
            }
          },
          title: {
            display: true,
            text: 'Cursos Disponibles',
            font: {
              size: 14,
              weight: 'bold'
            },
            padding: {
              top: 15,
              bottom: 5
            }
          }
        },
        y: {
          beginAtZero: false,
          min: 0.5, // Rango mínimo de 0.5 como solicitado
          grid: {
            color: 'rgba(0,0,0,0.1)',
            drawBorder: true,
            drawOnChartArea: true,
            drawTicks: true
          },
          suggestedMax: 50, // Aumentar para acomodar más matriculados
          ticks: {
            stepSize: 1, // Cambiar a incrementos de 1 persona
            precision: 0, // Sin decimales para personas
            includeZero: true,
            font: {
              size: 12,
              weight: 'bold'
            },
            callback: function (value) {
              return value + ' personas';
            },
            padding: 15
          },
          title: {
            display: true,
            text: 'Número de Personas Matriculadas',
            font: {
              size: 14,
              weight: 'bold'
            },
            padding: {
              bottom: 10
            }
          }
        },
      },
      animation: {
        duration: 1500,
        easing: 'easeInOutQuart'
      }
    };

    // Configuración para el pie chart de distribución de cursos
    this.coursesPieChartOptions = {
      responsive: true,
      maintainAspectRatio: false, // Permitir que el gráfico se ajuste al contenedor
      resizeDelay: 0, // Sin delay en el resize
      layout: {
        padding: {
          top: 20,
          bottom: 30,
          left: 20,
          right: 20
        }
      },
      onResize: (chart, size) => {
        // Forzar el ancho del canvas cuando se redimensiona
        const canvas = chart.canvas;
        if (canvas && canvas.parentElement) {
          const container = canvas.closest('.chart-container-pie-fullwidth');
          if (container) {
            const containerWidth = container.clientWidth - 50; // Restar padding
            chart.resize(containerWidth, size.height);
          }
        }
      },
      plugins: {
        legend: {
          position: 'right',
          align: 'center',
          labels: {
            usePointStyle: true,
            padding: 15,
            font: {
              size: 12,
              weight: 'bold'
            },
            boxWidth: 12,
            boxHeight: 12,
            generateLabels: function (chart) {
              const data = chart.data;
              if (data.labels.length && data.datasets.length) {
                return data.labels.map((label, i) => {
                  const dataset = data.datasets[0];
                  const value = dataset.data[i];
                  const total = dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = ((value / total) * 100).toFixed(1);
                  return {
                    text: `${label}: ${value} (${percentage}%)`,
                    fillStyle: dataset.backgroundColor[i],
                    strokeStyle: dataset.borderColor[i],
                    lineWidth: dataset.borderWidth,
                    pointStyle: 'circle',
                    hidden: false,
                    index: i
                  };
                });
              }
              return [];
            }
          }
        },
        title: {
          display: true,
          text: 'Distribución de Estudiantes por Curso',
          font: {
            size: 16,
            weight: 'bold'
          },
          padding: {
            top: 10,
            bottom: 20
          }
        },
        tooltip: {
          titleFont: {
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            size: 13
          },
          callbacks: {
            label: function (context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((context.parsed / total) * 100).toFixed(1);
              return `${context.label}: ${context.parsed} estudiantes (${percentage}%)`;
            }
          }
        }
      },
      elements: {
        arc: {
          borderWidth: 3,
          borderColor: '#ffffff'
        }
      }
    };
  }
}
