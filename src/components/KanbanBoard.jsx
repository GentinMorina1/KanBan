import React, { useState } from 'react';
import { Box, Button, TextField, MenuItem, Grid, Divider, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';
import styled from '@emotion/styled';

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'row',
});

const TaskList = styled('div')({
  minHeight: '600px',
  display: 'flex',
  flexDirection: 'column',
  background: '#d7dce8',
  minWidth: '341px',
  borderRadius: '5px',
  padding: '15px 15px',
  marginRight: '45px',
  transition: 'background-color 0.3s ease',
  overflowY: 'auto',
});

const Title = styled('span')({
  fontWeight: 'bold',
  color: '#333333',
  fontSize: 16,
  marginBottom: '1.5px',
});

const TaskColumnStyles = styled('div')({
  margin: '8px',
  display: 'flex',
  width: '100%',
  minHeight: '80vh',
});

const KanbanBoard = ({ tasks, setTasks }) => {
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('Medium');
  const [frontendDev, setFrontendDev] = useState('');
  const [backendDev, setBackendDev] = useState('');
  const [designer, setDesigner] = useState('');
  const [tester, setTester] = useState('');
  const [currentColumn, setCurrentColumn] = useState('todo');
  const [open, setOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const handleAddTask = () => {
    if (newTaskDescription.trim() === '' || newTaskDueDate === '') return;

    const newTask = {
      id: Date.now().toString(),
      description: newTaskDescription,
      dueDate: newTaskDueDate,
      priority: newTaskPriority,
      assignees: {
        frontend: frontendDev,
        backend: backendDev,
        designer: designer,
        tester: tester,
      },
      status: currentColumn,
    };

    setTasks(prevTasks => ({
      ...prevTasks,
      [currentColumn]: [...prevTasks[currentColumn], newTask],
    }));

    resetForm();
  };

  const handleEditTask = (task) => {
    setEditTask(task);
    setNewTaskDescription(task.description);
    setNewTaskDueDate(task.dueDate);
    setNewTaskPriority(task.priority);
    setFrontendDev(task.assignees.frontend);
    setBackendDev(task.assignees.backend);
    setDesigner(task.assignees.designer);
    setTester(task.assignees.tester);
    setOpen(true);
  };

   const handleUpdateTask = () => {
    if (newTaskDescription.trim() === '' || newTaskDueDate === '') return;

    const updatedTask = {
      ...editTask,
      description: newTaskDescription,
      dueDate: newTaskDueDate,
      priority: newTaskPriority,
      assignees: {
        frontend: frontendDev,
        backend: backendDev,
        designer: designer,
        tester: tester,
      },
    };

    setTasks(prevTasks => {
      const updatedTasks = { ...prevTasks };
      const column = prevTasks[editTask.status].map(task => (task.id === editTask.id ? updatedTask : task));
      updatedTasks[editTask.status] = column;
      return updatedTasks;
    });

    resetForm();
  };

  const resetForm = () => {
    setNewTaskDescription('');
    setNewTaskDueDate('');
    setNewTaskPriority('Medium');
    setFrontendDev('');
    setBackendDev('');
    setDesigner('');
    setTester('');
    setEditTask(null);
    setOpen(false);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = [...tasks[source.droppableId]];
      const destColumn = [...tasks[destination.droppableId]];
      const [movedTask] = sourceColumn.splice(source.index, 1);
      movedTask.status = destination.droppableId;
      destColumn.splice(destination.index, 0, movedTask);

      setTasks({
        ...tasks,
        [source.droppableId]: sourceColumn,
        [destination.droppableId]: destColumn,
      });
    } else {
      const column = [...tasks[source.droppableId]];
      const [movedTask] = column.splice(source.index, 1);
      movedTask.status = source.droppableId;
      column.splice(destination.index, 0, movedTask);

      setTasks({
        ...tasks,
        [source.droppableId]: column,
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Container>
        <TaskColumnStyles>
          {['todo', 'inProgress', 'done'].map(column => (
            <Droppable key={column} droppableId={column}>
              {(provided, snapshot) => (
                <TaskList
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    backgroundColor: snapshot.isDraggingOver ? '#e0e4e8' : '#d7dce8',
                    transition: 'background-color 0.3s ease',
                    borderRadius: '15px',
                    margin:'30px'
                  }}
                >
                  <Box sx={{ width: '100%' }}>
                    <Grid
                      container
                      rowSpacing={1}
                      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                    >
                      <Grid item xs={10}>
                        <Title>
                          {column === 'todo' ? 'To Do' :
                           column === 'inProgress' ? 'In Progress' :
                           'Done'}
                        </Title>
                      </Grid>
                    </Grid>
                  </Box>
                  <Divider />
                  {tasks[column].map((task, index) => (
                    <TaskCard key={task.id} item={task} index={index} onEdit={handleEditTask} />
                  ))}
                  {provided.placeholder}
                </TaskList>
              )}
            </Droppable>
          ))}
        </TaskColumnStyles>
      </Container>

      <Box sx={{ marginTop: '20px',  textAlign: 'center' }}>
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>Add New Task</Button>
      </Box>

      <Dialog open={open} onClose={resetForm}>
        <DialogTitle>
          {editTask ? 'Edit Task' : 'Add Task'}
          <IconButton
            edge="end"
            color="inherit"
            onClick={resetForm}
            aria-label="close"
            sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Task Description"
            type="text"
            fullWidth
            variant="standard"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Due Date"
            type="date"
            fullWidth
            variant="standard"
            value={newTaskDueDate}
            onChange={(e) => setNewTaskDueDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Priority"
            select
            fullWidth
            variant="standard"
            value={newTaskPriority}
            onChange={(e) => setNewTaskPriority(e.target.value)}
          >
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            label="Frontend Dev"
            type="text"
            fullWidth
            variant="standard"
            value={frontendDev}
            onChange={(e) => setFrontendDev(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Backend Dev"
            type="text"
            fullWidth
            variant="standard"
            value={backendDev}
            onChange={(e) => setBackendDev(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Designer"
            type="text"
            fullWidth
            variant="standard"
            value={designer}
            onChange={(e) => setDesigner(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Tester"
            type="text"
            fullWidth
            variant="standard"
            value={tester}
            onChange={(e) => setTester(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={resetForm}>Cancel</Button>
          <Button onClick={editTask ? handleUpdateTask : handleAddTask}>
            {editTask ? 'Update Task' : 'Add Task'}
          </Button>
        </DialogActions>
      </Dialog>
    </DragDropContext>
  );
};

export default KanbanBoard;
