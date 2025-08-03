import { Component, OnDestroy } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'ngx-reject-dialog',
  styleUrls: ['./reject-dialog.component.scss'],
  templateUrl: './reject-dialog.component.html',
})
export class RejectDialogComponent implements OnDestroy {
  public loading = false;
  public id: string;
  public title: string;
  public description: string;
  public loadingMsg: string;

  public commentControl = new FormControl('');

  public action: (comment: string) => Observable<unknown>;

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
    const comment = this.commentControl.value;

    setTimeout(() => {
      const delete$ = this.action(comment).subscribe((res) => {
        this.loading = false;
        this.activeDialog.close(res ? res : 'ok');
      });

      this.subscriptions.push(delete$);
    }, 1000);
  }
}
