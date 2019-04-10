import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import NotInterested from '@material-ui/icons/NotInterested';

function AccessDenied() {
  return (
    <Card
      style={{
        paddingTop: '90px',
        textAlign: 'center',
        backgroundColor: '#0c1024',
        color: 'white',
      }}
    >
      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
          component="h2"
          style={{ color: 'white' }}
        >
          Access Denied...
        </Typography>
        <NotInterested
          key="icon-acccess-denied"
          style={{ fontSize: 100, margin: 10 }}
        />
        <Typography component="p" style={{ color: 'white' }}>
          You don't have permision to acces this page !
        </Typography>
      </CardContent>
    </Card>
  );
}

export default AccessDenied;
