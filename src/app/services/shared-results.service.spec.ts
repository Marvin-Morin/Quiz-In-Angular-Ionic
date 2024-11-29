import { TestBed } from '@angular/core/testing';

import { SharedResultsService } from './shared-results.service';

describe('SharedResultsService', () => {
  let service: SharedResultsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedResultsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
