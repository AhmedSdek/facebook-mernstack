import { io } from 'socket.io-client';

// const socket = io('https://facebook-backend-production-110d.up.railway.app'); // تعديل الرابط حسب خادمك
const socket = io(`https://facebook-backend-production-110d.up.railway.app`, {
    transports: ["websocket", "polling"], // دعم النقل عبر Polling وWebSocket
    withCredentials: true
});
export default socket;