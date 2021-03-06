/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import HomePage from 'containers/HomePage/Loadable';
import ImageDraw from 'containers/ImageDraw/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import Header from 'components/Header';
import saga from './saga';
import GlobalStyle from '../../global-styles';
import AuthContext from '../../src/AuthContext';
import Auth from '../../Auth/Auth';
import Callback from '../../src/Callback';
import { selectUserProfile } from './selectors';
import { setUserProfile, checkDBUser } from './actions';

const AppWrapper = styled.div`
  display: flex;
  min-height: 100%;
  flex-direction: column;
  position: relative;
`;

class App extends Component {
  state = {
    profile: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      auth: new Auth(
        this.props.history,
        this.props.localSetUserProfile,
        this.props.checkDBUser,
      ),
    };
  }

  render() {
    const { auth, profile } = this.state;
    return (
      <AuthContext.Provider value={auth}>
        <AppWrapper>
          <Helmet
            titleTemplate="%s - Make your own Meme with our Generator"
            defaultTitle="Make your own Meme with our Generator"
          >
            <meta
              name="description"
              content="Make your own Meme with our Generator"
            />
          </Helmet>
          <Header
            userProfile={this.props.userProfile}
            auth={auth}
            profile={profile}
          />
          <Switch>
            <Route exact path="/" render={props => <HomePage {...props} />} />
            <Route
              path="/callback"
              auth={auth}
              render={props => <Callback auth={auth} {...props} />}
            />
            <Route
              path="/imageDraw"
              render={props => <ImageDraw {...props} />}
            />
            <Route path="/myMemes" render={props => <HomePage {...props} />} />
            <Route path="" component={NotFoundPage} />
          </Switch>

          <GlobalStyle />
        </AppWrapper>
      </AuthContext.Provider>
    );
  }
}
App.propTypes = {
  history: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  userProfile: selectUserProfile(),
});

const mapDispatchToProps = dispatch => ({
  localSetUserProfile: profile => dispatch(setUserProfile(profile)),
  checkDBUser: profile => dispatch(checkDBUser(profile)),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withSaga = injectSaga({ key: 'app', saga });

export default compose(
  withSaga,
  withConnect,
)(App);
