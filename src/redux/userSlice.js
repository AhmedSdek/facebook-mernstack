import { createSlice } from '@reduxjs/toolkit';
// تحسين كود Redux Slice
const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('token', action.payload.token);
        },
        updateUser: (state, action) => {
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
        updateSentRequests: (state, action) => {
            state.user.sentRequests = [...state.user.sentRequests, action.payload];
            localStorage.setItem('user', JSON.stringify(state.user));
        },
        updateFriendRequests: (state, action) => {
            console.log(action.payload)
            state.user.friendRequests = [...state.user.friendRequests, action.payload];
            localStorage.setItem('user', JSON.stringify(state.user));
        },
        updateFriendsList: (state, action) => {
            console.log(action.payload)
            // التأكد أن `action.payload` هو Array
            const newFriends = Array.isArray(action.payload) ? action.payload : [];
            // التحقق من الأصدقاء الجدد وإضافتهم فقط إذا لم يكونوا موجودين
            newFriends.forEach((newFriend) => {
                const isAlreadyFriend = state.user.friends.some(
                    (friend) => friend._id === newFriend._id
                );
                if (!isAlreadyFriend) {
                    state.user.friends.push(newFriend);
                }
            });
            // تحديث قوائم الطلبات المرسلة والواردة
            state.user.sentRequests = state.user.sentRequests.filter(
                (request) => request._id !== action.payload._id
            );
            state.user.friendRequests = state.user.friendRequests.filter(
                (request) => request._id !== action.payload._id
            );
            // تحديث التخزين المحلي
            localStorage.setItem('user', JSON.stringify(state.user));

            // state.user.sentRequests = state.user.sentRequests.filter(
            //     (request) => request._id !== action.payload._id
            // );
            // state.user.friendRequests = state.user.friendRequests.filter(
            //     (request) => request._id !== action.payload._id
            // );
            // localStorage.setItem('user', JSON.stringify(state.user));
        },
    },
});

export const { setUser, logout, updateSentRequests, updateFriendsList, updateFriendRequests, updateUser } = userSlice.actions;
export default userSlice.reducer;