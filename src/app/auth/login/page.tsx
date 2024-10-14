"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation'
// import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { Box, Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ValidateTextField } from "@/component/ValidateTextField";
import SocialLogin from "@/component/SocialLogin";
import { getSession, signIn } from "next-auth/react";
import { get, post } from "@/common/store/base.service";
import { userAction } from "@/common/store/user/users.actions";
import { usersSelectors } from "@/common/store/user/users.selectors";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // const { status } = useSession();
  const [showPassword, setShowPassword] = React.useState(false);
  const [formValue, setFormValue] = useState({ phone: '0905015627', password: '1231' });
  // const user = usersSelectors.useUserInformation();


  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // const res = await signIn("credentials", {
    //   username: formValue.phone,
    //   password: formValue.password,
    //   callbackUrl: process.env.NEXT_PUBLIC_NEXTAUTH_URL,
    //   redirect: false
    // });
    // if (res?.ok) {
    //   router.push("/");
    // }
    const data = {
      phone: formValue.phone,
      password: formValue.password,
    }
    const res = await post('auth/login',data);
    userAction.logIn(res.data.user_info)    
    router.push('/')
  }

  useEffect(() => {
    const test = async () => {
      const userSession = await getSession()
      console.log(userSession);
    }

    test();
  }, [])
  return (
    <>
      <Box component="div" sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h3" sx={{ textAlign: 'center', marginTop: 15 }}>Log in</Typography>
        <Box component="div" sx={{ marginTop: 1 }}>
          <Box component="form" onSubmit={onSubmit}>
            <ValidateTextField
              type="text"
              name="phone"
              label="Phone"
              placeholder="Enter your number phone"
              value={formValue.phone}
              onChange={(event) => setFormValue({ ...formValue, phone: event.target.value })}
              required
              error={!formValue.phone} variant={"outlined"}
              errorText="Please enter your number phone"
            />
            <ValidateTextField
              type={showPassword ? 'text' : 'password'}
              name="password"
              label="Password"
              placeholder="Passowrd"
              value={formValue.password}
              onChange={(event) => setFormValue({ ...formValue, password: event.target.value })}
              required
              error={!formValue.password} variant={"outlined"}
              errorText="Please enter your password"
              endadornment={<InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
              }
            />
            <Box component="div">
              <Button type="submit" variant="contained" color="primary" sx={{ width: '100%', padding: 2, fontSize: 16 }}>
                Log in
              </Button>
              <Typography sx={{ textAlign: 'center', marginTop: 2 }}>or <Link href="/forgot-password" className="font-bold underline">Forgot password?</Link></Typography>
            </Box>
          </Box>
        </Box>
        <Box component="div" sx={{ margin: 2 }}>
          <SocialLogin />
          <Typography sx={{ marginTop: 2, textAlign: "center" }}>Don&apos;t have an account? <Link href="/sign-up" className="font-bold underline">Sign up</Link></Typography>
        </Box>
      </Box>
    </>
  );
}
