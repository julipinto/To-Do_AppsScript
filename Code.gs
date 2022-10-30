const TASKS_DB = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tasks');

function getTasks(request) {
  let tasks = TASKS_DB.getRange('A:C').getValues();
  const filter = request.body?.filter;
  const formattedTasks = tasks
    .filter((task) => {
      if (filter) {
        return task[2] === filter;
      }
      return task[0];
    })
    .reduce((acc, curr) => {
      const [id, task, status] = curr;
      if (task) {
        acc.push({ id, task, status });
      }
      return [...acc];
    }, []);

  return formattedTasks;
}

function insertTask(request) {
  errors = [];

  const task = request.body?.task;
  if (!task) errors.push("you may provide field 'task'");
  const status = request.body?.status;
  if (!status) errors.push("you may provide field 'status'");

  if (errors.length > 0) return { error: errors.join(', ') };

  const nextRow = TASKS_DB.getLastRow() + 1;
  const id = generateID();
  TASKS_DB.getRange(nextRow, 1).setValue(id);
  TASKS_DB.getRange(nextRow, 2).setValue(task);
  TASKS_DB.getRange(nextRow, 3).setValue(status);
  return { message: 'Task inserted successfully' };
}

function modifyTask(request) {
  errors = [];
  const id = request.body?.id;
  if (!id) errors.push("you may provide field 'id'");

  const task = request.body?.task;
  const status = request.body?.status;
  if (!task && !status) errors.push("you may provide field 'task' or 'status'");
  if (errors.length > 0) return { error: errors.join(', ') };

  let tasks = TASKS_DB.getRange('A:C').getValues();
  const index =
    tasks.findIndex((row) => {
      return row[0] == id;
    }) + 1;

  if (index < 0) return { error: 'Task does not exist' };
  if (task) TASKS_DB.getRange(index, 2).setValue(task);
  if (status) TASKS_DB.getRange(index, 3).setValue(status);
  return { message: 'Task modified successfully' };
}
