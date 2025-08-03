import { TestBed } from '@angular/core/testing';

import { AttachedFileService } from './attached-file.service';

describe('AttachedFileService', () => {
  let service: AttachedFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttachedFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
