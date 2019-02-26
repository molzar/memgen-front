/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { makeSelecDBUser } from '../App/selectors';
import HomePageImgList from '../HomePage/HomePageImgList';
import reducer from '../App/reducer';
// import homeReducer from '../HomePage/reducer';
import saga from '../HomePage/saga';
export class MemePage extends React.Component {
  render() {
    const { dbUser } = this.props;
    return (
      <div>
        <HomePageImgList userID={dbUser.id} />
      </div>
    );
  }
}

MemePage.propTypes = { dbUser: PropTypes.object };

const mapStateToProps = createStructuredSelector({
  dbUser: makeSelecDBUser(),
});

const withReducer = injectReducer({ key: 'global', reducer });
const withSaga = injectSaga({ key: 'home', saga });
const withConnect = connect(
  mapStateToProps,
  null,
);

export default compose(
  withReducer,
  withConnect,
  withSaga,
)(MemePage);
