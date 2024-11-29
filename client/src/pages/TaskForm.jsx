import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { 
  Typography, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Grid, 
  Paper,
  Container,
  IconButton,
  Tooltip
} from '@material-ui/core';
import { 
  Create as CreateIcon, 
  Cancel as CancelIcon, 
  AssignmentTurnedIn as AssignmentIcon, 
  PriorityHigh as PriorityHighIcon, 
  DateRange as DateRangeIcon, 
  Category as CategoryIcon 
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AuthContext } from '../components/AuthContext';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
  },
  paper: {
    padding: theme.spacing(4),
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[5],
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.01)',
      boxShadow: theme.shadows[10],
    },
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  submitButton: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(1.5),
  },
  iconInput: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
}));

function TaskForm() {
  const classes = useStyles();
  const { id } = useParams();
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const [task, setTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    status: 'todo',
    assignedTo: '',
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchTask = async () => {
      if (id && id !== 'new') {
        try {
          const response = await axios.get(`http://localhost:5000/api/tasks/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          setTask(response.data);
        } catch (error) {
          toast.error('Error fetching task: ' + error.response?.data?.message || 'An error occurred');
        }
      } else if (id === 'new') {
        try {
          const response = await axios.get('http://localhost:5000/api/tasks/new', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          setTask(response.data);
        } catch (error) {
          toast.error('Error fetching new task template: ' + error.response?.data?.message || 'An error occurred');
        }
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUsers(response.data);
      } catch (error) {
        toast.error('Error fetching users: ' + error.response?.data?.message || 'An error occurred');
      }
    };

    fetchTask();
    fetchUsers();
  }, [id]);

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!task.title || !task.description || !task.dueDate || !task.assignedTo) {
        toast.error('Please fill in all required fields');
        return;
      }
  
      if (id && id !== 'new') {
        await axios.put(`http://localhost:5000/api/tasks/${id}`, task, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        toast.success('Task updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/tasks', task, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        toast.success('Task created successfully');
      }
      history.push('/tasks');
    } catch (error) {
      toast.error('Error saving task: ' + error.response?.data?.message || 'An error occurred');
    }
  };

  const handleCancel = () => {
    history.push('/tasks');
  };

  const isUser = user && user.role === 'user';


  return (
    <Container maxWidth="md" className={classes.root}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={3} className={classes.paper}>
          <Typography variant="h4" gutterBottom align="center">
            <CreateIcon style={{ marginRight: 10, verticalAlign: 'middle' }} />
            {id ? 'Edit Task' : 'Create New Task'}
          </Typography>
          <form onSubmit={handleSubmit} className={classes.form}>
            <Grid container spacing={3}>
              <Grid item xs={12} className={classes.iconInput}>
                <AssignmentIcon color="primary" />
                <TextField
                  name="title"
                  variant="outlined"
                  required
                  fullWidth
                  label="Title"
                  value={task.title}
                  onChange={handleChange}
                  disabled={isUser}
                />
              </Grid>
              <Grid item xs={12} className={classes.iconInput}>
                <CategoryIcon color="primary" />
                <TextField
                  name="description"
                  variant="outlined"
                  required
                  fullWidth
                  label="Description"
                  multiline
                  rows={4}
                  value={task.description}
                  onChange={handleChange}
                  disabled={isUser}
                />
              </Grid>
              <Grid item xs={12} sm={6} className={classes.iconInput}>
                <DateRangeIcon color="primary" />
                <TextField
                  name="dueDate"
                  variant="outlined"
                  required
                  fullWidth
                  label="Due Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={task.dueDate}
                  onChange={handleChange}
                  disabled={isUser}
                />
              </Grid>
              <Grid item xs={12} sm={6} className={classes.iconInput}>
                <PriorityHighIcon color="primary" />
                <FormControl variant="outlined" fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    name="priority"
                    value={task.priority}
                    onChange={handleChange}
                    label="Priority"
                    disabled={isUser}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={task.status}
                    onChange={handleChange}
                    label="Status"
                  >
                    <MenuItem value="todo">To Do</MenuItem>
                    <MenuItem value="in_progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {!isUser && (
                <Grid item xs={12}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel>Assign To</InputLabel>
                    <Select
                      name="assignedTo"
                      value={task.assignedTo}
                      onChange={handleChange}
                      label="Assign To"
                    >
                      {users.map((user) => (
                        <MenuItem key={user._id} value={user._id}>
                          {user.username}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    className={classes.submitButton}
                    startIcon={<AssignmentIcon />}
                  >
                    {id ? 'Update Task' : 'Create Task'}
                  </Button>
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    className={classes.submitButton}
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </motion.div>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </motion.div>
    </Container>
  );
}

export default TaskForm;