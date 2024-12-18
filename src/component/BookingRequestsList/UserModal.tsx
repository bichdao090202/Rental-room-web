// import React from 'react';
// import {
//   Box,
//   Modal,
//   Typography,
//   IconButton,
//   Avatar,
//   Tooltip,
//   Button,
// } from '@mui/material';
// import { ContentCopy } from '@mui/icons-material';

// interface UserInfo {
//   id: number;
//   full_name: string;
//   email: string;
//   img_url: string;
//   phone: string;
// }

// interface UserModalProps {
//   open: boolean;
//   onClose: () => void;
//   user: UserInfo;
//   styleOption: 'option1' | 'option2' | 'option3';
// }

// const UserModal: React.FC<UserModalProps> = ({ open, onClose, user, styleOption }) => {
//   const copyToClipboard = (text: string) => {
//     navigator.clipboard.writeText(text);
//   };

//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box
//         sx={{
//           position: 'absolute',
//           top: '50%',
//           left: '50%',
//           transform: 'translate(-50%, -50%)',
//           bgcolor: 'background.paper',
//           boxShadow: 24,
//           p: 4,
//           width: '400px',
//           borderRadius: '8px',
//         }}
//       >
//         <Box sx={{ textAlign: 'center' }}>
//             <Avatar src={user.img_url} sx={{ width: 100, height: 100, margin: '0 auto' }} />
//             <Typography variant="h6" sx={{ mt: 2 }}>{user.full_name}</Typography>
//             <Typography variant="body1">Email: {user.email}</Typography>
//             <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
//               <Typography variant="body1" sx={{ mr: 1 }}>Phone: {user.phone}</Typography>
//               <Tooltip title="Copy">
//                 <IconButton onClick={() => copyToClipboard(user.phone)}>
//                   <ContentCopy />
//                 </IconButton>
//               </Tooltip>
//             </Box>
//           </Box>
//         <Box sx={{ textAlign: 'center', mt: 3 }}>
//           <Button variant="contained" onClick={onClose}>Close</Button>
//         </Box>
//       </Box>
//     </Modal>
//   );
// };

// export default UserModal;

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Avatar,
  Button,
  Divider,
} from '@mui/material';
import { ContentCopy as CopyIcon, Close as CloseIcon } from '@mui/icons-material';

interface UserInfo {
  id: number;
  full_name: string;
  email: string;
  img_url: string;
  phone: string;
}

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  user: UserInfo;
}

const UserModal: React.FC<UserModalProps> = ({ open, onClose, user }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        style: {
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '16px',
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Thông tin người dùng</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box textAlign="center" mb={2}>
          <Avatar
            src={user.img_url}
            alt={user.full_name}
            sx={{ width: 96, height: 96, mx: 'auto', border: '4px solid rgba(255, 255, 255, 0.5)' }}
          />
          <Typography variant="h6" fontWeight="bold" mt={2}>
            {user.full_name}
          </Typography>
        </Box>

        <Divider />

        <Box mt={2}>
          <Typography variant="body2" color="textSecondary">
            Email
          </Typography>
          <Typography variant="body1">{user.email}</Typography>
        </Box>

        <Box mt={2} display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="body2" color="textSecondary">
              Phone
            </Typography>
            <Typography variant="body1">{user.phone}</Typography>
          </Box>
          <IconButton onClick={() => copyToClipboard(user.phone)}>
            <CopyIcon />
          </IconButton>
        </Box>

        <Box mt={3}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={onClose}
          >
            Close
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;
