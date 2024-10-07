import { siteConfig } from "@/config/site";
import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box component="footer" sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Typography variant="body1">
        <span>Powered by&nbsp;</span>
        <strong>DC8</strong>
      </Typography>
      <Typography variant="caption">
        Version: {siteConfig.version}
      </Typography>
    </Box>
  )
}