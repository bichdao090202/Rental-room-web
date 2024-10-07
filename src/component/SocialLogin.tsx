"use client";

import { signIn } from "next-auth/react"
import { Box, Button } from "@mui/material";
import GithubIcon from "./icons/GithubIcon";
import GoogleIcon from "./icons/GoogleIcon";

export default function SocialLogin() {

  return (
    <Box component="div" sx={{ display: 'flex', gap: 2 }}>
      <Button component="label" variant="outlined" color="primary"
        onClick={() => 
          signIn("github", { callbackUrl: "/" })
        } 
        startIcon={<GithubIcon />}>
        Login with Github
      </Button>
      <Button component="label" variant="outlined" color="primary" onClick={() => signIn('google', { callbackUrl: '/' })} startIcon={<GoogleIcon />}>
        Login with Google
      </Button>
    </Box>
  )
}