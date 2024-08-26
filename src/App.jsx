import { useState } from 'react';
import KanbanBoard from './components/KanbanBoard';
import TaskTable from './components/TaskTable';
import './styles/App.css'; // Import CSS file

const App = () => {
  // State to manage tasks
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });

  return (
    <div className="app-container">
      <h1>Task Management System</h1>
      
      <div className="content-container">
        <KanbanBoard tasks={tasks} setTasks={setTasks} />
        </div>
        <TaskTable tasks={tasks} setTasks={setTasks} />
     
    </div>
  );
};

export default App;
