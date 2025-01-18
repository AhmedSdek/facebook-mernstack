/* eslint-disable no-unused-vars */

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { Box, Button, Card, IconButton, Stack, TextField, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import AuthModel from "./AuthModel";
import { BASE_URL } from "../../Component/conestans/baseurl";
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from "../../redux/userSlice";
import socket from "../../Component/conestans/socket";
function Login() {
    const [email, setEmail] = useState('');
    const [restEmail, setRestEmail] = useState('');
    const [btn, setBtn] = useState(false);
    const [password, setPassword] = useState('');
    const [err, setErr] = useState('');
    const nav = useNavigate()
    const [hiden, setHiden] = useState('hiden');
    const [messege, setMessage] = useState(false);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);

    // console.log(user.isAuthenticated)
    useEffect(() => {
        if (user.isAuthenticated) {
            nav('/')
        }
    }, []);
    if (!user.isAuthenticated) {
        return (
            <>
                <AuthModel hiden={hiden}>
                    <Card>
                        <Stack component='form' onSubmit={async (e) => {
                            e.preventDefault()
                            const response = await fetch(`${BASE_URL}/user/request-password-reset`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ email: restEmail }),
                            });
                            const data = await response.json();
                            setMessage(data.message);
                        }} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: '30px 10px' }}>
                            <IconButton sx={{ position: 'absolute', top: '2px', right: '2px' }} onClick={() => {
                                setHiden('hiden')
                            }}>
                                <Close />
                            </IconButton>
                            <TextField
                                sx={{ margin: '10px', padding: '5px', width: { xs: '100%', md: '50%' } }}
                                onChange={(e) => {
                                    setRestEmail(e.target.value);
                                }}
                                id="u" label="Email" variant="outlined" type="email" />
                            <Button type="submit" style={{ width: '50%' }} className="btn">
                                Reset Password
                            </Button>
                            {messege &&
                                <p style={{ color: 'black', margin: '10px' }}>{messege}</p>
                            }
                        </Stack>
                    </Card>

                </AuthModel>

                <Box style={{ width: '100%', display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
                    <Card sx={{ width: { xs: '90%', sm: '80%' }, display: 'flex', alignItems: 'center', flexDirection: 'column', padding: '20px' }}>
                        <Box component='form'
                            onSubmit={async (e) => {
                                e.preventDefault();
                                try {
                                    const res = await fetch(`${BASE_URL}/auth/login`, {
                                        method: 'POST',
                                        headers: {
                                            "Content-Type": 'application/json'
                                        },
                                        body: JSON.stringify({
                                            email,
                                            password,
                                        })
                                    });
                                    if (!res.ok) {
                                        const token = await res.json();
                                        // console.log(token)
                                        setErr(token.message)
                                        return;
                                    }
                                    const token = await res.json();
                                    if (!token) {
                                        setErr('Incorrect token')
                                    }
                                    console.log(token)
                                    dispatch(setUser(token));
                                    socket.emit('registerUser', token.user._id);
                                    window.location.href = '/'
                                    // nav('/')
                                } catch (err) {
                                    console.log(err)
                                }
                            }}
                            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: '100%' }}>
                            <Typography variant="h5" component='h4'>Log In</Typography>
                            <TextField
                                sx={{ margin: '10px', padding: '5px', width: { xs: '100%', md: '50%' } }}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                                id="user" label="Email" variant="outlined" type="text" />
                            <TextField
                                sx={{ margin: '10px', padding: '5px', width: { xs: '100%', md: '50%' } }}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
                                id="password" label="Password" variant="outlined" type="password" />
                            {
                                err &&
                                <p>{err}</p>
                            }
                            <Button type="submit" variant="contained" style={{ width: '50%' }} className="btn">
                                {btn ? '' : "login"}
                            </Button>
                            <Button onClick={() => {
                                setHiden('show')
                            }} style={{ margin: '10px', color: 'red', cursor: 'pointer' }}>
                                Forget Pass
                            </Button>
                            <p style={{ margin: '10px' }}>
                                Dont have an Acount <Link to='/register' >
                                    <Button>
                                        Register
                                    </Button>
                                </Link>
                            </p>
                        </Box>
                    </Card>
                </Box>
            </>
        )
    }
}

export default Login