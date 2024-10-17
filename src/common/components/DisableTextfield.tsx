import React from "react";
import { Box, FormControl, InputLabel, OutlinedInput, TextField } from "@mui/material";

interface FormControlDisableProps {
    title: string;
    value: string | number;
}

const FormControlDisable: React.FC<FormControlDisableProps> = ({ title, value }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Box sx={{ width: '40%' }}>{title}</Box>
            <TextField
                // label={title}
                value={value}
                InputProps={{
                    readOnly: true,
                    sx: {
                        color: 'gray',
                        backgroundColor: '#f5f5f5',
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#d3d3d3',
                            borderStyle: 'solid',
                        },
                        height: '40px',
                    },
                }}
                fullWidth
                variant="outlined"
                margin="normal"
            />
        </Box>
        // <Box sx={{paddingTop:'10px'}}>
        //     <FormControl fullWidth variant="outlined" disabled >
        //         <InputLabel htmlFor="userId">{`${title}`}</InputLabel>
        //         <OutlinedInput
        //             type="number"
        //             label={`${title}`}
        //             readOnly
        //             style={{ backgroundColor: '#f5f5f5' }}
        //             value={value}
        //         />
        //     </FormControl>
        // </Box>
    );
};

export default FormControlDisable;
