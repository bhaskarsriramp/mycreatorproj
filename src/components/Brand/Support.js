import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Button,
  Box,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

export default function Support() {

  return (
    <Box sx={{ mt: 2, px: 3 }}>
      <Typography  align="center" gutterBottom sx={{ fontWeight: 500, fontSize : '34px' }}>
        We're Here to Help
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        Get expert support tailored to your needs.
      </Typography>

      <Grid container justifyContent="center" sx={{ px: 8}}>
        <Grid item xs={12} sm={8} md={6}>
          <Card elevation={3} sx={{ borderRadius: 4 }}>
            <CardContent sx={{ px: 8, py: 4}}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 500, color: '#2D2A69' }}>
                Priority Email Support
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <List>
                {[
                  "Priority Email Support",
                  "48hr Resolution Window",
                  "Account Setup",
                  "Bugs Resolution"
                ].map((text, index) => (
                  <ListItem key={index} disableGutters sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckCircleIcon color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={text} primaryTypographyProps={{ fontSize: '16px' }} />
                  </ListItem>
                ))}
              </List>

              <CardActions sx={{ py: 4 }}>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<MailOutlineIcon />}
                sx={{
                  textTransform: 'none',
                  px: 3,
                  borderRadius: 3,
                  fontWeight: 500,
                  backgroundColor: '#FFFFFF',
                  '&:hover': {
                    backgroundColor: '#2D2A69',
                    color: '#FFFFFF'
                  }
                }}
              >
                support@creatorconsole.co
              </Button>
            </CardActions>
            </CardContent>

         
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
