import { IAttachmentType } from './attachment-type.model';

export interface IAttachedFile {
  id: string;
  name: string;
  type: string;
  ext: string;
  content?: any;
  enabled: boolean;
  seq: number;
  uploadDate: Date;
  trnType: string;
  trnId: number;
  attachmentType?: IAttachmentType;
}
