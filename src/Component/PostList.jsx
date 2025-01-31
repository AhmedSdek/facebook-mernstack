import { useDispatch, useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { setAllPosts, setLoading } from '../redux/postSlice';
import { BASE_URL } from './conestans/baseurl';
import moment from 'moment';

const PostList = () => {
    const dispatch = useDispatch();
    const { allPosts, loading, error } = useSelector((state) => state.posts)
    const token = localStorage.getItem('token'); // جلب التوكن المخزن
    // دالة لجلب جميع البوستات
    const fetchAllPosts = async () => {
        dispatch(setLoading(true)); // تغيير حالة التحميل
        try {
            const response = await fetch(`${BASE_URL}/posts`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            const data = await response.json();
            // console.log(data)
            // ترتيب البوستات من الأحدث إلى الأقدم
            const sortedPosts = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            dispatch(setAllPosts(sortedPosts)); // تخزين البيانات في الـ Redux Store
        } catch (error) {
            dispatch(setError(error.message)); // تخزين رسالة الخطأ في الـ Redux Store
        } finally {
            dispatch(setLoading(false)); // إنهاء حالة التحميل
        }
    };

    useEffect(() => {
        if (token) {
            fetchAllPosts(); // جلب البوستات عند تحميل الصفحة
        }
    }, [dispatch, token]);


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    return (
        <Stack sx={{ justifyContent: 'center', alignItems: 'center', gap: 1 }}>
            {allPosts.length === 0 ? (
                <p>No posts found.</p>
            ) :
                allPosts.map((post) => {
                    // console.log(post)
                    return (
                        <Card key={post._id} sx={{ width: "100%", padding: '12px' }}>
                            <Stack sx={{ flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: red[500] }} src={post.createdBy.profilePicture} aria-label="recipe" />
                                <Stack sx={{ alignItems: 'start' }}>
                                    <Typography sx={{ fontWeight: 'bold', fontSize: '15px' }}>
                                        {`${post.createdBy.firstName}  ${post.createdBy.lastName}`}
                                    </Typography>
                                    <Typography variant='caption' sx={{ fontSize: '13px' }}>
                                        {moment(post.createdAt).fromNow()}
                                    </Typography>
                                </Stack>
                            </Stack>
                            {post.image &&
                            <CardMedia
                                component="img"
                                height="194"
                                image="/static/images/cards/paella.jpg"
                                alt="Paella dish"
                            />
                            }
                            <CardContent sx={{ textAlign: 'start' }}>
                                <Typography sx={{
                                    fontSize: '15px',
                                    color: '#080809',
                                    fontWeight: 'bold',
                                    direction: /[\u0600-\u06FF]/.test(post.content) ? 'rtl' : 'ltr',
                                    textAlign: /[\u0600-\u06FF]/.test(post.content) ? 'right' : 'left',
                                    whiteSpace: 'pre-wrap',
                                }}>
                                    {post.content} 
                                </Typography>
                            </CardContent>
                            <CardActions disableSpacing>
                                <IconButton aria-label="add to favorites">
                                    <FavoriteIcon />
                                </IconButton>
                                <IconButton aria-label="share">
                                    <ShareIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    )
                })
            }
        </Stack>

    );
};

export default PostList;