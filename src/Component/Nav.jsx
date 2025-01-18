import React, { useEffect, useState } from 'react'
import Badge from '@mui/material/Badge';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Link, useNavigate } from 'react-router-dom';
import { ButtonGroup, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Stack } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useDispatch, useSelector } from 'react-redux';
import { logout, updateFriendRequests, updateFriendsList, updateUser } from '../redux/userSlice';
import Notifications from '@mui/icons-material/Notifications';
import { BASE_URL } from './conestans/baseurl';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import socket from './conestans/socket';
function Nav() {
    const user = useSelector((state) => state.user);
    // console.log(user)
    const dispatch = useDispatch();
    // console.log(newOrdersCount)
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [friendRequests, setFriendRequests] = useState([]);

    // console.log(friendRequests)
    const [anchorElUser, setAnchorElUser] = useState(null);
    const nav = useNavigate();
    const token = localStorage.getItem('token');
    useEffect(() => {
        if (user.isAuthenticated) {
            // استقبال طلبات الصداقة
            socket.on('friendRequestReceived', (data) => {
                // console.log(data);
                dispatch(updateUser(data.data.friend));
            });
            // Cleanup function: إلغاء الاشتراك عندما يتغير الـ user أو عند إلغاء الاشتراك
            return () => {
                socket.off('friendRequestReceived');
            };
        }
    }, []);// جلب التوكن المخزن
    useEffect(() => {
        const fetchFriendRequests = async () => {
            try {
                const res = await fetch(`${BASE_URL}/frindes/get-friend-requests`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                // console.log(data)
                setFriendRequests(data.friendRequests); // تخزين طلبات الصداقة
                // console.log(data.friendRequests)
            } catch (err) {
                console.log(err.message);
            }
        };
        if (user.isAuthenticated) {
            fetchFriendRequests();
        }
    }, [user]);
    // console.log(d.friendRequests)


    const acceptFriendRequest = async (friendId) => {
        try {
            const response = await fetch(`${BASE_URL}/frindes/accept-friend-request`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId: user.user._id,
                    friendId: friendId._id,
                }),
            });
            const data = await response.json();
            if (data.message === 'Friend request accepted successfully') {
                // console.log(data)
                // setFriendRequests(data.data.user.friendRequests);
            } else {
                console.log('Error:', data.message);
            }
            if (response.ok) {
                socket.emit('acceptFriendRequest', { senderId: user.user._id, receiverId: friendId._id, data: data });
                // dispatch(updateFriendRequests(...data.data.user.friendRequests))
                dispatch(updateUser(data.data.user)); // تأكد من إرسال الكائن الكامل للصديق

                // console.log("done")
            } else {
                alert(data.message || "Failed to accept friend request");
            }
        } catch (err) {
            console.error("Error accepting friend request:", err.message);
        }
    };
    const rejectFriendRequest = async (friendId) => {
        try {
            const response = await fetch(`${BASE_URL}/frindes/reject-friend-request`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId: user.user._id,
                    friendId: friendId._id,
                }),
            });
            const data = await response.json();
            if (data.message === 'Friend request rejected successfully') {
                // تم رفض الطلب بنجاح، يمكن هنا تحديث الواجهة أو حالة الطلبات
                console.log('Friend request rejected:', data);
                // تحديث حالة الأصدقاء أو طلبات الأصدقاء في الـ Redux
                dispatch(updateUser(data.data.user)); // تأكد من إرسال الكائن الكامل للصديق
            } else {
                console.log('Error:', data.message);
            }
            if (response.ok) {
                // يمكنك هنا إخبار الـ Socket.io بتحديث حالة الطلب
                socket.emit('rejectFriendRequest', { senderId: user.user._id, receiverId: friendId._id, data: data });

                // تحديث Redux أو حالة الواجهة حسب الحاجة
                // dispatch(updateUser(data.data.user)); 
            } else {
                alert(data.message || "Failed to reject friend request");
            }
        } catch (err) {
            console.error("Error rejecting friend request:", err.message);
        }
    };
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const handelLogout = () => {
        dispatch(logout());
        nav('/login');
        handleCloseUserMenu()
    }

    const [open, setOpen] = React.useState(false);

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };
    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
            <List>
                {friendRequests.map((frind, index) => {
                    return (
                        <ListItem key={index}>
                            <Paper sx={{ width: '100%', padding: '10px' }}>
                                <Stack sx={{ flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                                    <Box sx={{ borderRadius: '50%', width: '50px', height: '50px' }}>
                                        <img style={{ width: '100%' }} src={frind.profilePicture} alt='' />
                                    </Box>
                                    <Stack>
                                        <Typography>
                                            {`${frind.firstName} ${frind.lastName}`}
                                        </Typography>
                                    </Stack>
                                </Stack>
                                <Stack sx={{ display: 'flex', gap: 1, justifyContent: 'space-around', flexDirection: 'row' }}>
                                    <Button onClick={() => {
                                        acceptFriendRequest(frind);
                                    }} variant='contained'>Accept</Button>
                                    <Button onClick={() => {
                                        rejectFriendRequest(frind)
                                    }} variant='contained'>Reject</Button>
                                </Stack>
                            </Paper>
                        </ListItem>
                    )
                })}
            </List>

            <Divider />
        </Box>
    );
    if (user.isAuthenticated) {
        return (
            <>
                <AppBar position="fixed" sx={{ backgroundColor: '#ffffffa8' }}>
                    <Container maxWidth="xl">
                        <Toolbar sx={{ justifyContent: 'space-between' }} disableGutters>
                            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                                <Link to='/'>
                                    <Typography
                                        variant="h5"
                                        noWrap
                                        sx={{
                                            mr: 2,
                                            fontFamily: 'monospace',
                                            fontWeight: "bold",
                                            letterSpacing: '.3rem',
                                            color: '#eb8225',
                                        }}
                                    >
                                        LOGO
                                    </Typography>
                                </Link>
                            </Box>
                            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                                <Link to='/'>
                                    <Typography
                                        variant="h5"
                                        noWrap
                                        sx={{
                                            mr: 2,
                                            fontFamily: 'monospace',
                                            fontWeight: "bold",
                                            letterSpacing: '.3rem',
                                            color: '#eb8225',
                                        }}
                                    >
                                        LOGO
                                    </Typography>
                                </Link>
                            </Box>
                            {user.isAuthenticated ?
                                <Box sx={{ flexGrow: 0 }}>
                                    <Stack sx={{ flexDirection: 'row', gap: 2, alignItems: 'center' }} title="Open settings">
                                        {user.user && user.user.role === 'admin' &&
                                            <IconButton onClick={() => nav('dashboard/orders')} sx={{
                                                backgroundColor: '#bdbdbd',
                                                '&:hover': {
                                                    color: 'white',
                                                    backgroundColor: '#eb8225',
                                                },
                                            }} >
                                                <Badge badgeContent={newOrdersCount} color="error" sx={{
                                                    top: "-17px",
                                                    left: "27px"
                                                }} />
                                                <NotificationsIcon sx={{ color: 'black' }} />
                                            </IconButton>
                                        }
                                        <IconButton
                                            onClick={toggleDrawer(true)}
                                            sx={{
                                                backgroundColor: '#bdbdbd',
                                                '&:hover': {
                                                    color: 'white',
                                                    backgroundColor: '#eb8225',
                                                },
                                            }} >
                                            <Badge badgeContent={friendRequests.length} color="error" sx={{
                                                top: "-17px",
                                                left: "27px"
                                            }} />
                                            <NotificationsIcon sx={{ color: 'black' }} />
                                        </IconButton>
                                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                            <Avatar alt={user.user && user.user.firstName} sx={{ color: 'black' }} src={user.user.profilePicture || '/static/images/avatar/2.jpg'} />
                                        </IconButton>
                                    </Stack>
                                    <Menu
                                        sx={{ mt: '45px' }}
                                        id="menu-appbar"
                                        anchorEl={anchorElUser}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        open={Boolean(anchorElUser)}
                                        onClose={handleCloseUserMenu}
                                    >
                                        <MenuItem onClick={() => {
                                            handleCloseUserMenu();
                                            nav('/profile')
                                        }}>
                                            <Typography sx={{ textAlign: 'center' }}>My Profile</Typography>
                                        </MenuItem>
                                        <MenuItem onClick={() => {
                                            handleCloseUserMenu();
                                            nav('/chat')
                                        }}>
                                            <Typography sx={{ textAlign: 'center' }}>Chat</Typography>
                                        </MenuItem>
                                        <MenuItem onClick={handelLogout}>
                                            <Typography sx={{ textAlign: 'center' }}>Logout</Typography>
                                        </MenuItem>
                                        {user.user && user.user.role === 'admin' &&
                                            <MenuItem onClick={habdelDashboard}>
                                                <Typography sx={{ textAlign: 'center' }}>Dashboard</Typography>
                                            </MenuItem>
                                        }
                                    </Menu>
                                </Box>
                                :
                                <Box sx={{ flexGrow: 0 }}>
                                    <Tooltip title="Open settings">
                                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                            <Avatar alt='c' src="/static/images/avatar/2.jpg" />
                                        </IconButton>
                                    </Tooltip>
                                    <Menu
                                        sx={{ mt: '45px' }}
                                        id="menu-appbar"
                                        anchorEl={anchorElUser}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        open={Boolean(anchorElUser)}
                                        onClose={handleCloseUserMenu}
                                    >
                                        {/* <MenuItem onClick={handleCloseUserMenu}>
                                        <Link to='/profile' sx={{ textAlign: 'center' }}>Profile</Link>
                                    </MenuItem> */}
                                        <MenuItem onClick={handleCloseUserMenu}>
                                            <Link to='/login' sx={{ textAlign: 'center' }}>login</Link>
                                        </MenuItem>
                                        <MenuItem onClick={handleCloseUserMenu}>
                                            <Link to='/register' sx={{ textAlign: 'center' }}>Register</Link>
                                        </MenuItem>
                                    </Menu>
                                </Box>
                            }
                        </Toolbar>
                    </Container>
                </AppBar>
                <Drawer open={open} onClose={toggleDrawer(false)}>
                    {DrawerList}
                </Drawer>
            </>
        )
    }
}

export default Nav