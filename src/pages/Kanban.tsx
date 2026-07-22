import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { getTasks, updateTask, } from "../services/taskService";

const Kanban = () => {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.log(error);
    }
  };

  const pending = tasks.filter(
    (task) => task.status === "Pending"
  );

  const completed = tasks.filter(
    (task) => task.status === "Completed"
  );

 const onDragEnd = async (result: any) => {
  if (!result.destination) return;

  const { draggableId, destination } = result;

  const task = tasks.find(
    (t) => t._id === draggableId
  );

  if (!task) return;

  try {
    await updateTask(task._id, {
      ...task,
      status: destination.droppableId,
    });

    loadTasks();
  } catch (error) {
    console.log(error);
  }
};

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-3xl font-bold mb-8">
        Kanban Board
      </h1>

      <DragDropContext onDragEnd={onDragEnd}>

        <div className="grid grid-cols-2 gap-8">

          <Droppable droppableId="Pending">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-white rounded-xl shadow-lg p-6 min-h-[500px]"
              >
                <h2 className="text-xl font-bold mb-5">
                  Pending
                </h2>

                {pending.map((task, index) => (
                  <Draggable
                    key={task._id}
                    draggableId={task._id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-yellow-100 rounded-lg p-4 mb-3 shadow"
                      >
                        <h3 className="font-bold">
                          {task.title}
                        </h3>

                        <p>{task.description}</p>
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <Droppable droppableId="Completed">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-white rounded-xl shadow-lg p-6 min-h-[500px]"
              >
                <h2 className="text-xl font-bold mb-5">
                  Completed
                </h2>

                {completed.map((task, index) => (
                  <Draggable
                    key={task._id}
                    draggableId={task._id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-green-100 rounded-lg p-4 mb-3 shadow"
                      >
                        <h3 className="font-bold">
                          {task.title}
                        </h3>

                        <p>{task.description}</p>
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>

        </div>

      </DragDropContext>

    </div>
  );
};

export default Kanban;