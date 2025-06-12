let tasks = [];
let currentId = 1;

exports.getAllTasks = (req, res) => {
  let result = [...tasks];
  const { title, description } = req.query;
  if (title) {
    result = result.filter((task) =>
      task.title.toLowerCase().includes(title.toLowerCase())
    );
  }
  if (description) {
    result = result.filter((task) =>
      task.description.toLowerCase().includes(description.toLowerCase())
    );
  }
  const { sortBy = "id", order = "asc" } = req.query;
  result.sort((a, b) => {
    if (order === "desc") {
      return a[sortBy] < b[sortBy] ? 1 : -1;
    } else {
      return a[sortBy] > b[sortBy] ? 1 : -1;
    }
  });
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedResult = result.slice(startIndex, endIndex);

  res.status(200).json({
    total: result.length,
    page,
    limit,
    data: paginatedResult,
  });
};

exports.getTaskById = (req, res) => {
  const task = tasks.find((t) => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.status(200).json(task);
};

exports.createTask = (req, res) => {
  console.log("Incoming body:", req.body);

  // Handle array of tasks
  if (Array.isArray(req.body)) {
    const invalidTasks = req.body.filter(
      (task) => !task.title || !task.description
    );

    if (invalidTasks.length > 0) {
      return res.status(400).json({
        message: `All tasks must have both 'title' and 'description'.`,
        invalidTasks: invalidTasks,
      });
    }

    const validTasks = req.body.map((task) => ({
      id: currentId++,
      title: task.title,
      description: task.description,
    }));

    tasks.push(...validTasks);

    return res.status(201).json({
      message: `${validTasks.length} tasks created successfully.`,
      tasks: validTasks,
    });
  }

  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({
      message: "Title and Description are required",
    });
  }

  const newTask = {
    id: currentId++,
    title,
    description,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
};

exports.updateTask = (req, res) => {
  const task = tasks.find((t) => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ messaage: "Task not found" });
  const { title, description } = req.body;
  if (!title || !description) {
    return res
      .status(400)
      .json({ message: "Title and Description are required" });
  }
  task.title = title;
  task.description = description;
  res.status(200).json(task);
};

exports.deleteTask = (req, res) => {
  const index = tasks.findIndex((t) => t.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Task not found" });
  tasks.splice(index, 1);
  res.status(204).send();
};
