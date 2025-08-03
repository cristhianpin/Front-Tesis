import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { BaseListComponent } from '../../../@core/shared/component/base-list.component';
import { CommunicationService } from '../../../@core/shared/service/communication.service';
import { DeleteDialogComponent } from '../../../@theme/components';
import { Table } from 'primeng/table';
import { EnrollmentService } from '../../../@core/shared/service/enrollment.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'ngx-enrollment-list',
  templateUrl: './enrollment-list.component.html',
  styleUrls: ['./enrollment-list.component.scss'],
})
export class EnrollmentListComponent extends BaseListComponent implements OnInit, OnDestroy {
  public showAlert = true;
  public cId: string;
  public dateFromFilter: string;
  public dateToFilter: string;
  public originalObjs: any[] = []; // Para mantener los datos originales

  enrollmentStatuses = [
    { label: 'ACTIVA', value: 'ACTI' },
    { label: 'CANCELADA', value: 'CANC' },
    { label: 'COMPLETADA', value: 'COMP' },
    { label: 'PENDIENTE', value: 'PEND' },
    { label: 'EXPIRADA', value: 'EXPI' },
    { label: 'RECHAZADA', value: 'REJE' },
  ];

  @ViewChild('dt') table: Table;

  constructor(private enrollmentService: EnrollmentService, private communicationService: CommunicationService) {
    super('enrollment');
  }

  ngOnInit(): void {
    this.logger.debug('ngOnInit');
    this.initValues();
    this.initTable();
    //this.refreshTable();
  }

  ngOnDestroy(): void {
    this.logger.debug('ngOnDestroy');
    this.destroySubscriptors();
  }

  protected initAll(): void {
    this.logger.debug('initAll');

    this.initValues();
    this.initTable();
  }

  private initValues(): void {
    this.multiSelectRecordDisabled = false;
    this.cId = localStorage.getItem('cId');
    super.setSelectedObj(null);
    super.initBaseValues();
    this.initSubscriptors();
  }

  private initSubscriptors(): void {
    const tablePreference$ = this.communicationService.tablePreferenceComponent.subscribe((res) => {
      if (res) {
        this.tablePreference = res;
        this.logger.debug('tablePreference$: ', this.tablePreference);
        this.destroySubscriptors();
        this.initAll();
      }
    });
    this.subscriptions.push(tablePreference$);
  }

  private initTable(): void {
    this.find();
    this.cols = [
      {
        field: 'order_id',
        header: 'Referencia',
        width: '10%',
        type: 'number',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'course',
        header: 'Curso',
        width: '10%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'user_detail',
        header: 'Estudiante',
        width: '10%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'status',
        header: 'Estado',
        width: '10%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'receipt_path',
        header: 'Comprobante',
        width: '10%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'contract_path',
        header: 'Contrato',
        width: '10%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'start_course',
        header: 'Inicio de curso',
        width: '10%',
        type: 'date',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'end_course',
        header: 'Fin de curso',
        width: '10%',
        type: 'date',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'identification_path',
        header: 'Cédula',
        width: '10%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'photo_path',
        header: 'Foto',
        width: '10%',
        type: 'text',
        exportable: true,
        filtrable: true,
        translate: false,
      },
      {
        field: 'created_at',
        header: 'Fecha Creación',
        width: '25%',
        type: 'date',
        exportable: false,
        filtrable: true,
        sortable: true,
        translate: false,
      },
    ];
    super.initTableProperties();
  }

  public find(): void {
    this.findAll();
  }

  private findAll(): void {
    this.logger.debug('find all');
    this.objs = [];
    this.showSpinner = true;
    const dataList$ = this.enrollmentService.index().subscribe((res: any) => {
      if (res) {
        console.log('res.data', res.data);
        this.objs = res.data;
        this.logger.debug('objs sales: ', this.objs);
        this.objs = res.data.map((item: any) => ({
          id: item.id,
          order_id: item.order_id,
          course_id: item.course?.id,
          user_detail: item.user_detail?.first_name + ' ' + item.user_detail?.last_name,
          course: item.course?.name,
          description: item.course?.description,
          modality: item.course?.modality,
          tags: item.course?.tags,
          status: item.status,
          enrolled_at: item.enrolled_at,
          start_course: item.course?.start_date,
          end_course: item.course?.end_date,
          identification_path: item.identification_path_base64,
          photo_path: item.photo_path_base64,
          receipt_path: item.receipt_path_base64,
          created_at: item.enrolled_at,
          contract_path: item.contract_path_base64,
        }));
        console.log(' this.objs', this.objs);

        // Guardar datos originales para filtrado
        this.originalObjs = [...this.objs];

        // Aplicar filtros de fecha si existen
        this.applyDateFilter();

        this.totalRecords = res.data.length;
        this.logger.debug('sale: ', this.objs);
        this.logger.debug('total of records : ', this.totalRecords);
        this.handleActionButtons();
        this.showSpinner = false;
      }
    });
    this.subscriptions.push(dataList$);
  }

  public delete(): void {
    console.log(this.selectedObj);
    const modal = this.dialogService.open(DeleteDialogComponent, {
      context: {
        id: this.selectedObj,
        title: 'Eliminar registro',
        description: 'Se eliminará el registro',
        loadingMsg: '... eliminando el registro',
        action: this.enrollmentService.delete(this.selectedObj),
      },
      autoFocus: false,
      hasScroll: true,
      hasBackdrop: true,
      closeOnEsc: false,
      closeOnBackdropClick: false,
    });
    modal.onClose.subscribe((res) => {
      if (res) {
        super.handleCRUDResponse(res, 'D');
        this.find();
      }
    });
  }

  public onValueChange(event: boolean, id: string): void {
    this.logger.debug('onValueChange event');
  }

  public onCloseAlert(): void {
    this.showAlert = false;
  }

  public generatePDFReport(): void {
    this.logger.debug('Generando reporte PDF de matrículas');

    // Obtener los datos filtrados/visibles de la tabla
    const filteredData = this.getFilteredTableData();

    if (filteredData.length === 0) {
      // Mostrar alerta cuando no hay datos
      this.showNoDataAlert();
      this.logger.warn('No hay datos para generar el reporte');
      return;
    }

    // Crear instancia de jsPDF
    const doc = new jsPDF('landscape', 'mm', 'a4');    // Configurar fuentes y título
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Reporte de Matrículas', 20, 20);

    // Información adicional
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const currentDate = new Date().toLocaleDateString('es-ES');
    doc.text(`Fecha de generación: ${currentDate}`, 20, 30);
    doc.text(`Total de registros: ${filteredData.length}`, 20, 38);

    // Agregar información de filtros aplicados
    const filterInfo = this.getAppliedFiltersInfo();
    if (filterInfo) {
      doc.text(`Filtros aplicados: ${filterInfo}`, 20, 46);
    }

    // Definir columnas para la tabla
    const columns = [
      { header: 'Referencia', dataKey: 'order_id' },
      { header: 'Estudiante', dataKey: 'user_detail' },
      { header: 'Curso', dataKey: 'course' },
      { header: 'Estado', dataKey: 'status' },
      { header: 'Inicio Curso', dataKey: 'start_course' },
      { header: 'Fin Curso', dataKey: 'end_course' },
      { header: 'Fecha Matrícula', dataKey: 'created_at' }
    ];

    // Preparar datos para la tabla
    const tableData = filteredData.map(item => ({
      order_id: item.order_id || 'N/A',
      user_detail: item.user_detail || 'N/A',
      course: item.course || 'N/A',
      status: this.translateStatus(item.status),
      start_course: item.start_course ? new Date(item.start_course).toLocaleDateString('es-ES') : 'N/A',
      end_course: item.end_course ? new Date(item.end_course).toLocaleDateString('es-ES') : 'N/A',
      created_at: item.created_at ? new Date(item.created_at).toLocaleDateString('es-ES') : 'N/A'
    }));

    // Generar tabla con autoTable
    const startY = filterInfo ? 58 : 50;
    (doc as any).autoTable({
      head: [columns.map(col => col.header)],
      body: tableData.map(row => columns.map(col => row[col.dataKey])),
      startY: startY,
      theme: 'striped',
      headStyles: {
        fillColor: [41, 128, 185], // Color azul para el header
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245] // Color gris claro para filas alternas
      },
      styles: {
        fontSize: 8,
        cellPadding: 3
      },
      columnStyles: {
        0: { cellWidth: 25 }, // Referencia
        1: { cellWidth: 50 }, // Estudiante
        2: { cellWidth: 60 }, // Curso
        3: { cellWidth: 25 }, // Estado
        4: { cellWidth: 30 }, // Inicio Curso
        5: { cellWidth: 30 }, // Fin Curso
        6: { cellWidth: 30 }  // Fecha Matrícula
      },
      margin: { top: 50, left: 20, right: 20 }
    });

    // Agregar pie de página
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Página ${i} de ${pageCount}`,
        doc.internal.pageSize.width - 40,
        doc.internal.pageSize.height - 10
      );
    }

    // Guardar el PDF con nombre que incluye fecha/hora y filtros
    const timestamp = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toTimeString().split(' ')[0].replace(/:/g, '');
    const fileName = `reporte_matriculas_${timestamp}_${timeStr}.pdf`;
    doc.save(fileName);

    this.logger.debug('Reporte PDF generado exitosamente con datos filtrados');
  }

  private getFilteredTableData(): any[] {
    // Si la tabla tiene filtros aplicados, usar los datos filtrados
    if (this.table && this.table.filteredValue) {
      return this.table.filteredValue;
    }
    // Si no hay filtros, usar todos los datos
    return this.objs || [];
  }

  private getAppliedFiltersInfo(): string {
    let filterInfo = '';

    // Verificar filtros de fecha
    if (this.dateFromFilter || this.dateToFilter) {
      const dateFilters = [];
      if (this.dateFromFilter) {
        // Crear fecha correcta sin desfase de zona horaria
        const fromDate = new Date(this.dateFromFilter + 'T00:00:00');
        dateFilters.push(`Desde: ${fromDate.toLocaleDateString('es-ES')}`);
      }
      if (this.dateToFilter) {
        // Crear fecha correcta sin desfase de zona horaria
        const toDate = new Date(this.dateToFilter + 'T00:00:00');
        dateFilters.push(`Hasta: ${toDate.toLocaleDateString('es-ES')}`);
      }
      filterInfo += `Filtro de fechas - ${dateFilters.join(', ')}`;
    }

    // Verificar filtro global
    if (this.filterFieldGlobal && this.filterFieldGlobal.trim() !== '') {
      if (filterInfo) filterInfo += '; ';
      filterInfo += `Búsqueda global: "${this.filterFieldGlobal}"`;
    }

    // Verificar si hay filtros aplicados en la tabla
    if (this.table && this.table.filteredValue && this.table.filteredValue.length !== this.objs.length) {
      if (filterInfo) filterInfo += '; ';
      filterInfo += `Filtros adicionales aplicados`;
    }

    return filterInfo || null;
  }

  private translateStatus(status: string): string {
    const statusMap = {
      'ACTI': 'ACTIVA',
      'CANC': 'CANCELADA',
      'COMP': 'COMPLETADA',
      'PEND': 'PENDIENTE',
      'EXPI': 'EXPIRADA',
      'REJE': 'RECHAZADA'
    };
    return statusMap[status] || status;
  }

  public applyDateFilter(): void {
    if (!this.originalObjs || this.originalObjs.length === 0) {
      return;
    }

    let filteredData = [...this.originalObjs];

    // Aplicar filtro de fecha desde
    if (this.dateFromFilter) {
      const fromDate = new Date(this.dateFromFilter + 'T00:00:00'); // Agregar hora para evitar desfase de zona horaria

      filteredData = filteredData.filter(item => {
        if (!item.created_at) return false;
        const itemDate = new Date(item.created_at);
        // Comparar solo las fechas sin considerar la hora
        const itemDateOnly = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
        const fromDateOnly = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
        return itemDateOnly >= fromDateOnly;
      });
    }

    // Aplicar filtro de fecha hasta
    if (this.dateToFilter) {
      const toDate = new Date(this.dateToFilter + 'T23:59:59'); // Agregar hora para incluir todo el día

      filteredData = filteredData.filter(item => {
        if (!item.created_at) return false;
        const itemDate = new Date(item.created_at);
        // Comparar solo las fechas sin considerar la hora
        const itemDateOnly = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
        const toDateOnly = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());
        return itemDateOnly <= toDateOnly;
      });
    }

    this.objs = filteredData;
    this.totalRecords = filteredData.length;

    // Actualizar la tabla PrimeNG para reflejar los cambios
    if (this.table) {
      this.table.value = this.objs;
      this.table._value = this.objs;
    }

    this.logger.debug('Filtros de fecha aplicados. Registros filtrados: ', this.totalRecords);
  }

  public clearDateFilters(): void {
    this.dateFromFilter = null;
    this.dateToFilter = null;
    this.objs = [...this.originalObjs];
    this.totalRecords = this.originalObjs.length;

    // Limpiar también filtros de la tabla
    if (this.table) {
      this.table.clear();
    }

    this.logger.debug('Filtros de fecha limpiados');
  }

  private showNoDataAlert(): void {
    // Usar el método showToastWithIcon del componente base
    super.showToastWithIcon(
      'Por favor, ajuste los filtros o verifique que existan datos en el rango seleccionado.',
      'No hay registros para mostrar',
      'warning'
    );
  }
}
