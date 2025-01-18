import { Avatar, Box, Card, CardActionArea, CardActions, CardContent, CardHeader, CardMedia, Container, IconButton, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CreatPost from '../Component/CreatPost';
import { BASE_URL } from '../Component/conestans/baseurl';
import MoreVert from '@mui/icons-material/MoreVert';
import Favorite from '@mui/icons-material/Favorite';
import Share from '@mui/icons-material/Share';
import { setError, setLoading, setMyPosts } from '../redux/postSlice';
import { updateFriendsList } from '../redux/userSlice';

function Profile() {
    const dispatch = useDispatch();
    const { myPosts, loading, error } = useSelector((state) => state.posts);
    const token = localStorage.getItem('token'); // جلب التوكن المخزن
    const user = useSelector((state) => state.user);
    const [friends, setFriends] = useState([]);
    const nav = useNavigate()
    useEffect(() => {
        if (!user.isAuthenticated) {
            nav('/login')
        }
    }, []);
    // دالة لجلب بوستات المستخدم
    const fetchMyPosts = async () => {
        dispatch(setLoading(true)); // تغيير حالة التحميل
        try {
            const response = await fetch(`${BASE_URL}/posts/my-posts`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch my posts');
            }
            const data = await response.json();
            dispatch(setMyPosts(data)); // تخزين البيانات في الـ Redux Store
        } catch (error) {
            dispatch(setError(error.message)); // تخزين رسالة الخطأ في الـ Redux Store
        } finally {
            dispatch(setLoading(false)); // إنهاء حالة التحميل
        }
    };
    useEffect(() => {
        if (token) {
            fetchMyPosts(); // جلب البوستات الخاصة بالمستخدم عند تحميل الصفحة
        }
    }, [dispatch, token]);
    const fetchFriends = async () => {
        try {
            const response = await fetch(`${BASE_URL}/auth/friends`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setFriends(data.friends);
                dispatch(updateFriendsList(data.friends));
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    };

    useEffect(() => {
        fetchFriends();
    }, []);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    if (user.isAuthenticated) {
        return (
            <Stack sx={{ marginTop: '65px' }}>
                <Container>
                    <Stack sx={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                        <Box sx={{ width: '100px', height: '100px', borderRadius: '50%' }}>
                            <img style={{ width: '100%', height: '100%', borderRadius: '50%' }} src={user.user.profilePicture} alt='' />
                        </Box>
                        <Stack>
                            <Typography>
                                {`${user.user.firstName} ${user.user.lastName}`}
                            </Typography>
                            <Typography>
                                {`${user.user.friends.length} Frinds`}
                            </Typography>
                        </Stack>
                    </Stack>
                    <Stack>
                        <Typography>
                            Frind List
                        </Typography>
                        <Stack sx={{ justifyContent: 'center', alignItems: 'center', gap: 1, width: '100%', flexDirection: 'row', margin: '10px 0' }}>
                            {friends &&
                                friends.map((frind) => {
                                    // console.log(frind)
                                    return (
                                        <Card key={frind._id} sx={{ width: 200 }}>
                                            <CardActionArea sx={{ display: 'flex', flexDirection: 'column' }}>
                                                <Box sx={{ height: '100px' }}>
                                                    <CardMedia
                                                        sx={{ width: '100%', height: '100%' }}
                                                        component="img"
                                                        image={frind.profilePicture}
                                                        alt="green iguana"
                                                    />
                                                </Box>
                                                <CardContent>
                                                    <Typography gutterBottom variant="h5" component="div">
                                                        {`${frind.firstName} ${frind.lastName}`}
                                                    </Typography>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>
                                    )
                                })
                            }
                        </Stack>
                    </Stack>
                    <Stack sx={{ justifyContent: 'center', alignItems: 'center', gap: 1, width: '100%' }}>
                        <CreatPost />
                        <Stack sx={{ justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                            {myPosts.map((post) => {
                                // console.log(post)
                                return (
                                    <Card key={post._id} sx={{ width: 400 }}>
                                        <CardHeader
                                            avatar={
                                                <Avatar sx={{ background: 'red' }} aria-label="recipe" src={post.createdBy.profilePicture} />
                                            }
                                            action={
                                                <IconButton aria-label="settings">
                                                    <MoreVert />
                                                </IconButton>
                                            }
                                            title={`${post.createdBy.firstName}  ${post.createdBy.lastName}`}
                                            subheader={new Date(post.createdAt).toLocaleString()}
                                        />
                                        <CardMedia
                                            component="img"
                                            height="194"
                                            image="/static/images/cards/paella.jpg"
                                            alt="Paella dish"
                                        />
                                        <CardContent>
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                {post.content}
                                            </Typography>
                                        </CardContent>
                                        <CardActions disableSpacing>
                                            <IconButton aria-label="add to favorites">
                                                <Favorite />
                                            </IconButton>
                                            <IconButton aria-label="share">
                                                <Share />
                                            </IconButton>
                                        </CardActions>
                                    </Card>
                                )
                            }
                            )}
                        </Stack>
                    </Stack>
                </Container>
            </Stack>
        )
    }
}

export default Profile