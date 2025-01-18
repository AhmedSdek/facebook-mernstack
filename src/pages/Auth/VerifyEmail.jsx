import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../Component/conestans/baseurl';

const VerifyEmail = () => {
    const [message, setMessage] = useState('');
    const { search } = useLocation();  // الحصول على الـ query string من الـ URL

    // استخراج الـ token من الـ URL
    const queryParams = new URLSearchParams(search);
    const token = queryParams.get('token');
    const nav = useNavigate()
    useEffect(() => {
        const verfy = async () => {
            try {
                // التأكد من أن الـ token موجود
                if (token) {
                    // إرسال الـ token إلى الـ Backend للتحقق من التفعيل
                    const res = await fetch(`${BASE_URL}/auth/verify-email?token=${token}`, {
                        method: 'GET',
                    });
                    if (!res.ok) {
                        setMessage('Invalid or expired verification link.');
                    }
                    setMessage('Email verified successfully!');
                    // بعد التحقق بنجاح، يمكنك توجيه المستخدم إلى صفحة أخرى
                    setTimeout(() => {
                        nav('/login');  // على سبيل المثال، توجيه المستخدم إلى صفحة تسجيل الدخول
                    }, 2000);
                    const json = res.json();
                } else {
                    setMessage('Invalid verification link.');
                }
            } catch (err) {
                setMessage('Something went wrong. Please try again later.');
            }
        }
        verfy()
    }, []);

    return (
        <div>
            <h1>Verify Your Email</h1>
            <p>{message}</p>
        </div>
    );
};

export default VerifyEmail;