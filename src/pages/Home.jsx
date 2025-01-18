import { Container, Stack } from '@mui/material';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CreatPost from '../Component/CreatPost';
import PostList from '../Component/PostList';
import Peoplemayknow from './Peoplemayknow';
import { io } from 'socket.io-client';
const socket = io('http://localhost:3000');
function Home() {
    const user = useSelector((state) => state.user);
    // console.log(user)
    const nav = useNavigate();
    useEffect(() => {
        if (!user.isAuthenticated) {
            nav('/login')
        }
    }, []);

    if (user.isAuthenticated) {
        return (
            <Container>
                <Stack sx={{ marginTop: '65px', gap: 1 }}>
                    <CreatPost />
                    <Peoplemayknow />
                    <PostList />

                </Stack>
            </Container>
        )
    }
}

export default Home