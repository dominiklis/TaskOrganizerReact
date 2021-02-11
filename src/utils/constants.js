export const constStrings = {
  activeTasks: "active tasks",
  overdueTasks: "overdue tasks",
  addNewTask: "add new task",
  completedTasks: "completed tasks",
  searchResults: "search results",
  sharedTasks: "shared tasks",
  noOverdueTasks: "no overdue tasks",
  noActiveTasks: "no active tasks",
  noTasksToShow: "no tasks to show",
  changesSaved: "changes saved",
  somethingWentWrongTryAganin: "something went wrong, try again",
  newStepAdded: "new step added",
  stepRemoved: "step removed",
  noteAdded: "note added",
  noteRemoved: "note removed",
  taskShared: "task shared",
  endOfSharing: "end of sharing",
  userAlreadyHasAccess: "this user already has access to this task",
  userNotFound: "user not found or you are not the author of the task",
  taskCompleted: "task set as completed",
  taskIncomplete: "task set as incomplete",
};

export const priorityTexts = [
  "low priority",
  "medium priority",
  "high priority",
];

export const getPriorityText = (priority) => {
  if (priority > 2) {
    priority = 2;
  }

  return priorityTexts[priority];
};
