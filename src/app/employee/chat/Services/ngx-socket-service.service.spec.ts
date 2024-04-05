import { TestBed } from '@angular/core/testing';

import { NgxSocketServiceService } from './ngx-socket-service.service';

describe('NgxSocketServiceService', () => {
  let service: NgxSocketServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxSocketServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
