export const generateSprintReport = (sprintId, tasks) => {
  const completed = tasks.filter((t) => t.status === "done").length;
  return {
    sprint: sprintId,
    totalTasks: tasks.length,
    completedTasks: completed,
    velocity: completed / tasks.length,
  };
};

export const calculateStoryPoints = (complexity, risk) => {
  return complexity * risk;
};
