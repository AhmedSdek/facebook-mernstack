import React, { useState } from 'react'
import { useEffect } from 'react'
import { BASE_URL } from '../Component/conestans/baseurl';
import { Box, Button, Card, CardActions, CardContent, CardMedia, Paper, Stack, Typography } from '@mui/material';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

import './styles.css';

// import required modules
import { FreeMode } from 'swiper/modules';
import { useDispatch, useSelector } from 'react-redux';
import { updateSentRequests, updateUser } from '../redux/userSlice';
import socket from '../Component/conestans/socket';
function Peoplemayknow() {
    const user = useSelector((state) => state.user.user); // الحصول على بيانات المستخدم
    // console.log(user)
    const [data, setData] = useState([]);
    const token = localStorage.getItem('token'); // جلب التوكن المخزن
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = user._id; // جلب معرف المستخدم الحالي
                const response = await fetch(`${BASE_URL}/auth/all-users?userId=${userId}`); // تمرير معرف المستخدم
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const jsonData = await response.json();
                // console.log(jsonData)
                setData(jsonData); // Set fetched data to state
            } catch (err) {
                console.log(err.message); // Set error message if fetch fails
            }
        };
        fetchData();
    }, [user]);
    useEffect(() => {
        // استقبال طلبات الصداقة
        socket.on('friendRequestAccepted', (data) => {
            // console.log(data)
            dispatch(updateUser(data.data.data.friend));
        });
        // Cleanup function: إلغاء الاشتراك عندما يتغير الـ user أو عند إلغاء الاشتراك
        return () => {
            socket.off('friendRequestAccepted');
        };
    }, []);
    useEffect(() => {
        // استقبال طلبات الصداقة
        socket.on('friendRequestRejected', (data) => {
            dispatch(updateUser(data.data.data.friend));
        });
        // Cleanup function: إلغاء الاشتراك عندما يتغير الـ user أو عند إلغاء الاشتراك
        return () => {
            socket.off('friendRequestRejected');
        };
    }, []);
    const handleAddFriend = async (friend) => {
        try {
            const res = await fetch(`${BASE_URL}/frindes/send-friend-request`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId: user._id,
                    friendId: friend._id,
                }),
            });
            const responseData = await res.json();
            // console.log(responseData)
            if (res.ok) {
                // alert('Friend request sent successfully');
                // dispatch(setUser(token));
                dispatch(updateSentRequests(friend._id)); // تحديث Redux
                // إرسال الطلب عبر Socket.io
                socket.emit('sendFriendRequest', { senderId: user._id, receiverId: friend._id, data: responseData.data });
            } else {
                alert(responseData.message);
            }
        } catch (err) {
            console.log('Error adding friend', err);
        }
    };
    // // دالة للتحقق إذا كنت قد أرسلت طلب صداقة
    const isRequestSent = (friend) => {
        return user.sentRequests.includes(friend._id); // تحقق إذا كنت قد أرسلت طلب صداقة
    };
    // دالة للتحقق إذا كان الصديق قد أرسل لك طلب صداقة
    const isRequest = (friend) => {
        return user.friendRequests.includes(friend._id); // تحقق إذا كان الصديق قد أرسل لك طلب صداقة
    };
    const isFriend = (friend) => {
        return user.friends.some((f) => f._id === friend._id); // تحقق إذا كان الصديق موجودًا في قائمة الأصدقاء
    };
    // الحصول على النص واللون بناءً على حالة الطلب
    const getButtonText = (friend) => {
        if (isRequest(friend)) {
            return "your frind sent req "; // إذا كان الصديق قد أرسل لك طلب
        } else if (isRequestSent(friend)) {
            return "req sent"; // إذا كنت قد أرسلت طلب صداقة
        } else if (isFriend(friend)) {
            return "Frind";
        } else {
            return "Add frind"; // إذا لم يكن هناك أي طلب
        }
    };

    // const getButtonColor = (friend) => {
    //     if (isRequest(friend)) {
    //         return "gray"; // يمكن تخصيص اللون كما تفضل
    //     } else if (isRequestSent(friend)) {
    //         return "blue"; // يمكن تخصيص اللون كما تفضل
    //     } else {
    //         return "green"; // اللون المعتاد لزر الإرسال
    //     }
    // };
    return (
        <Stack sx={{ padding: '10px', gap: 2 }}>
            <Typography sx={{ textAlign: 'start' }}>
                Peoplemayknow
            </Typography>
            <Box>
                <Swiper
                    slidesPerView={3}
                    spaceBetween={30}
                    breakpoints={{
                        250: {
                            slidesPerView: 2,
                            spaceBetween: 10,
                        },
                        640: {
                            slidesPerView: 2,
                            spaceBetween: 10,
                        },
                        768: {
                            slidesPerView: 3,
                            spaceBetween: 10,
                        },
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 10,
                        },
                    }}
                    freeMode={true}
                    // style={{ height: '300px' }}
                    modules={[FreeMode]}
                    className="mySwiper"
                >
                    {data &&
                        data.map((item) => {
                            // console.log(item)
                            return (
                                <SwiperSlide style={{ height: 'initial' }} key={item._id}>
                                    <Card sx={{ width: "100%", height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <Stack>
                                            <CardMedia
                                                component="div"
                                                sx={{ height: 250 }}
                                                image={`${item.profilePicture}`}
                                                title={`${item.firstName} ${item.lastName}`}
                                            />
                                            <Box sx={{ padding: '0', margin: 0 }}>
                                                <Typography sx={{ margin: '0', fontWeight: 'bold', padding: '0' }} variant="h6" >
                                                    {`${item.firstName} ${item.lastName}`}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                        <CardActions>
                                            <Button
                                                onClick={() => {
                                                    handleAddFriend(item)
                                                }}
                                                sx={{ width: '100%' }}
                                                variant="contained"
                                                disabled={isRequestSent(item) || isFriend(item) || isRequest(item)} // تعيين التعطيل بناءً على الحالة
                                            >
                                                {getButtonText(item)}
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </SwiperSlide>
                            )
                        })
                    }
                </Swiper>
            </Box>
        </Stack >
    )
}

export default Peoplemayknow