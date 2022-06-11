import { Avatar, Box, Button, Checkbox, Container, CssBaseline, FormControlLabel, Grid, TextField, Typography } from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import agent from "../../api/agent";


type FormValues = {
    username: string;
    password: string;
}

export default function Login() {
    const history = useHistory();
    const {register, handleSubmit, setError, formState: {isSubmitting, errors, isValid}} = useForm<FormValues>({
        mode: 'all'
    });

    async function submitForm(data: FieldValues) {
        try {
            const userDto = await agent.Account.login(data);
            localStorage.setItem('user', JSON.stringify(userDto));
            history.push('/');
        } catch (error: any) {
            handleApiError(error);
        }
    }
    function handleApiError(error: any) {
        console.log('dfsdf', error);
    }

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
                            <Link to="/register">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Container>
    )

}