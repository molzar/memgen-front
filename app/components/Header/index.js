import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Avatar from '@material-ui/core/Avatar';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeSharp from '@material-ui/icons/HomeSharp';
import AddAPhotoSharp from '@material-ui/icons/AddAPhotoSharp';
import PhotoLibrarySharp from '@material-ui/icons/PhotoLibrarySharp';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import messages from './messages';
import { LocaleToggle } from '../../containers/LocaleToggle';
const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  grow: {
    flexGrow: 1,
  },
  avatar: {
    margin: 10,
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
});

class Header extends React.Component {
  state = {
    open: false,
  };

  componentWillMount() {
    const { userProfile } = this.props;
    const { getProfile, isAuthenticated } = this.props.auth;
    if (isAuthenticated()) {
      if (!userProfile) {
        getProfile(() => {});
      }
    }
  }

  toggleDrawer = open => () => {
    this.setState({
      open,
    });
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, userProfile, theme } = this.props;
    const { isAuthenticated, login, logout } = this.props.auth;
    return (
      <>
        <div className={classes.root}>
          <CssBaseline />
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar disableGutters>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleDrawerOpen}
                className={classNames(
                  classes.menuButton,
                  this.state.open && classes.hide,
                )}
              >
                <MenuIcon style={{ fontSize: 40, margin: 10 }} />
              </IconButton>
              <Typography variant="h6" color="inherit" className={classes.grow}>
                MeMGeN
              </Typography>
              <LocaleToggle
                locale={this.props.locale}
                onLocaleToggle={this.props.onLocaleToggle}
              />
              {isAuthenticated() ? (
                <IconButton color="inherit">
                  {userProfile && userProfile.picture ? (
                    <Avatar
                      alt=":)"
                      src={`/api/proxy/${encodeURIComponent( // {}
                          userProfile.picture,
                        )}?width=40`}
                      className={classes.avatar}
                    />
                  ) : (
                    <AccountCircle style={{ fontSize: 40, margin: 10 }} />
                  )}
                </IconButton>
              ) : (
                <IconButton color="inherit">
                  <AccountCircle style={{ fontSize: 40, margin: 10 }} />
                </IconButton>
              )}
              <Button
                color="inherit"
                style={{ width: 100 }}
                onClick={isAuthenticated() ? logout : login}
              >
                {isAuthenticated() ? (
                  <FormattedMessage {...messages.logOut} />
                ) : (
                  <FormattedMessage {...messages.logIn} />
                )}
              </Button>
            </Toolbar>
          </AppBar>
        </div>
        <SwipeableDrawer
          open={this.state.open}
          className={classes.drawer}
          onClose={this.toggleDrawer(false)}
          onOpen={this.toggleDrawer(true)}
          style={{ height: '100vh' }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={this.handleDrawerClose}>
              {theme.direction === 'ltr' ? (
                <ChevronLeftIcon style={{ fontSize: 40, margin: 10 }} />
              ) : (
                <ChevronRightIcon style={{ fontSize: 40, margin: 10 }} />
              )}
            </IconButton>
          </div>
          <Divider />
          <List onClick={this.toggleDrawer(false)}>
            <Link style={{ textDecoration: 'none' }} to="/">
              <ListItem button key="All MeMes">
                <ListItemIcon>
                  <HomeSharp />
                </ListItemIcon>
                <ListItemText
                  primary={<FormattedMessage {...messages.allMemes} />}
                />
              </ListItem>
            </Link>
            {isAuthenticated() ? (
              <>
                <Link style={{ textDecoration: 'none' }} to="/imageDraw">
                  <ListItem button key="Make MeMe">
                    <ListItemIcon>
                      <AddAPhotoSharp />
                    </ListItemIcon>
                    <ListItemText
                      primary={<FormattedMessage {...messages.makeMeme} />}
                    />
                  </ListItem>
                </Link>

                <Link style={{ textDecoration: 'none' }} to="/myMemes">
                  <ListItem button key="My MeMes">
                    <ListItemIcon>
                      <PhotoLibrarySharp />
                    </ListItemIcon>
                    <ListItemText
                      primary={<FormattedMessage {...messages.myMemes} />}
                    />
                  </ListItem>
                </Link>
              </>
            ) : (
              ''
            )}
          </List>
        </SwipeableDrawer>
      </>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  userProfile: PropTypes.object,
  auth: PropTypes.object.isRequired,
  theme: PropTypes.object,
};

export default compose(
  // injectIntl,
  withStyles(styles, { withTheme: true }),
)(Header);
