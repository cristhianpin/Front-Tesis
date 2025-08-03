import { NbComponentStatus } from '@nebular/theme';

export class MessageResponse {
  severity: NbComponentStatus;
  title: string;
  body: string;
  code: any;
  statusCode: number;

  toString(): string {
    return JSON.stringify(this);
  }
}
