// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable } from 'rxjs';

// export interface Task {
//   id: string;
//   title: string;
//   description: string;
//   dueDate: string;
//   category: string;
//   completed: boolean;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class TaskService {
//   private tasksSubject: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);
//   public tasks: Observable<Task[]> = this.tasksSubject.asObservable();

//   constructor() {
//     const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
//     this.tasksSubject.next(tasks);
//   }

//   getTasks(): Task[] {
//     return this.tasksSubject.value;
//   }

//   getTask(id: string): Task {
//     return this.tasksSubject.value.find(task => task.id === id);
//   }

//   createTask(task: Task) {
//     const tasks = this.tasksSubject.value;
//     tasks.push(task);
//     this.updateLocalStorage(tasks);
//   }

//   updateTask(updatedTask: Task) {
//     const tasks = this.tasksSubject.value.map(task => task.id === updatedTask.id ? updatedTask : task);
//     this.updateLocalStorage(tasks);
//   }

//   deleteTask(id: string) {
//     const tasks = this.tasksSubject.value.filter(task => task.id !== id);
//     this.updateLocalStorage(tasks);
//   }

//   private updateLocalStorage(tasks: Task[]) {
//     localStorage.setItem('tasks', JSON.stringify(tasks));
//     this.tasksSubject.next(tasks);
//   }
// }
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  category: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/tasks';
  private tasksSubject: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);
  public tasks: Observable<Task[]> = this.tasksSubject.asObservable();

  constructor(private http: HttpClient) {
    this.fetchTasks();
  }

  fetchTasks() {
    this.http.get<Task[]>(this.apiUrl).subscribe(tasks => {
      this.tasksSubject.next(tasks);
    });
  }

  getTasks(): Observable<Task[]> {
    return this.tasks;
  }

  getTask(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task).pipe(
      map(newTask => {
        const tasks = [...this.tasksSubject.value, newTask];
        this.tasksSubject.next(tasks);
        return newTask;
      })
    );
  }

  updateTask(updatedTask: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${updatedTask.id}`, updatedTask).pipe(
      map(() => {
        const tasks = this.tasksSubject.value.map(task => task.id === updatedTask.id ? updatedTask : task);
        this.tasksSubject.next(tasks);
        return updatedTask;
      })
    );
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      map(() => {
        const tasks = this.tasksSubject.value.filter(task => task.id !== id);
        this.tasksSubject.next(tasks);
      })
    );
  }
}
