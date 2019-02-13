import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Avatar from '@material-ui/core/Avatar';

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  avatar: {
    margin: 10,
  },
};

function Header(props) {
  const { classes, userProfile } = props;
  const { isAuthenticated, login, logout } = props.auth;

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            className={classes.menuButton}
            color="inherit"
            aria-label="Menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            MeMGeN
          </Typography>
          {isAuthenticated() && (
            <IconButton color="inherit">
              {userProfile && userProfile.picture ? (
                <Avatar
                  alt="iiii"
                  src={userProfile.picture}
                  className={classes.avatar}
                />
              ) : (
                <AccountCircle />
              )}
            </IconButton>
          )}
          <Button color="inherit" onClick={isAuthenticated() ? logout : login}>
            {isAuthenticated() ? 'Log Out' : 'Log In'}
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  userProfile: PropTypes.object,
  auth: PropTypes.object.isRequired,
};

export default withStyles(styles)(Header);
