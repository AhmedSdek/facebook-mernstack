import { Box } from "@mui/material";

export default function AuthModel({ children, hiden }) {
    return (
        <div className={`${hiden}`} style={{ width: '100%', height: '100%', position: 'fixed', display: 'flex', alignItems: 'center', zIndex: '100000', justifyContent: 'center', backgroundColor: 'rgb(0 0 0 / 59%)' }}>
            <Box sx={{ width: { xs: '90%', sm: '70%', md: '50%' }, height: '50%', position: 'relative' }}>
                {children}
            </Box>
        </div>
    )
}
