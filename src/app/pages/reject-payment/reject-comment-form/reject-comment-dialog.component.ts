import { Component, OnDestroy } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-reject-comment-dialog',
  styleUrls: ['./reject-comment-dialog.component.scss'],
  templateUrl: './reject-comment-dialog.component.html',
})
export class RejectCommentDialogComponent implements OnDestroy {
  public loading = false;
  public comments: any[] = [];
  public title: string;
  private subscriptions: Subscription[] = [];
  constructor(public activeDialog: NbDialogRef<unknown>) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  public onNoClick(): void {
    this.activeDialog.close();
  }
}
