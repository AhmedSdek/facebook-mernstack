import { io } from 'socket.io-client';

const socket = io('https://facebook-backend-production-110d.up.railway.app'); // تعديل الرابط حسب خادمك

export default socket;