import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // تعديل الرابط حسب خادمك

export default socket;