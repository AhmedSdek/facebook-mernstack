import { configureStore } from '@reduxjs/toolkit';
import userReducer from './redux/userSlice';
import postReducer from './redux/postSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        posts: postReducer,
    },
});

export default store;
