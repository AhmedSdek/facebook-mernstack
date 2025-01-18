import { createSlice } from '@reduxjs/toolkit';

const postSlice = createSlice({
    name: 'posts',
    initialState: {
        allPosts: [], // لتخزين جميع البوستات
        myPosts: [],  // لتخزين بوستات المستخدم
        loading: false,
        error: null,
    },
    reducers: {
        setAllPosts: (state, action) => {
            state.allPosts = action.payload;
        },
        setMyPosts: (state, action) => {
            state.myPosts = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        addPost: (state, action) => {
            // console.log(action.payload)
            state.myPosts.unshift(action.payload); // إضافة البوست الجديد في بداية القائمة
            state.allPosts.unshift(action.payload); // إضافة البوست الجديد في جميع البوستات
        },
    },
});

export const { setAllPosts, setMyPosts, setLoading, setError, addPost } = postSlice.actions;
export default postSlice.reducer;