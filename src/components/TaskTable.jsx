import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
  TextField, Select, MenuItem, FormControl, InputLabel, Grid, Paper, TableSortLabel,
  Button, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';

const TaskTable = ({ tasks, setTasks }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filter, setFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('priority');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('');
  const [frontendDev, setFrontendDev] = useState('');
  const [backendDev, setBackendDev] = useState('');
  const [designer, setDesigner] = useState('');
  const [tester, setTester] = useState('');

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (event) => setFilter(event.target.value);
  const handleSearchChange = (event) => setSearchQuery(event.target.value.toLowerCase());

  const handleRequestSort = (property) => {
    const isAscending = orderBy === property && order === 'asc';
    setOrder(isAscending ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleDeleteClick = (taskId, status) => {
    setTaskToDelete({ id: taskId, status });
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setTaskToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      setTasks((prevTasks) => ({
        ...prevTasks,
        [taskToDelete.status]: prevTasks[taskToDelete.status].filter((task) => task.id !== taskToDelete.id),
      }));
      handleCloseDeleteDialog();
    }
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
    setOpenEditDialog(true);
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
    setNewTaskPriority('');
    setFrontendDev('');
    setBackendDev('');
    setDesigner('');
    setTester('');
    setOpenEditDialog(false);
    setEditTask(null);
  };

  const filteredTasks = Object.entries(tasks).reduce((acc, [status, tasks]) => {
    if (filter === '' || status === filter) {
      const filtered = tasks.filter(task =>
        task.description.toLowerCase().includes(searchQuery) ||
        task.assignees.frontend.toLowerCase().includes(searchQuery) ||
        task.assignees.backend.toLowerCase().includes(searchQuery) ||
        task.assignees.designer.toLowerCase().includes(searchQuery) ||
        task.assignees.tester.toLowerCase().includes(searchQuery)
      );
      if (filtered.length > 0) {
        acc[status] = filtered;
      }
    }
    return acc;
  }, {});

  const tasksArray = Object.values(filteredTasks).flat();
  const sortedTasks = tasksArray.sort((a, b) => {
    if (orderBy === 'priority') {
      const priorityOrder = ['Low', 'Medium', 'High'];
      return (priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority)) * (order === 'asc' ? 1 : -1);
    }
    return 0;
  });

  return (
    <Paper sx={{ padding: 2, backgroundColor: '#f0f4ff' }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Status Filter</InputLabel>
            <Select
              value={filter}
              onChange={handleFilterChange}
              label="Status Filter"
              sx={{ backgroundColor: '#e0f7fa' }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="todo">To Do</MenuItem>
              <MenuItem value="inProgress">In Progress</MenuItem>
              <MenuItem value="done">Done</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Search"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ backgroundColor: '#fff8e1' }}
          />
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#d1c4e9' }}>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'priority'}
                  direction={orderBy === 'priority' ? order : 'asc'}
                  onClick={() => handleRequestSort('priority')}
                  sx={{ color: '#7b1fa2' }}
                >
                  Priority
                </TableSortLabel>
              </TableCell>
              <TableCell>Frontend Dev</TableCell>
              <TableCell>Backend Dev</TableCell>
              <TableCell>Designer</TableCell>
              <TableCell>Tester</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedTasks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(task => (
              <TableRow
                key={task.id}
                sx={{
                  backgroundColor: task.priority === 'High' ? '#ffebee' : task.priority === 'Medium' ? '#fffde7' : '#e8f5e9',
                  '&:hover': {
                    backgroundColor: '#f3e5f5',
                  }
                }}
              >
                <TableCell>{task.description}</TableCell>
                <TableCell>{task.dueDate}</TableCell>
                <TableCell>{task.priority}</TableCell>
                <TableCell>{task.assignees.frontend}</TableCell>
                <TableCell>{task.assignees.backend}</TableCell>
                <TableCell>{task.assignees.designer}</TableCell>
                <TableCell>{task.assignees.tester}</TableCell>
                <TableCell>{task.status === 'todo' ? 'To Do' :
                  task.status === 'inProgress' ? 'In Progress' : 'Done'}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEditTask(task)}
                    sx={{ marginRight: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDeleteClick(task.id, task.status)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={tasksArray.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ marginTop: 2 }}
      />

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Due Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newTaskDueDate}
            onChange={(e) => setNewTaskDueDate(e.target.value)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Priority</InputLabel>
            <Select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value)}
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Frontend Dev"
            type="text"
            fullWidth
            value={frontendDev}
            onChange={(e) => setFrontendDev(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Backend Dev"
            type="text"
            fullWidth
            value={backendDev}
            onChange={(e) => setBackendDev(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Designer"
            type="text"
            fullWidth
            value={designer}
            onChange={(e) => setDesigner(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Tester"
            type="text"
            fullWidth
            value={tester}
            onChange={(e) => setTester(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateTask} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default TaskTable;
