$(document).ready(function () {
  let tasks = [];
  let queues = Array(4)
    .fill()
    .map(() => {
      return { time: 0, tasksInQueue: [] };
    });
  let queueElements = [];
  let updateComplete = true;

  for (let i = 1; i <= 4; ++i) {
    queueElements.push({
      list: $(`#queue-${i}-list`),
      duration: document.getElementById(`queue-${i}-duration`),
    });
  }

  function addRandomTask() {
    let rTime = Math.floor(Math.random() * 200) + 1;
    let rIsPriority = Math.floor(Math.random() * 10);

    tasks.push({ time: rTime, isPriority: rIsPriority < 3 });
  }

  function admitTask() {
    if (tasks.length == 0) {
      alert("No tasks in queue");
      return;
    }

    let task = tasks.shift();

    let res = 0;
    if (!task.isPriority) {
      for (let i = 1; i < 4; ++i) {
        if (queues[i].time <= queues[res].time) res = i;
      }
    }

    queues[res].time += task.time;
    queues[res].tasksInQueue.push({ ...task, taskTime: task.time });
  }

  function update() {
    let taskQueue = ``;
    for (const task of tasks) {
      taskQueue += `<div class="border-2 w-auto aspect-square p-2 ${
        task.isPriority && "color-red border-red-200"
      }">${task.time}</div>`;
    }
    $(`#tasks-queue-container`).html(taskQueue);

    for (let i = 0; i < 4; ++i) {
      if (queues[i].time > 0 && queues[i].tasksInQueue.length > 0) {
        queues[i].time = Math.max(0, queues[i].time - 1);
        queues[i].tasksInQueue[0].taskTime = Math.max(
          0,
          queues[i].tasksInQueue[0].taskTime - 1
        );

        if (
          queues[i].tasksInQueue.length != 0 &&
          queues[i].tasksInQueue[0].taskTime == 0
        )
          queues[i].tasksInQueue.shift();
      }

      let res = ``;
      for (const task of queues[i].tasksInQueue) {
        res += `<div class="p-2 rounded-lg cursor-pointer transition-all bg-black/20 aspect-square">${task.time}</div>`;
      }
      console.log(queueElements[i]);
      queueElements[i].list.html(res);
      queueElements[i].duration.style.setProperty(
        "--queue-width",
        `${1 + queues[i].time}px`
      );
    }
  }

  setInterval(() => {
    if (!updateComplete) return;
    updateComplete = false;
    update();
    updateComplete = true;
  }, 100);

  $("#add-random-task-btn").on("click", () => addRandomTask());
  $("#admit-task-btn").on("click", () => admitTask());
});
