import { Accessibility} from '@mui/icons-material';
import { Typography } from '@mui/material';

export default function Logo({isClickable}) {
  const Graphic = () => (
    <div className='flex flex-row'
      aria-label='Access NYC logo'
      role='figure'>
      <Accessibility sx={{ mr: 1 }} />
      <Typography
        variant='h6'
        noWrap
        sx={{
          display: {xs: 'none', sm: 'block'},
          mr: 0,
          fontFamily: 'monospace',
          fontWeight: 700,
          letterSpacing: '.3rem',
          color: 'inherit',
          textDecoration: 'none',
        }}
        aria-hidden={true}
      >
        ACCESS
      </Typography>
      <Typography
        variant='h6'
        noWrap
        sx={{
          display: {xs: 'none', sm: 'block'},
          mr: 2,
          fontFamily: 'monospace',
          fontWeight: 300,
          letterSpacing: '0rem',
          color: 'inherit',
          textDecoration: 'none',
        }}
        aria-hidden={true}
      >
        NYC
      </Typography>
    </div>
  );
  return (
    <>
      { isClickable ? <a href='/'
        aria-label='Landing screen'
        id="logo-button"
      >
        <Graphic/> 
      </a> : <Graphic/>}
    </>

  );
}
