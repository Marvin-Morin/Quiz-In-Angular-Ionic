import { TestBed } from '@angular/core/testing';

import { RandomQuestionsService } from './random-questions.service';

describe('RandomQuestionsService', () => {
  let service: RandomQuestionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RandomQuestionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
