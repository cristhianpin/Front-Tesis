import { TestBed } from '@angular/core/testing';

import { TablePreferenceService } from './table-preference.service';

describe('TablePreferenceService', () => {
  let service: TablePreferenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TablePreferenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
