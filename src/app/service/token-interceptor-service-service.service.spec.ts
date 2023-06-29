import { TestBed } from '@angular/core/testing';

import { TokenInterceptorServiceServiceService } from './token-interceptor-service-service.service';

describe('TokenInterceptorServiceServiceService', () => {
  let service: TokenInterceptorServiceServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenInterceptorServiceServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
