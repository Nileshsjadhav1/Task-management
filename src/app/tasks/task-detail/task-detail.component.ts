
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService, Task } from '../task.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit {
  task: Task = { id: null, title: '', description: '', dueDate: '', category: '', completed: false };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.taskService.getTask(id).subscribe(task => {
        this.task = task;
      });
    }
  }

  onSubmit() {
    if (this.task.id) {
      this.taskService.updateTask(this.task).subscribe(() => {
        this.router.navigate(['/tasks']);
      });
    } else {
      this.task.id = new Date().getTime().toString();
      this.taskService.createTask(this.task).subscribe(() => {
        this.router.navigate(['/tasks']);
      });
    }
  }

  deleteTask() {
    if (this.task.id) {
      this.taskService.deleteTask(this.task.id).subscribe(() => {
        this.router.navigate(['/tasks']);
      });
    }
  }
}
