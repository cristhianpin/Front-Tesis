import { MessageResponse } from './message-response.model';

export class RestResponse {
  object?: any;
  message: MessageResponse;

  toString(): string {
    return JSON.stringify(this);
  }
}
