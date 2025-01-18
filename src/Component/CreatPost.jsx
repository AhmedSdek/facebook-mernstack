import { Button, InputBase, Paper } from '@mui/material'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from './conestans/baseurl';
import { addPost } from '../redux/postSlice';
// import { addPost } from '../redux/postSlice';

function CreatPost() {
    const [content, setContent] = useState('');
    const user = useSelector((state) => state.user.user);
    // console.log(user)
    const dispatch = useDispatch();

    const handlePost = async (e) => {
        e.preventDefault();
        const userId = user._id; // استبدل هذا بـ userId الفعلي
        try {
            const res = await fetch(`${BASE_URL}/posts/creat-post`, {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                },
                body: JSON.stringify({
                    createdBy: userId,
                    content: content,
                    userId
                }),
            });
            if (!res.ok) {
                throw new Error('Failed to create post');
            }
            const data = await res.json();
            console.log('Post created successfully:', data);
            // أضف البوست إلى Redux
            dispatch(addPost(data));
            // إعادة تعيين النص المدخل
            setContent('');
        } catch (err) {
            console.error('Error creating post:', err);
        }
    };
    return (
        <Paper
            onSubmit={(e) => handlePost(e)}
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}
        >
            <InputBase
                value={content}
                fullWidth
                onChange={(e) => setContent(e.target.value)}
                // sx={{ ml: 1, flex: 1 }}
                placeholder="Post"
                inputProps={{ 'aria-label': 'Post' }}
            />
            <Button type='submit' variant='contained'>Post</Button>
        </Paper>
    )
}

export default CreatPost