"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation'
import Link from "next/link";
import { Box, Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ValidateTextField } from "@/component/ValidateTextField";
import SocialLogin from "@/component/SocialLogin";
import { getSession, signIn, useSession } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [formValue, setFormValue] = useState({ phone: '', password: '' });
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await signIn('credentials', {
      redirect: false, 
      phone: formValue.phone,
      password: formValue.password,
      callbackUrl: process.env.NEXT_PUBLIC_NEXTAUTH_URL,
    });
    if (result?.ok) {
      router.push('/');
    } else {
      console.error('Login failed:', result?.error);
    }
  }

  return (
    <>
      <Box component="div" sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h3" sx={{ textAlign: 'center', marginTop: 15 }}>Đăng ký</Typography>
        <Box component="div" sx={{ marginTop: 1 }}>
          <Box component="form" onSubmit={onSubmit}>
            <ValidateTextField
              type="text"
              name="phone"
              label="Số điện thoại"
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
              label="Mật khẩu"
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
            <ValidateTextField
              type={showPassword ? 'text' : 'password'}
              name="password"
              label="Nhập lại mật khẩu"
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
                Đăng ký
              </Button>
              </Box>
          </Box>
        </Box>
        <Box component="div" sx={{ margin: 2 }}>
          <SocialLogin />
          <Typography sx={{ marginTop: 2, textAlign: "center" }}>Đã có tài khoản? <Link href="/auth/login" className="font-bold underline">Đăng nhập</Link></Typography>
        </Box>
      </Box>
    </>
  );
}
