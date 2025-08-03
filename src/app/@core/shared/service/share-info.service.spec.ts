import { TestBed } from '@angular/core/testing';

import { ShareInfoService } from './share-info.service';

describe('ShareInfoService', () => {
  let service: ShareInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShareInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
