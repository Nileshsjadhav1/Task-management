import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);

    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully', () => {
    const mockUser = { email: 'test@test.com', password: '123456' };
    const mockResponse = [{ ...mockUser }];

    service.login('test@test.com', '123456');

    const req = httpMock.expectOne(`${service['apiUrl']}?email=test@test.com`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    expect(service.currentUserValue.email).toBe(mockUser.email);
    expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('should fail to login with invalid credentials', () => {
    const mockResponse = [];

    spyOn(window, 'alert');

    service.login('invalid@test.com', 'wrongpassword');

    const req = httpMock.expectOne(`${service['apiUrl']}?email=invalid@test.com`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    expect(window.alert).toHaveBeenCalledWith('Invalid credentials');
  });

  it('should register successfully', () => {
    const mockUser = { email: 'new@test.com', password: '123456' };

    service.register(mockUser.email, mockUser.password);

    const req = httpMock.expectOne(service['apiUrl']);
    expect(req.request.method).toBe('POST');
    req.flush(mockUser);

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should logout successfully', () => {
    service.logout();
    expect(service.currentUserValue).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should verify password correctly', () => {
    expect(service['verifyPassword']('123456', '123456')).toBeTrue();
    expect(service['verifyPassword']('123456', 'wrongpassword')).toBeFalse();
  });

  it('should generate a token', () => {
    const mockUser = { email: 'test@test.com', password: '123456' };
    const token = service['generateToken'](mockUser);
    expect(token).toBe(btoa(JSON.stringify(mockUser)));
  });

});
