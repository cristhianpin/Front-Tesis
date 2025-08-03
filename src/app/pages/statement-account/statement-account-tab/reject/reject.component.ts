import { Component, Input, Optional } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';
import { BaseFormComponent } from '../../../../@core/shared/component/base-form.component';
import { RejectCommentDialogComponent } from '../../../reject-payment/reject-comment-form/reject-comment-dialog.component';

@Component({
  selector: 'ngx-reject-statement',
  templateUrl: './reject.component.html',
  styleUrls: ['./reject.component.scss'],
})
export class RejectComponent extends BaseFormComponent {
  @Input() rejectPayments: any[] = [];
  constructor(@Optional() activeDialog: NbDialogRef<never>, private router: Router, private activatedRoute: ActivatedRoute) {
    super(activeDialog);
  }

  public rejectComment(comments: []): void {
    const modal = this.dialogService.open(RejectCommentDialogComponent, {
      context: {
        comments: comments,
        title: 'Motivos de Rechazo',
      },
      autoFocus: false,
      hasScroll: true,
      hasBackdrop: true,
      closeOnEsc: false,
      closeOnBackdropClick: false,
    });
    modal.onClose.subscribe((res) => {
      if (!res) {
        return;
      }
    });
  }
}
