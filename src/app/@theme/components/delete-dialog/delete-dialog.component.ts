import { Component, OnDestroy } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'ngx-delete-dialog',
  styleUrls: ['./delete-dialog.component.scss'],
  templateUrl: './delete-dialog.component.html',
})
export class DeleteDialogComponent implements OnDestroy {
  public loading = false;
  public id: string;
  public title: string;
  public description: string;
  public loadingMsg: string;

  public action: Observable<unknown>;

  private subscriptions: Subscription[] = [];

  constructor(public activeDialog: NbDialogRef<unknown>) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  public onNoClick(): void {
    this.activeDialog.close();
  }

  public onYesClick(): void {
    this.loading = true;
    setTimeout(() => {
      const delete$ = this.action.subscribe((res) => {
        this.loading = false;
        this.activeDialog.close(res ? res : 'ok');
      });
      this.subscriptions.push(delete$);
    }, 1000);
  }
}
