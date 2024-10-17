import { Box, CircularProgress } from "@mui/material";

export default function LoadingBox() {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                minWidth: '100vw',
            }}
        >
            <CircularProgress />
        </Box>
    );
}