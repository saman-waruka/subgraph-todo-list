import { BigInt } from "@graphprotocol/graph-ts";
import {
  TodoList,
  TaskCreated,
  TaskDeleted,
  TaskEdited,
  ToggleTaskCompleted,
} from "../generated/TodoList/TodoList";
import { Task, Owner } from "../generated/schema";

export function handleTaskCreated(event: TaskCreated): void {
  const transactionFrom = event.transaction.from.toHex();
  let owner = Owner.load(transactionFrom);
  if (!owner) {
    owner = new Owner(transactionFrom);
  }
  let task = Task.load(event.params.id.toString());
  const eventParamId = event.params.id.toString();
  const taskId = `${transactionFrom}:${eventParamId}`;
  if (!task) {
    task = new Task(taskId);
    task.content = event.params.content;
    task.completed = false;
    task.owner = transactionFrom;
  }
  task.save();

  let tasks = owner.tasks;
  tasks.push(taskId);
  owner.tasks = tasks;
  owner.save();
}

// export function handleTaskDeleted(event: TaskDeleted): void {
//   const entity = Task.load(event.params.id.toString());
//   entity?.unset()
// }

// export function handleTaskEdited(event: TaskEdited): void {
//   const entity = Task.load(event.params.id.toString());
//   if (entity) {
//     entity.content = event.params.content;
//     entity.save();
//   }
// }

// export function handleToggleTaskCompleted(event: ToggleTaskCompleted): void {
//   const entity = Task.load(event.params.id.toString());
//   if (!entity) {
//     return;
//   }
//   entity.completed = entity.completed;
// }
