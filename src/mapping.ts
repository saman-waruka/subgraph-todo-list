import { BigInt, store } from "@graphprotocol/graph-ts";
import {
  TodoList,
  TaskCreated,
  TaskDeleted,
  TaskEdited,
  ToggleTaskCompleted,
} from "../generated/TodoList/TodoList";
import { Task, Owner } from "../generated/schema";

// function getTaskId(
//   event: TaskCreated | TaskDeleted | TaskEdited | ToggleTaskCompleted
// ): string {
//   const ownerAddress = event.transaction.from.toHexString();
//   const paramId = event.params.id.toString();
//   return `${ownerAddress}_${paramId}`;
// }

function getTaskId(ownerAddress: string, paramId: string): string {
  return `${ownerAddress}_${paramId}`;
}

export function handleTaskCreated(event: TaskCreated): void {
  const transactionFrom = event.transaction.from.toHexString();
  const taskId = getTaskId(transactionFrom, event.params.id.toString());
  let task = Task.load(taskId);
  if (!task) {
    task = new Task(taskId);
    task.content = event.params.content;
    task.completed = false;
    task.owner = transactionFrom;
  }
  task.save();

  let owner = Owner.load(transactionFrom);
  if (!owner) {
    owner = new Owner(transactionFrom);
    owner.save();
  }
}

export function handleTaskDeleted(event: TaskDeleted): void {
  const taskId = getTaskId(
    event.transaction.from.toHexString(),
    event.params.id.toString()
  );
  store.remove("Task", taskId);
}

export function handleTaskEdited(event: TaskEdited): void {
  const taskId = getTaskId(
    event.transaction.from.toHexString(),
    event.params.id.toString()
  );
  const task = Task.load(taskId);
  if (task) {
    task.content = event.params.content;
    task.save();
  }
}

export function handleToggleTaskCompleted(event: ToggleTaskCompleted): void {
  const taskId = getTaskId(
    event.transaction.from.toHexString(),
    event.params.id.toString()
  );
  const task = Task.load(taskId);
  if (!task) {
    return;
  }
  task.completed = event.params.completed;
}
