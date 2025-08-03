import { TestBed } from '@angular/core/testing';

import { RegisteredBankService } from './registered-bank.service';

describe('RegisteredBankService', () => {
  let service: RegisteredBankService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisteredBankService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
