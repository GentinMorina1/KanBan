import React from 'react';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import styled from '@emotion/styled';
import { Draggable } from 'react-beautiful-dnd';

const PriorityColor = {
  Low: '#d4edda',
  Medium: '#fff3cd',
  High: '#f8d7da'
};

const StyledCard = styled(Card)(({ priority }) => ({
  backgroundColor: PriorityColor[priority] || '#ffffff',
  marginBottom: '10px',
  marginTop:'10px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
  transition: 'background-color 0.3s ease',
  'border-radius': '30px',
  cursor: 'grab',
  position: 'relative', // To position the Edit button
}));

const TaskCard = ({ item, index, onEdit }) => (
  <Draggable draggableId={item.id} index={index}>
    {(provided) => (
      <StyledCard
        priority={item.priority}
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        <CardContent>
          <Typography variant="h6">{item.description}</Typography>
          <Typography color="textSecondary">{item.dueDate}</Typography>
          <Typography color="textSecondary">Priority: {item.priority}</Typography>
          <Typography color="textSecondary">Frontend Dev: {item.assignees.frontend}</Typography>
          <Typography color="textSecondary">Backend Dev: {item.assignees.backend}</Typography>
          <Typography color="textSecondary">Designer: {item.assignees.designer}</Typography>
          <Typography color="textSecondary">Tester: {item.assignees.tester}</Typography>
          <IconButton
            color="primary"
            onClick={() => onEdit(item)}
            style={{ position: 'absolute', top: 10, right: 10 }}
          >
            <EditIcon />
          </IconButton>
        </CardContent>
      </StyledCard>
    )}
  </Draggable>
);

export default TaskCard;
