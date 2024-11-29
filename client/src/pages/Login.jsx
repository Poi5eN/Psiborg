import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Box, 
  Paper,
  Snackbar,
  Alert,
  InputAdornment,
  IconButton,
  Divider
} from '@mui/material';
import { 
  Email as EmailIcon, 
  Lock as LockIcon, 
  Visibility, 
  VisibilityOff,
  LoginRounded as LoginIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import * as Yup from 'yup';
import axios from 'axios';
import { AuthContext } from '../components/AuthContext';

// Validation schema
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
});

function Login() {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Validate fields
      await loginSchema.validate({ email, password }, { abortEarly: false });
      
      // Clear previous validation errors
      setValidationErrors({ email: '', password: '' });

      // Attempt login
      const response = await axios.post('http://localhost:5000/api/auth/login', { 
        email, 
        password 
      });

      // Store token and user info
      login(response.data.token, response.data.user);
      
      // Redirect to dashboard
      history.push('/dashboard');

    } catch (err) {
      // Handle Yup validation errors
      if (err.name === 'ValidationError') {
        const errors = {};
        err.inner.forEach(error => {
          errors[error.path] = error.message;
        });
        setValidationErrors(errors);
      } else {
        // Handle API login errors
        setError(err.response?.data?.message || 'Login failed');
      }
      setIsLoading(false);
    }
  };

  // const handleGoogleLogin = () => {
  //   // Implement Google OAuth login logic
  //   window.location.href = 'http://localhost:5000/api/auth/google';
  // };

  // const handleGitHubLogin = () => {
  //   // Implement GitHub OAuth login logic
  //   window.location.href = 'http://localhost:5000/api/auth/github';
  // };

  return (
    <Container component="main" maxWidth="xs">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper 
          elevation={6} 
          sx={{ 
            marginTop: 8, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            padding: 4,
            borderRadius: 3
          }}
        >
          <Typography 
            component="h1" 
            variant="h4" 
            sx={{ 
              mb: 3, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1 
            }}
          >
            <LoginIcon fontSize="large" />
            Sign In
          </Typography>
          
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!validationErrors.email}
              helperText={validationErrors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!validationErrors.password}
              helperText={validationErrors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <Box textAlign="right" my={1}>
              <Link 
                to="/forgot-password" 
                style={{ 
                  textDecoration: 'none', 
                  color: 'primary', 
                  fontSize: '0.875rem' 
                }}
              >
                Forgot Password?
              </Link>
            </Box>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 2, mb: 2, py: 1.5 }}
                startIcon={<LoginIcon />}
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </motion.div>
            
            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>
            
            {/* <Box display="flex" justifyContent="center" gap={2}>
              <Button
                variant="outlined"
                startIcon={<GoogleIcon />}
                color="error"
                onClick={handleGoogleLogin}
                sx={{ flex: 1 }}
              >
                Google
              </Button>
              <Button
                variant="outlined"
                startIcon={<GitHubIcon />}
                color="secondary"
                onClick={handleGitHubLogin}
                sx={{ flex: 1 }}
              >
                GitHub
              </Button>
            </Box> */}
            
            <Box mt={2} textAlign="center">
              <Typography variant="body2">
                Don't have an account? {' '}
                <Link 
                  to="/register" 
                  style={{ 
                    textDecoration: 'none', 
                    color: 'primary' 
                  }}
                >
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </motion.div>

      {error && (
        <Snackbar 
          open={!!error} 
          autoHideDuration={6000} 
          onClose={() => setError('')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setError('')} 
            severity="error"
          >
            {error}
          </Alert>
        </Snackbar>
      )}
    </Container>
  );
}

export default Login;