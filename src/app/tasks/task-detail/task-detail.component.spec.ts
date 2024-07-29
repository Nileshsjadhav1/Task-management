import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskDetailComponent } from './task-detail.component';
import { TaskService, Task } from '../task.service';

const taskServiceMock = {
  getTask: jasmine.createSpy('getTask').and.returnValue(of({
    id: '1',
    title: 'Test Task',
    description: 'This is a test task',
    dueDate: '2024-08-01',
    category: 'Work',
    completed: false
  })),
  updateTask: jasmine.createSpy('updateTask').and.returnValue(of(null)),
  createTask: jasmine.createSpy('createTask').and.returnValue(of(null)),
  deleteTask: jasmine.createSpy('deleteTask').and.returnValue(of(null))
};

const routerMock = {
  navigate: jasmine.createSpy('navigate')
};

const activatedRouteMock = {
  snapshot: {
    paramMap: {
      get: jasmine.createSpy('get').and.returnValue('1') // Adjust this based on the test case
    }
  }
};

describe('TaskDetailComponent', () => {
  let component: TaskDetailComponent;
  let fixture: ComponentFixture<TaskDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskDetailComponent ],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize task on ngOnInit', () => {
    component.ngOnInit();
    expect(taskServiceMock.getTask).toHaveBeenCalledWith('1');
    expect(component.task).toEqual({
      id: '1',
      title: 'Test Task',
      description: 'This is a test task',
      dueDate: '2024-08-01',
      category: 'Work',
      completed: false
    });
  });

  it('should call updateTask on onSubmit for existing task', () => {
    component.task = {
      id: '1',
      title: 'Updated Task',
      description: 'Updated description',
      dueDate: '2024-08-02',
      category: 'Personal',
      completed: true
    };
    component.onSubmit();
    expect(taskServiceMock.updateTask).toHaveBeenCalledWith(component.task);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('should call createTask on onSubmit for new task', () => {
    component.task = {
      id: null,
      title: 'New Task',
      description: 'New task description',
      dueDate: '2024-08-03',
      category: 'Personal',
      completed: false
    };
    component.onSubmit();
    expect(taskServiceMock.createTask).toHaveBeenCalledWith(component.task);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/tasks']);
  });



  it('should handle errors in onSubmit', () => {
    taskServiceMock.updateTask.and.returnValue(throwError(() => new Error('Update failed')));
    component.task = {
      id: '1',
      title: 'Error Task',
      description: 'This task will fail on update',
      dueDate: '2024-08-05',
      category: 'Work',
      completed: false
    };
    component.onSubmit();
    expect(taskServiceMock.updateTask).toHaveBeenCalledWith(component.task);
  });

  it('should handle errors in deleteTask', () => {
    taskServiceMock.deleteTask.and.returnValue(throwError(() => new Error('Delete failed')));
    component.task = {
      id: '1',
      title: 'Error Task',
      description: 'This task will fail on delete',
      dueDate: '2024-08-06',
      category: 'Work',
      completed: false
    };
    component.deleteTask();
    expect(taskServiceMock.deleteTask).toHaveBeenCalledWith('1');
  });
});
