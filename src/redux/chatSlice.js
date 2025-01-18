import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    messages: [],
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setMessages: (state, action) => {
            state.messages = action.payload; // تحديث الرسائل
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload); // إضافة رسالة جديدة
        },
    },
});

export const { setMessages, addMessage } = chatSlice.actions;
export default chatSlice.reducer;