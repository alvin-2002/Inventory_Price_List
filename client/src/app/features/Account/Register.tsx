import { Container, Typography, Box, TextField, Button, Grid } from "@mui/material";
import { useForm, FieldValues } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import agent from "../../api/agent";
import { useAppSelector } from "../../store/configureStore";

type FormValues = {
    username: string;
    email: string;
    password: string;
}

export default function Register() {
    const history = useHistory();
    const {user} = useAppSelector(state => state.account);
    const {register, handleSubmit, setError, formState: {isSubmitting, errors, isValid}} = useForm<FormValues>({
        mode: 'all'
    });

    function handleApiErrors(errors: any) {
        if (errors) {
            errors.forEach((error: string) => {
                if (error.includes('Password')) {
                  setError('password', {message: error});
                } else if (error.includes('Email')) {
                  setError('email', {message: error})
                } else if (error.includes('Username')) {
                  setError('username', {message: error})
                }
            })
        }
    }

    async function submitForm(data: FieldValues) {
        agent.Account.register(data)
            .then(() => {
                console.log('success');
                history.push('/login');
            })
            .catch(error => handleApiErrors(error));
    }

    if (user) return (
        <h1>User already Logged In.</h1>
    )
    
    return (
        <Container component="main" sx={{
            display: 'flex',
            height: '80vh',
            flexDirection: 'column',
            justifyContent: 'center',
       
        }}>
            <Container maxWidth="xs" sx={{
                p: 7,
                borderRadius: '4px',
                bgcolor: '#FAFAFA',
                textAlign: 'center'
            }}>

                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" onSubmit={handleSubmit(submitForm)} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Username"
                        autoFocus
                        {...register('username', {required: 'Username is required'})}
                        error={!!errors.username}
                        helperText={errors?.username?.message}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Email address"
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^\w+[\w-.]*@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/,
                                message: 'Not a valid email address'
                            }
                        })}
                        error={!!errors.email}
                        helperText={errors?.email?.message}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Password"
                        type="password"
                        {...register('password', {required: 'Password is required'})}
                        error={!!errors.password}
                        helperText={errors?.password?.message}
                    />
                    {/* <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    /> */}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item>
                            <Link to="/login">
                                {"Already have an account? Sign In"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Container>
    )
}