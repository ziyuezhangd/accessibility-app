import { Modal, Typography, Box, Paper, Grid } from '@mui/material';
import React from 'react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function HelpModal({ isOpen, onClose }) {
  return (
    <Modal open={isOpen} onClose={onClose} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
      <Box sx={style}>
        <Typography id='modal-modal-title' variant='h4' component='h2'>
          How it works
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3} md={3} sx={{ display: 'flex' }}>
            <Paper
              elevation={0}
              square='false'
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'start',
                flexGrow: 1,
                p: 1,
                height: '150px',
              }}
            >
                1
            </Paper>
          </Grid>
          <Grid item xs={12} sm={3} md={3} sx={{ display: 'flex' }}>
            <Paper
              elevation={0}
              square='false'
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'start',
                flexGrow: 1,
                p: 1,
                height: '150px',
              }}
            >
                2
            </Paper>
          </Grid>
          <Grid item xs={12} sm={3} md={3} sx={{ display: 'flex' }}>
            <Paper
              elevation={0}
              square='false'
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'start',
                flexGrow: 1,
                p: 1,
                height: '150px',
              }}
            >
                3
            </Paper>
          </Grid>
          <Grid item xs={12} sm={3} md={3} sx={{ display: 'flex' }}>
            <Paper
              elevation={0}
              square='false'
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'start',
                flexGrow: 1,
                p: 1,
                height: '150px',
              }}
            >
                4
            </Paper>
          </Grid>
        </Grid>
        <Typography id='modal-modal-description' sx={{ mt: 2 }}>
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
        </Typography>
      </Box>
    </Modal>
  );
}
