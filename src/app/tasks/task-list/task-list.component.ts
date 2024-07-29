
import { Component, OnInit } from '@angular/core';
import { TaskService, Task } from '../task.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filterCategory = '';
  filterStatus = '';
  filterDueDate: Date | null = null;

  constructor(
    private taskService: TaskService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  addTask() {
    this.router.navigate(['/tasks', 'new']);
  }

  viewTask(id: string) {
    this.router.navigate(['/tasks', id]);
  }

  filteredTasks(): Task[] {
    return this.tasks.filter(task => {
      const matchesCategory = !this.filterCategory || task.category.includes(this.filterCategory);
      const matchesStatus = !this.filterStatus ||
        (this.filterStatus === 'completed' && task.completed) ||
        (this.filterStatus === 'notCompleted' && !task.completed);
      const matchesDueDate = !this.filterDueDate || new Date(task.dueDate).toDateString() === new Date(this.filterDueDate).toDateString();

      return matchesCategory && matchesStatus && matchesDueDate;
    });
  }

  logout() {
    this.authService.logout();
  }
}
