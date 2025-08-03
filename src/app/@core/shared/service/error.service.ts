import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  public getClientErrorMessage(error: Error): string {
    return navigator.onLine ? error.message : 'error.no-internet-connection';
  }

  public getConnectionErrorMessage(error: Error): string {
    return navigator.onLine ? '' : 'error.no-internet-connection';
  }

  public getClientStack(error: Error): string {
    return error.stack;
  }

  public getServerErrorMessage(error: HttpErrorResponse): string {
    const _error = error.error;
    return _error.key || _error.message || _error.toString();
  }

  public getServerStack(error: HttpErrorResponse): string {
    return 'stack';
  }
}
