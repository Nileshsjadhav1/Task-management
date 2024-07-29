import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: AuthService;
  let router: Router;
  let currentUserSubject: BehaviorSubject<any>;

  beforeEach(() => {
    currentUserSubject = new BehaviorSubject<any>(null);

    const authServiceMock = {
      currentUserSubject,
      get currentUserValue() {
        return currentUserSubject.value;
      }
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceMock }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);

    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation if user is logged in', () => {
    currentUserSubject.next({ email: 'test@test.com' });

    const canActivate = guard.canActivate(null, null);
    expect(canActivate).toBeTrue();
  });

  it('should prevent activation and navigate to login if user is not logged in', () => {
    currentUserSubject.next(null);

    const canActivate = guard.canActivate(null, null);
    expect(canActivate).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
