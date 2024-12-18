"use client";

import { signIn } from "next-auth/react"
import { Box, Button } from "@mui/material";
import GoogleIcon from "./icons/GoogleIcon";

export default function SocialLogin() {

  return (
    <Box component="div" sx={{ display: 'flex', gap: 2 }}>
      <Button component="label" variant="outlined" color="primary" onClick={() => signIn('google', { callbackUrl: '/' })} startIcon={<GoogleIcon />}>
        Đăng nhập với Google
      </Button>
    </Box>
  )
}