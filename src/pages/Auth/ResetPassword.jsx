import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Stack, TextField } from "@mui/material";
import { BASE_URL } from "../../Component/conestans/baseurl";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const { search } = useLocation();
    const navigate = useNavigate();

    const token = new URLSearchParams(search).get("token");
    console.log("Token:", token);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`${BASE_URL}/auth/reset-password?token=${token}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ newPassword: password }),
        });

        const data = await response.json();
        setMessage(data.message);

        if (response.ok) {
            setTimeout(() => navigate("/login"), 2000);
        }
    };

    return (
        <Stack sx={{ justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '10px' }}>
            <Stack component='form' sx={{ width: '100%', gap: 2 }} onSubmit={handleSubmit}>
                <TextField
                    type="password"
                    fullWidth
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button type="submit" variant="contained">Reset Password</Button>
            </Stack>
            {message && <p>{message}</p>}
        </Stack>
    );
};

export default ResetPassword;