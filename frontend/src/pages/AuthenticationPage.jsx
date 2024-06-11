import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Box, Typography, Paper, Checkbox, FormControlLabel, TextField, CssBaseline, IconButton, InputAdornment, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { LightPurpleButton } from '../utils/buttonStyles';
import { authUser } from '../redux/userHandle';
import styled from 'styled-components';
import Popup from '../components/Popup';

const AuthenticationPage = ({ mode, role }) => {

    const bgpic = "https://images.pexels.com/photos/1121097/pexels-photo-1121097.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { status, currentUser, response, error, currentRole } = useSelector(state => state.user);

    const [toggle, setToggle] = useState(false)
    const [loader, setLoader] = useState(false)
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [fnameError, setFnameError] = useState(false)
    const [lnameError, setLnameError] = useState(false)

    const handleSubmit = (event) => {
        event.preventDefault();

        const email = event.target.email.value;
        const password = event.target.password.value;

        if (!email || !password) {
            if (!email) setEmailError(true);
            if (!password) setPasswordError(true);
            return;
        }

        if (mode === "Register") {
            const fname = event.target.fname.value;
            const lname = event.target.lname.value;

            if (!fname || !lname) {
                if (!fname) setFnameError(true);
                if (!lname) setLnameError(true);
                return;
            }

            const userFields = { fname, lname, email, password, role };
            dispatch(authUser(userFields, role, mode));
        } else if (mode === "Login") {
            const fields = { email, password };
            dispatch(authUser(fields, role, mode));
        }
        setLoader(true);
    };

    const handleInputChange = (event) => {
        const { name } = event.target;
        if (name === 'email') setEmailError(false);
        if (name === 'password') setPasswordError(false);
        if (name === 'fname') setFnameError(false);
        if (name === 'lname') setLnameError(false);
    };

    useEffect(() => {
        if (status === 'success' && currentRole !== null) {
            navigate('/');
        } else if (status === 'failed') {
            setMessage(response);
            setShowPopup(true);
            setLoader(false);
        } else if (status === 'error') {
            setLoader(false);
            setMessage("Network Error");
            setShowPopup(true);
        }
    }, [status, currentUser, currentRole, navigate, error, response]);

    return (
        <>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <StyledTypography>
                            {role} {mode}
                        </StyledTypography>

                        {role === "Customer" && mode === "Register" &&
                            <Typography variant="h7">
                                Register now to explore and buy products.
                            </Typography>
                        }

                        {mode === "Login" &&
                            <Typography variant="h7">
                                Welcome back! Please enter your details
                            </Typography>
                        }

                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
                            {mode === "Register" &&
                                <>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="fname"
                                        label="First Name"
                                        name="fname"
                                        autoComplete="fname"
                                        autoFocus
                                        variant="standard"
                                        error={fnameError}
                                        helperText={fnameError && 'First name is required'}
                                        onChange={handleInputChange}
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="lname"
                                        label="Last Name"
                                        name="lname"
                                        autoComplete="lname"
                                        variant="standard"
                                        error={lnameError}
                                        helperText={lnameError && 'Last name is required'}
                                        onChange={handleInputChange}
                                    />
                                </>
                            }
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Enter your email"
                                name="email"
                                autoComplete="email"
                                variant="standard"
                                error={emailError}
                                helperText={emailError && 'Email is required'}
                                onChange={handleInputChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type={toggle ? 'text' : 'password'}
                                id="password"
                                autoComplete="current-password"
                                variant="standard"
                                error={passwordError}
                                helperText={passwordError && 'Password is required'}
                                onChange={handleInputChange}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setToggle(!toggle)}>
                                                {toggle ? (
                                                    <Visibility />
                                                ) : (
                                                    <VisibilityOff />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Grid container sx={{ display: "flex", justifyContent: "space-between" }}>
                                <FormControlLabel
                                    control={<Checkbox value="remember" color="primary" />}
                                    label="Remember me"
                                />
                            </Grid>
                            <LightPurpleButton
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                {loader ? <CircularProgress size={24} color="inherit" /> : mode}
                            </LightPurpleButton>
                            {role === "Customer" && (
                                <Grid container>
                                    <Grid>
                                        {mode === "Register" ?
                                            "Already have an account?"
                                            :
                                            "Don't have an account?"
                                        }
                                    </Grid>
                                    <Grid item sx={{ ml: 2 }}>
                                        {mode === "Register" ?
                                            <StyledLink to={`/${role}login`}>
                                                Log in
                                            </StyledLink>
                                            :
                                            <StyledLink to={`/${role}register`}>
                                                Sign up
                                            </StyledLink>
                                        }
                                    </Grid>
                                </Grid>
                            )}
                        </Box>
                    </Box>
                </Grid>
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: `url(${bgpic})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
            </Grid>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
}

export default AuthenticationPage

const StyledLink = styled(Link)`
  margin-top: 9px;
  text-decoration: none;
  color: #7f56da;
`;

const StyledTypography = styled.h4`
    margin: 0;
    font-weight: 400;
    font-size: 2.125rem;
    line-height: 1.235;
    letter-spacing: 0.00735em;
    color: #2c2143;
    margin-bottom: 16px;
`;
