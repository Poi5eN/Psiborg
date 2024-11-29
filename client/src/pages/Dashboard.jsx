import React, { useState, useEffect, useContext } from 'react';
import {
  Typography,
  Grid,
  Paper,
  Box,
  Container,
  Chip,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  IconButton
} from '@material-ui/core';
import {
  makeStyles,
  createTheme,
  ThemeProvider
} from '@material-ui/core/styles';
import {
  Assignment,
  CheckCircle,
  Schedule,
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  CalendarToday as CalendarIcon,
  BarChart as BarChartIcon,
  ListAlt as ListIcon
} from '@material-ui/icons';
import DeleteIcon from '@mui/icons-material/Delete';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { AuthContext } from '../components/AuthContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

const useStyles = makeStyles((theme) => ({
  // root: {
  //   backgroundColor: theme.palette.background.default,
  //   minHeight: '100vh',
  //   padding: theme.spacing(4),
  // },
  headerContainer: {
    marginBottom: theme.spacing(4),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paper: {
    padding: theme.spacing(3),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRadius: theme.spacing(2),
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-10px)',
      boxShadow: theme.shadows[10],
    },
  },
  statIcon: {
    fontSize: 64,
    opacity: 0.7,
    marginBottom: theme.spacing(2),
  },
  statValue: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: theme.palette.primary.main,
  },
  statSubtitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing(2),
  },
  trendIcon: {
    marginLeft: theme.spacing(1),
  },
  chartContainer: {
    width: '100%',
    height: 300,
  },
  cardHeader: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  },
}));

const StatCard = ({ icon, title, value, color, trend }) => {
  const classes = useStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
    >
      <Paper className={classes.paper} elevation={3}>
        {React.cloneElement(icon, { className: classes.statIcon, style: { color } })}
        <div>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Typography className={classes.statValue}>
            {value}
          </Typography>
          <div className={classes.statSubtitle}>
            <Chip
              label={`${trend > 0 ? '+' : ''}${trend}%`}
              color={trend >= 0 ? 'primary' : 'secondary'}
              size="small"
            />
            {trend >= 0 ? (
              <TrendingUpIcon color="primary" className={classes.trendIcon} />
            ) : (
              <TrendingDownIcon color="secondary" className={classes.trendIcon} />
            )}
          </div>
        </div>
      </Paper>
    </motion.div>
  );
};

const TaskStatusPieChart = ({ stats }) => {
  const classes = useStyles();

  const chartData = [
    { name: 'To Do', value: stats.todoTasks || 0, color: '#FF6384' },
    { name: 'In Progress', value: stats.inProgressTasks || 0, color: '#36A2EB' },
    { name: 'Completed', value: stats.completedTasks || 0, color: '#4CAF50' },
  ];

  return (
    <Card elevation={3}>
      <CardHeader
        title="Task Distribution Status"
        avatar={<BarChartIcon />}
        className={classes.cardHeader}
      />
      <CardContent>
        <div className={classes.chartContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                innerRadius="60%"
                outerRadius="80%"
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                labelPosition="inside"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

function Dashboard() {
  const classes = useStyles();
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    todoTasks: 0,
    inProgressTasks: 0,
    completionTrend: 0,
    pendingTrend: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [taskDistribution, setTaskDistribution] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, tasksResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/tasks/stats', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
          axios.get('http://localhost:5000/api/tasks', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          })
        ]);

        setStats(statsResponse.data);
        setRecentTasks(tasksResponse.data.slice(0, 4)); // Get the 4 most recent tasks

        // Calculate task distribution
        const distribution = tasksResponse.data.reduce((acc, task) => {
          if (!acc[task.assignedTo.username]) {
            acc[task.assignedTo.username] = 0;
          }
          acc[task.assignedTo.username]++;
          return acc;
        }, {});

        setTaskDistribution(Object.entries(distribution).map(([name, count]) => ({
          name,
          value: count
        })));

      } catch (error) {
        toast.error('Error fetching data: ' + error.response?.data?.message || 'An error occurred');
      }
    };
    fetchData();
  }, []);

  const isAdminOrManager = user && (user.role === 'admin' || user.role === 'manager');


  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" className={classes.root}>
        <Box className={classes.headerContainer}>
          <Typography variant="h4" gutterBottom>
            <DashboardIcon style={{ marginRight: 10, verticalAlign: 'middle' }} />
            Dashboard
          </Typography>
          <Chip
            label={isAdminOrManager ? 'Admin View' : 'Personal View'}
            color={isAdminOrManager ? 'primary' : 'secondary'}
            icon={isAdminOrManager ? <ListIcon /> : <CalendarIcon />}
          />
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <StatCard
              icon={<Assignment />}
              title="Total Tasks"
              value={stats.totalTasks}
              color="#3f51b5"
              trend={stats.completionTrend}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              icon={<CheckCircle />}
              title="Completed Tasks"
              value={stats.completedTasks}
              color="#4caf50"
              trend={stats.completionTrend}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              icon={<Schedule />}
              title="Pending Tasks"
              value={stats.pendingTasks}
              color="#ff9800"
              trend={stats.pendingTrend}
            />
          </Grid>

          <Grid item xs={12} md={8}>
            <Card elevation={3}>
              <CardHeader
                title="Recent Tasks"
                avatar={<ListIcon />}
                className={classes.cardHeader}
              />
              <CardContent>
                <List>
                  {recentTasks.map((task) => (
                    <ListItem key={task._id}>
                      <ListItemAvatar>
                        <Avatar alt={task.title} src={`https://www.example.com/${task._id}-avatar.png`} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={task.title}
                        secondary={`Assigned to ${task.assignedTo.username} - ${new Date(task.createdAt).toLocaleString()}`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete">
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardHeader
                title="Task Distribution"
                avatar={<BarChartIcon />}
                className={classes.cardHeader}
              />
              <CardContent>
                <div className={classes.chartContainer}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={taskDistribution}
                        innerRadius="60%"
                        outerRadius="80%"
                        dataKey="value"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        labelPosition="inside"
                      >
                        {taskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default Dashboard;