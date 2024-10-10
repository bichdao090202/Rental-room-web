// import React from 'react';
// import {
//     FormControl,
//     InputLabel,
//     OutlinedInput,
//     InputAdornment,
//     Typography,
// } from '@mui/material';
// import { Controller, Control, FieldError } from 'react-hook-form';

// interface CustomFormControlProps {
//     name: string;
//     control: Control<any>;
//     label: string;
//     error?: FieldError | undefined;
//     startAdornment?: React.ReactNode;
//     placeholder?: string;
//     [key: string]: any;
// }

// const CustomFormControl: React.FC<CustomFormControlProps> = ({
//     name,
//     control,
//     label,
//     error,
//     startAdornment,
//     placeholder,
//     ...rest
// }) => {
//     return (
//         <FormControl fullWidth variant="outlined" error={!!error}>
//             <InputLabel htmlFor={name}>{label}</InputLabel>
//             <Controller
//                 name={name}
//                 control={control}
//                 defaultValue=""
//                 render={({ field }) => (
//                     <OutlinedInput
//                         {...field}
//                         id={name}
//                         label={label}
//                         placeholder={placeholder}
//                         startAdornment={startAdornment && (
//                             <InputAdornment position="start">
//                                 {startAdornment}
//                             </InputAdornment>
//                         )}
//                         {...rest}
//                     />
//                 )}
//             />
//             {error && (
//                 <Typography color="error" variant="caption">
//                     {error.message}
//                 </Typography>
//             )}
//         </FormControl>
//     );
// };

// export default CustomFormControl;


// import React, { useState } from 'react';
// import {
//     FormControl,
//     InputLabel,
//     OutlinedInput,
//     InputAdornment,
//     IconButton,
//     Typography,
// } from '@mui/material';
// import { Visibility, VisibilityOff } from '@mui/icons-material';
// import { Controller, Control, FieldError } from 'react-hook-form';

// interface CustomFormControlProps {
//     name: string;
//     control: Control<any>;
//     label: string;
//     error?: FieldError | undefined;
//     startAdornment?: React.ReactNode;
//     placeholder?: string;
//     type?: 'date' | 'number' | 'text' | 'password'; 
//     [key: string]: any;
// }

// const CustomFormControl: React.FC<CustomFormControlProps> = ({
//     name,
//     control,
//     label,
//     error,
//     startAdornment,
//     placeholder,
//     type = 'text', 
//     ...rest
// }) => {
//     const [showPassword, setShowPassword] = useState(false);

//     const handleClickShowPassword = () => setShowPassword(!showPassword);
//     const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
//         event.preventDefault();
//     };

//     return (
//         <FormControl fullWidth variant="outlined" error={!!error}>
//             <InputLabel htmlFor={name}>{label}</InputLabel>
//             <Controller
//                 name={name}
//                 control={control}
//                 defaultValue=""
//                 render={({ field }) => (
//                     <OutlinedInput
//                         {...field}
//                         id={name}
//                         label={label}
//                         placeholder={placeholder}
//                         type={type === 'password' && !showPassword ? 'password' : 'text'}
//                         startAdornment={startAdornment && (
//                             <InputAdornment position="start">
//                                 {startAdornment}
//                             </InputAdornment>
//                         )}
//                         endAdornment={type === 'password' && (
//                             <InputAdornment position="end">
//                                 <IconButton
//                                     aria-label="toggle password visibility"
//                                     onClick={handleClickShowPassword}
//                                     onMouseDown={handleMouseDownPassword}
//                                     edge="end"
//                                 >
//                                     {showPassword ? <VisibilityOff /> : <Visibility />}
//                                 </IconButton>
//                             </InputAdornment>
//                         )}
//                         {...rest}
//                     />
//                 )}
//             />
//             {error && (
//                 <Typography color="error" variant="caption">
//                     {error.message}
//                 </Typography>
//             )}
//         </FormControl>
//     );
// };

// export default CustomFormControl;


import React, { useState, useRef } from 'react';
import {
    FormControl,
    TextField,
    InputAdornment,
    IconButton,
    Typography,
    Button,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Controller, Control, FieldError } from 'react-hook-form';

interface CustomFormControlProps {
    name: string;
    control: Control<any>;
    label: string;
    error?: FieldError | undefined;
    startAdornment?: React.ReactNode;
    placeholder?: string;
    type?: 'date' | 'number' | 'text' | 'password' | 'image';
    rules?: object;
    [key: string]: any;
}

const CustomFormControl: React.FC<CustomFormControlProps> = ({
    name,
    control,
    label,
    error,
    startAdornment,
    placeholder,
    type = 'text',
    rules,
    ...rest
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setSelectedImage(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const renderInput = (field: any) => {
        if (type === 'image') {
            return (
                <>
                    <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        {...field}
                    />
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {selectedImage ? 'Change Image' : 'Select Image'}
                    </Button>
                    {selectedImage && (
                        <img src={selectedImage} alt="Selected" style={{ maxWidth: '100%', marginTop: '10px' }} />
                    )}
                </>
            );
        }

        return (
            <TextField
                {...field}
                label={label}
                placeholder={placeholder}
                type={type === 'password' && !showPassword ? 'password' : type}
                error={!!error}
                helperText={error?.message}
                fullWidth
                InputLabelProps={{
                    shrink: true,
                }}
                InputProps={{
                    startAdornment: startAdornment && (
                        <InputAdornment position="start">
                            {startAdornment}
                        </InputAdornment>
                    ),
                    endAdornment: type === 'password' && (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                {...rest}
            />
        );
    };

    return (
        <FormControl fullWidth variant="outlined" error={!!error}>
            {type === 'image' && <Typography variant="subtitle1">{label}</Typography>}
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field }) => renderInput(field)}
            />
            {type === 'image' && error && (
                <Typography color="error" variant="caption">
                    {error.message}
                </Typography>
            )}
        </FormControl>
    );
};

export default CustomFormControl;