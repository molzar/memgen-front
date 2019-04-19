/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import {
  makeSelectRepos,
  makeSelectLoading,
  makeSelectError,
  makeSelecDBUser,
} from 'containers/App/selectors';
import { LocaleToggle } from 'containers/LocaleToggle';
import { makeSelectUsername } from './selectors';

import reducer from './reducer';
import saga from './saga';
import ListItemsPageVirtualized from './ListItemsPageVirtualized';
import { makeSelectLocale } from '../LanguageProvider/selectors';
// import { LanguageProvider } from '../LanguageProvider';
// import messages from './messages';

export class HomePage extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { dbUser, auth, locale } = this.props;

    return (
      <article>
        <Helmet>
          <title>MemGen</title>
          <meta
            name="description"
            content="Create your own Meme with our generator"
          />
        </Helmet>
        <LocaleToggle />
        <ListItemsPageVirtualized
          userID={dbUser.id}
          auth={auth}
          dbUser={dbUser}
        />
      </article>
    );
  }
}

HomePage.propTypes = {
  dbUser: PropTypes.object,
  auth: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  repos: makeSelectRepos(),
  username: makeSelectUsername(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
  dbUser: makeSelecDBUser(),
  locale: makeSelectLocale(),
});

const withConnect = connect(
  mapStateToProps,
  null,
);

const withReducer = injectReducer({ key: 'home', reducer });
const withSaga = injectSaga({ key: 'home', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(HomePage);
