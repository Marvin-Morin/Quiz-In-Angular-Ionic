import { TestBed } from '@angular/core/testing';

import { ParmeterQuizService } from './parmeter-quiz.service';

describe('ParmeterQuizService', () => {
  let service: ParmeterQuizService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParmeterQuizService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
