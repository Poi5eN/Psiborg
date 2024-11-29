import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  CardActions,
  Container,
  Grid,
  Avatar,
  IconButton,
  Snackbar
} from '@material-ui/core';
import { 
  makeStyles, 
  createTheme, 
  ThemeProvider 
} from '@material-ui/core/styles';
import { 
  AccountCircle, 
  Email, 
  Work, 
  Edit, 
  Save, 
  Close 
} from '@material-ui/icons';
import MuiAlert from '@mui/lab/Alert';
import axios from 'axios';
import { motion } from 'framer-motion';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(4),
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
  },
  card: {
    maxWidth: 600,
    margin: '0 auto',
    borderRadius: theme.spacing(2),
    boxShadow: '0 16px 40px -12.125px rgba(0,0,0,0.3)',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.02)',
    },
  },
  avatar: {
    width: theme.spacing(14),
    height: theme.spacing(14),
    margin: '0 auto',
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  actions: {
    justifyContent: 'space-between',
    padding: theme.spacing(2),
  },
}));

function Profile() {
  const classes = useStyles();
  const [user, setUser] = useState({
    username: '',
    email: '',
    role: '',
    createdAt: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to fetch profile');
        setOpenSnackbar(true);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:5000/api/users/profile', user, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setMessage('Profile updated successfully');
      setOpenSnackbar(true);
      setIsEditing(false);
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <Container maxWidth="sm">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className={classes.card} elevation={6}>
              <CardContent>
                <Grid container spacing={2} direction="column" alignItems="center">
                  <Grid item>
                    <Avatar className={classes.avatar}>
                      <AccountCircle style={{ fontSize: 64 }} />
                    </Avatar>
                  </Grid>
                  <Grid item xs={12} style={{ width: '100%' }}>
                    <form onSubmit={handleSubmit} className={classes.form}>
                      <TextField
                        name="username"
                        variant="outlined"
                        required
                        fullWidth
                        label="Username"
                        value={user.username}
                        onChange={handleChange}
                        disabled={!isEditing}
                        InputProps={{
                          startAdornment: <AccountCircle color="action" />,
                        }}
                      />
                      <TextField
                        name="email"
                        variant="outlined"
                        required
                        fullWidth
                        label="Email Address"
                        value={user.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        InputProps={{
                          startAdornment: <Email color="action" />,
                        }}
                      />
                      <TextField
                        name="role"
                        variant="outlined"
                        fullWidth
                        label="Role"
                        value={user.role}
                        disabled
                        InputProps={{
                          startAdornment: <Work color="action" />,
                        }}
                      />
                      <TextField
                        name="createdAt"
                        variant="outlined"
                        fullWidth
                        label="Account Created"
                        value={new Date(user.createdAt).toLocaleString()}
                        disabled
                      />
                    </form>
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions className={classes.actions}>
                {!isEditing ? (
                  <IconButton 
                    color="primary" 
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit />
                  </IconButton>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<Save />}
                      onClick={handleSubmit}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<Close />}
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </CardActions>
            </Card>
          </motion.div>
        </Container>
        <Snackbar 
          open={openSnackbar} 
          autoHideDuration={6000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={error ? 'error' : 'success'}
          >
            {error || message}
          </Alert>
        </Snackbar>
      </div>
    </ThemeProvider>
  );
}

export default Profile;