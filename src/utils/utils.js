export const checkForDates = (today, tomorrow) => {
  if (today == null || tomorrow == null) {
    return false;
  }

  let td = new Date(today);
  let tm = new Date(tomorrow);
  if (td.getDay() !== tm.getDay()) {
    return true;
  }

  return false;
};

export const filterTasksByPriority = (priority, allTasks) => {
  if (priority !== null) {
    let newTasks = [];
    allTasks.forEach((group) => {
      const grp = {
        ...group,
        tasks: group.tasks.filter((task) => task.priority === priority),
      };
      grp.count = grp.tasks.length;
      if (grp.count > 0) {
        newTasks.push(grp);
      }
    });

    return newTasks;
  } else {
    return allTasks;
  }
};
