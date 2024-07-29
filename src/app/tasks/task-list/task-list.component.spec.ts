import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TaskListComponent } from './task-list.component';
import { TaskService, Task } from '../task.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

// Create mock objects
const taskServiceMock = {
  getTasks: jasmine.createSpy('getTasks').and.returnValue(of([
    { id: '1', category: 'Work', completed: false, dueDate: '2024-07-31' },
    { id: '2', category: 'Personal', completed: true, dueDate: '2024-07-25' }
  ]))
};

const routerMock = {
  navigate: jasmine.createSpy('navigate')
};

const authServiceMock = {
  logout: jasmine.createSpy('logout')
};

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskListComponent ],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: AuthService, useValue: authServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tasks on initialization', () => {
    component.ngOnInit();
    expect(component.tasks.length).toBe(2);
    expect(component.tasks[0].category).toBe('Work');
  });

  it('should navigate to new task route on addTask', () => {
    component.addTask();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/tasks', 'new']);
  });

  it('should navigate to task details route on viewTask', () => {
    component.viewTask('1');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/tasks', '1']);
  });

  it('should filter tasks by category', () => {
    component.filterCategory = 'Work';
    const filteredTasks = component.filteredTasks();
    expect(filteredTasks.length).toBe(1);
    expect(filteredTasks[0].category).toBe('Work');
  });

  it('should filter tasks by status', () => {
    component.filterStatus = 'completed';
    const filteredTasks = component.filteredTasks();
    expect(filteredTasks.length).toBe(1);
    expect(filteredTasks[0].completed).toBeTrue();
  });

  it('should call authService.logout on logout', () => {
    component.logout();
    expect(authServiceMock.logout).toHaveBeenCalled();
  });
});
