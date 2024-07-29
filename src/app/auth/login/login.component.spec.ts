import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    const authServiceMock = {
      login: jasmine.createSpy('login').and.returnValue(of({}))
    };

    const routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [FormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.login on form submit', () => {
    component.email = 'test@test.com';
    component.password = '123456';
    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith('test@test.com', '123456');
  });



});
