import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Box, Container, Typography } from '@mui/material';
import { Helmet } from 'react-helmet';

interface LayoutProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = 'SwarCure Wellness',
  description = 'Sound therapy for holistic wellness',
  maxWidth = false
}) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
      
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Header />
        
        <Box component="main" flexGrow={1} py={4}>
          {children}
        </Box>
        
        <Footer />
      </Box>
    </>
  );
};

export default Layout;
