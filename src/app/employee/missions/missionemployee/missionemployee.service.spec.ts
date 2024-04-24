import { TestBed } from '@angular/core/testing';

import { MissionemployeeService } from './missionemployee.service';

describe('MissionemployeeService', () => {
  let service: MissionemployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MissionemployeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
