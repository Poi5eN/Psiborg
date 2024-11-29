import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Fade,
  Slide,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Dialog,
  Menu,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Search as SearchIcon, 
  FilterList as FilterListIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { TransitionGroup } from 'react-transition-group';
import axios from 'axios';
import { AuthContext } from '../components/AuthContext';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[3],
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
    transition: 'background-color 0.3s ease',
  },
}));

const AnimatedChip = styled(Chip)(({ theme }) => ({
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[2],
  },
}));

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterStatus, setFilterStatus] = useState({
    todo: true,
    in_progress: true,
    completed: true
  });
  const [filterPriority, setFilterPriority] = useState({
    low: true,
    medium: true,
    high: true
  });

  const history = useHistory();
  const { user } = useContext(AuthContext);


  const applyFilters = useCallback((tasksToFilter) => {
    const filtered = tasksToFilter.filter(task => {
      const matchSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchStatus = filterStatus[task.status];
      const matchPriority = filterPriority[task.priority];
  
      return matchSearch && matchStatus && matchPriority;
    });
  
    setFilteredTasks(filtered);
  }, [searchTerm, filterStatus, filterPriority]); // Only recreate applyFilters when these dependencies change
  

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tasks', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setTasks(response.data);
        applyFilters(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, [applyFilters]);


  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = tasks.filter(task => 
      task.title.toLowerCase().includes(term) ||
      task.description.toLowerCase().includes(term) ||
      task.status.toLowerCase().includes(term)
    );
    setFilteredTasks(filtered);
  };

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleStatusFilterChange = (status) => {
    setFilterStatus(prev => ({
      ...prev,
      [status]: !prev[status]
    }));
    applyFilters(tasks);
  };

  const handlePriorityFilterChange = (priority) => {
    setFilterPriority(prev => ({
      ...prev,
      [priority]: !prev[priority]
    }));
    applyFilters(tasks);
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const updatedTasks = tasks.filter((task) => task._id !== id);
      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks);
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'todo': 'default',
      'in_progress': 'primary',
      'completed': 'success'
    };
    return statusColors[status] || 'default';
  };

  const confirmDelete = (task) => {
    setTaskToDelete(task);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setTaskToDelete(null);
  };

  const canManageTasks = user && (user.role === 'admin' || user.role === 'manager');


  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Task List
      </Typography>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: '20px',
        alignItems: 'center'
      }}>
        {canManageTasks && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            component={Link}
            to="/task/new"
          >
            Create New Task
          </Button>
        )}
        
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            variant="outlined"
            placeholder="Search Tasks"
            value={searchTerm}
            onChange={handleSearch}
            style={{ marginRight: '10px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <IconButton onClick={handleFilterClick}>
            <FilterListIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleFilterClose}
          >
            <MenuItem>
              <Typography variant="subtitle1" gutterBottom>
                Filter by Status
              </Typography>
            </MenuItem>
            {Object.keys(filterStatus).map((status) => (
              <MenuItem key={status}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filterStatus[status]}
                      onChange={() => handleStatusFilterChange(status)}
                    />
                  }
                  label={status.replace('_', ' ')}
                />
              </MenuItem>
            ))}
            <MenuItem>
              <Typography variant="subtitle1" gutterBottom>
                Filter by Priority
              </Typography>
            </MenuItem>
            {Object.keys(filterPriority).map((priority) => (
              <MenuItem key={priority}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filterPriority[priority]}
                      onChange={() => handlePriorityFilterChange(priority)}
                    />
                  }
                  label={priority}
                />
              </MenuItem>
            ))}
          </Menu>
        </div>
      </div>

      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              {canManageTasks && <TableCell>Assigned To</TableCell>}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TransitionGroup component={TableBody}>
            {filteredTasks.map((task) => (
              <Slide direction="up" key={task._id}>
                <StyledTableRow>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>{task.priority}</TableCell>
                  <TableCell>
                    <AnimatedChip
                      label={task.status}
                      color={getStatusColor(task.status)}
                      variant="outlined"
                    />
                  </TableCell>
                  {canManageTasks && <TableCell>{task.assignedTo.username}</TableCell>}
                  <TableCell>
                    <IconButton 
                      color="primary"
                      onClick={() => history.push(`/task/${task._id}`)}
                    >
                      <EditIcon />
                    </IconButton>
                    {canManageTasks && (
                      <IconButton
                        color="error"
                        onClick={() => confirmDelete(task)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </StyledTableRow>
              </Slide>
            ))}
          </TransitionGroup>
        </Table>
      </StyledTableContainer>

      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        TransitionComponent={Fade}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the task "{taskToDelete?.title}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseDeleteDialog} 
            color="primary" 
            startIcon={<CloseIcon />}
          >
            Cancel
          </Button>
          <Button 
            onClick={() => deleteTask(taskToDelete._id)} 
            color="error"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default TaskList;