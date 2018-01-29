import { TestBed, inject } from '@angular/core/testing';

import { KeyboardserviceService } from './keyboardservice.service';

describe('KeyboardserviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KeyboardserviceService]
    });
  });

  it('should be created', inject([KeyboardserviceService], (service: KeyboardserviceService) => {
    expect(service).toBeTruthy();
  }));
});
