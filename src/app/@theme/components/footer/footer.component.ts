import { Component, OnDestroy } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { Subject } from 'rxjs';
import { MenuItem } from '../../../@core/shared/model/menu-item.model';
import { TermsDialogComponent } from '../terms-dialog/terms-dialog.component';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span>
      © 2025,
      <span style="color: Dodgerblue;">
        <i class="fas fa-code"></i>
      </span>
      with <span class="text-danger">♥</span> by
      <strong> <a href="#" target="_blank">Administrador</a></strong>
    </span>
<!--    <span-->
<!--      ><button (click)="openTerms()" nbButton ghost size="tiny" status="info">-->
<!--        {{ 'menu.configuration.terms' | translate }}-->
<!--      </button></span-->
<!--    >-->
  `,
})
export class FooterComponent implements OnDestroy {
  public languages: MenuItem[] = [];

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private dialogService: NbDialogService) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public openTerms(): void {
    this.dialogService
      .open(TermsDialogComponent, {
        autoFocus: false,
        hasScroll: true,
        hasBackdrop: true,
        closeOnEsc: false,
        closeOnBackdropClick: false,
      })
      .onClose.subscribe((sel) => {
        if (sel) {
          console;
        }
      });
  }
}
