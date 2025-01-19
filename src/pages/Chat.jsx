import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addMessage, setMessages } from '../redux/chatSlice';
import { Box, Container, Divider, Drawer, IconButton, InputBase, List, Paper, Stack, TextField, Tooltip, Typography } from '@mui/material';
import socket from '../Component/conestans/socket';
import { Menu, Send } from '@mui/icons-material';
import { BASE_URL } from '../Component/conestans/baseurl';
import gif from '../../public/Donts_gif_File.gif'

function Chat() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const nav = useNavigate()
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [content, setContent] = useState('');
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [unreadMessages, setUnreadMessages] = useState({}); // لتتبع الرسائل غير المقروءة
    const messagesEndRef = useRef(null); // مرجع نهاية الرسائل
    useEffect(() => {
        if (!user.isAuthenticated) {
            nav("/login");
        } else {
            socket.on("receiveMessage", (message) => {
                if (
                    (message.sender === selectedFriend?._id &&
                        message.receiver === user.user._id) ||
                    (message.sender === user.user._id &&
                        message.receiver === selectedFriend?._id)
                ) {
                    setMessages((prev) => [...prev, message]);
                } else if (message.receiver === user.user._id) {
                    // إذا كانت الرسالة من صديق والشات غير مفتوح
                    setUnreadMessages((prev) => ({
                        ...prev,
                        [message.sender]: (prev[message.sender] || 0) + 1,
                    }));
                }
            });
        }
        return () => {
            socket.off("receiveMessage");
        };
    }, [user, selectedFriend]);
    const handelFrindClick = async (frind) => {
        setSelectedFriend(frind);
        // إزالة العلامة عند فتح الشات
        setUnreadMessages((prev) => {
            const newUnread = { ...prev };
            delete newUnread[frind._id];
            return newUnread;
        });
        try {
            const response = await fetch(
                `${BASE_URL}/chat/${user.user._id}/${frind._id}`
            );
            const data = await response.json();
    setMessages(() => [...data]);
            //setMessages(data);
        } catch (err) {
            console.error("Error fetching messages:", err.message);
        }
    }
    const handleSendMessage = async () => {
        if (!content.trim()) return;

        const messageData = {
            sender: user.user._id,
            receiver: selectedFriend._id,
            content,
        };

        try {
            const response = await fetch(`${BASE_URL}/chat/send-message`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(messageData),
            });

            if (response.ok) {
                const savedMessage = await response.json();
                
               setMessages((prev) => [...prev, savedMessage]); // تحديث الرسائل محليًا
                socket.emit("sendMessage", savedMessage); // إرسال الرسالة للطرف الآخر
                setContent(""); // مسح النص
            }
        } catch (err) {
            console.error("Error sending message:", err.message);
        }
    };
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]); // يتم التمرير عند تحديث الرسائل
    const [open, setOpen] = React.useState(false);

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
            <List sx={{ padding: '20px 10px', textAlign: 'center' }}>
                <Typography sx={{ fontWeight: 'bold' }}>
                    Online Frinds
                </Typography>
                <Divider sx={{ width: '100%', margin: '10px 0' }} />
                <Stack sx={{ gap: 2 }}>
                    {
                        user.user &&
                        user.user.friends.map((frind) => {
                            return (
                                <Paper
                                    onClick={() => { handelFrindClick(frind) }}
                                    sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center', cursor: 'pointer', padding: '10px', position: 'relative', backgroundColor: '#adadad' }} key={frind._id}>
                                    <Box sx={{ width: '50px', height: '50px', borderRadius: '50%' }}>
                                        <img style={{ width: '100%', height: '100%', borderRadius: '50%' }} src={frind.profilePicture} alt='' />
                                    </Box>
                                    <Typography>
                                        {`${frind.firstName} ${frind.lastName}`}
                                    </Typography>
                                    {unreadMessages[frind._id] && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                right: '10px',
                                                top: '10px',
                                                backgroundColor: 'red',
                                                color: 'white',
                                                borderRadius: '50%',
                                                width: '20px',
                                                height: '20px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '12px',
                                            }}
                                        >
                                            {unreadMessages[frind._id]}
                                        </Box>
                                    )}
                                </Paper>
                            )
                        })
                    }
                </Stack>
            </List>
        </Box>
    );

    if (user.isAuthenticated) {
        return (
            <div style={{ marginTop: '64px' }}>
                <Container>
                    <Stack sx={{ height: 'calc(100vh - 64px)', padding: '20px 0' }}>
                        <Stack sx={{ height: '100%' }}>
                            <Stack sx={{ width: '100%', height: '100%', position: 'relative' }}>
                                {selectedFriend ?
                                    <Stack sx={{ height: '100%' }}>
                                        <Stack sx={{ flexDirection: 'row', gap: 2, alignItems: 'center', padding: '10px', backgroundColor: '#b4b4b4', height: '15%' }}>
                                            <Box sx={{ width: '50px', height: '50px', borderRadius: '50%' }}>
                                                <img style={{ width: '100%', height: '100%', borderRadius: '50%' }} src={selectedFriend.profilePicture} alt='' />
                                            </Box>
                                            <Typography>
                                                {`${selectedFriend.firstName} ${selectedFriend.lastName}`}
                                            </Typography>

                                        </Stack>
                                        <Stack sx={{ height: '85%', justifyContent: 'space-between' }}>
                                            <Stack sx={{ overflowY: "auto", padding: "10px", backgroundColor: 'white' }}>
                                                {messages.map((msg, index) => (
                                                    <div
                                                        key={index}
                                                        style={{
                                                            textAlign: msg.sender === user.user._id ? "right" : "left",
                                                            margin: "10px 0",
                                                        }}
                                                    >
                                                        <p
                                                            style={{
                                                                display: "inline-block",
                                                                padding: "10px",
                                                                borderRadius: "10px",
                                                                margin: '0',
                                                                backgroundColor:
                                                                    msg.sender === user.user._id ? "rgb(65 178 8)" : "rgb(0 0 0)",
                                                            }}
                                                        >
                                                            {msg.content}
                                                        </p>
                                                        <span
                                                            style={{
                                                                fontSize: "12px",
                                                                color: "gray",
                                                                display: "block"
                                                            }}
                                                        >
                                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                ))}
                                                <div ref={messagesEndRef} />
                                            </Stack>
                                            <Stack onSubmit={(e) => {
                                                e.preventDefault()
                                                handleSendMessage()
                                            }} component='form' sx={{ flexDirection: 'row', position: 'relative' }}>
                                                <TextField
                                                    sx={{
                                                        "& .MuiFilledInput-root": {
                                                            backgroundColor: "lightblue", // لون الخلفية
                                                            "&:hover": {
                                                                backgroundColor: "lightgreen", // لون الخلفية عند التمرير
                                                            },
                                                            "&.Mui-focused": {
                                                                backgroundColor: "white", // لون الخلفية عند التركيز
                                                            },
                                                        },
                                                    }}
                                                    value={content}
                                                    fullWidth
                                                    onChange={(e) => setContent(e.target.value)}
                                                    placeholder="messeg"
                                                    id="filled-basic" label="messeg" variant="filled" />
                                                <IconButton type='submit' sx={{ position: 'absolute', right: '0', height: '100%', width: '70px', borderRadius: '0!important', backgroundColor: 'green' }}>
                                                    <Send />
                                                </IconButton>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                    : (
                                        <Stack sx={{ height: '100%', width: '100%' }}>
                                            <img style={{ height: '100%', width: '100%' }} src={gif} alt='' />
                                        </Stack>
                                    )
                                }
                                <Tooltip title="Friends List">
                                    <IconButton onClick={toggleDrawer(true)} sx={{ position: 'absolute', backgroundColor: 'white', right: '10px', top: '20px' }}>
                                        <Menu />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </Stack>
                        <Drawer open={open} onClose={toggleDrawer(false)}>
                            {DrawerList}
                        </Drawer>
                    </Stack>
                </Container>
            </div>
        )
    }
}
export default Chat
