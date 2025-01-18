import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Auth/Register'
import Login from './pages/Auth/Login'
import Profile from './pages/Profile'
import Chat from './pages/Chat'
import Nav from './Component/Nav'
import VerifyEmail from './pages/Auth/VerifyEmail'
import Verfy from './Component/Verfy'
import ResetPassword from './pages/Auth/ResetPassword'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import socket from './Component/conestans/socket'
import { BASE_URL } from './Component/conestans/baseurl'
import { setUser, updateUser } from './redux/userSlice'

function App() {
  const user = useSelector((state) => state.user);
  const token = localStorage.getItem('token');
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const getMyData = async () => {
  //     try {
  //       const res = await fetch(`${BASE_URL}/auth/my-user`, {
  //         method: 'GET',
  //         headers: {
  //           "Content-Type": "application/json",
  //           "Authorization": `Bearer ${token}`,
  //         }
  //       });
  //       if (!res.ok) {
  //         // const data = await res.json();
  //         console.log('err')
  //         // setErr(token.message)
  //         return;
  //       }
  //       const data = await res.json();
  //       console.log(data)
  //       if (!token) {
  //         // setErr('Incorrect token')
  //         console.log("err")
  //       }
  //       dispatch(updateUser(data));
  //       // window.location.href = '/'
  //       // nav('/')
  //     } catch (err) {
  //       console.log(err)
  //     }
  //   }
  //   if (user.isAuthenticated) {
  //     getMyData();
  //   }
  // }, []);
  useEffect(() => {
    if (user.isAuthenticated) {
      socket.emit('registerUser', user.user._id);
    }
    // تسجيل المستخدم عند الاتصال
  }, [user]);
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/verfy" element={<Verfy />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/chat' element={<Chat />} />
      </Routes>
    </>
  )
}

export default App
