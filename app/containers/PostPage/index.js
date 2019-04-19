/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import sizeMe from 'react-sizeme';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { makeSelecDBUser } from 'containers/App/selectors';
import { virtualize } from 'react-swipeable-views-utils';
import SwipeableViews from 'react-swipeable-views';
import { withStyles, withTheme } from '@material-ui/core/styles';
import ChevronRight from '@material-ui/icons/ChevronRight';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import reducer from './reducer';
import saga from './saga';
import Post from './Post';
import { loadMemesSlide } from './actions';
import AccessDenied from '../../components/AccessDenied/index';
import { makeSelecMemesSlide, makeSelectBoundries } from './selectors';
const VirtualizeSwipeableViews = virtualize(SwipeableViews);
const styles = theme => ({
  sliderHandler: {
    display: 'flex',
    flexDirection: 'column',
  },
  containerDivSlider: {
    margin: 'auto',
    height: 'auto',
  },
  root: {
    paddingTop: '85px',
    maxWidth: '100%',
    maxHeght: '100%',
    // backgroundColor: theme.palette.primary.dark,
    // backgroundColor: '#0c1024',
  },
  iconNext: {
    // color: 'white !important',
    // fontSize: 60,
    // float: 'right',
    float: 'right',
    fontSize: 50,
    // transition: 'background-color 0.3s',
    transition: theme.transitions.easing.sharp,
    // backgroundColor: theme.palette.primary.main,
    // color: theme.palette.primary.contrastText,
    color: theme.palette.primary.contrastText,
    marginTop: '30px',
    ':hover': {
      color: theme.palette.action.hover,
    },
    // hover: theme.palette.action.hover,
    // hoverOpacity: theme.palette.action.hoverOpacity,
    boxShadow: theme.shadows[3],
  },
  iconPrevious: {
    // color: 'white !important',
    // fontSize: 60,
    // float: 'left',
    float: 'left',
    fontSize: 50,
    // transition: 'background-color 0.3s',
    transition: theme.transitions.easing.sharp,
    // backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    // hover: theme.palette.action.hover,
    // hoverOpacity: theme.palette.action.hoverOpacity,
    marginTop: '30px',
    ':hover': {
      color: theme.palette.action.hover,
    },
    boxShadow: theme.shadows[3],
  },
  navigationTop: {
    paddingBottom: '10px',
  },
});
export class PostPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: props.boundries.minIndex + 1,
    };
    // 1 for include id, 0 not include
    // 0 for direct load, 1 for append right, -1 for append left
    props.loadMemesSlide(
      props.match.params && props.match.params.idPost
        ? props.match.params.idPost
        : 0,
      props.match.params && props.match.params.idUser
        ? props.match.params.idUser
        : 0,
      1,
      0,
      20,
    );
  }

  handleChangeIndex = (index, indexLatest) => {
    const { memesSlide, boundries, match } = this.props;
    let indexToContinueFind = -1;
    const whereToLoad = index > indexLatest ? 1 : -1;
    indexToContinueFind =
      memesSlide[indexLatest].id === 0 ? '-1' : memesSlide[indexLatest].id;
    if (whereToLoad !== -1 && memesSlide[index] && memesSlide[index].id) {
      indexToContinueFind =
        memesSlide[index].id === 0 ? '-1' : memesSlide[index].id;
    }
    if (
      (index === boundries.minIndex && whereToLoad === -1) ||
      (index === boundries.maxIndex && whereToLoad === 1)
    ) {
      this.props.loadMemesSlide(
        indexToContinueFind,
        match.params && match.params.idUser ? match.params.idUser : 0,
        0,
        whereToLoad,
        20,
      );
    }
    this.setState({
      index:
        (boundries.deadEndIdLeft > index && whereToLoad === -1) ||
        (boundries.deadEndIdRight < index && whereToLoad === 1)
          ? indexLatest
          : index,
    });
    window.scrollTo(0, 0);
  };

  handleNextIndex = () => {
    this.handleChangeIndex(this.state.index + 1, this.state.index);
  };

  handlePreviousIndex = () => {
    this.handleChangeIndex(this.state.index - 1, this.state.index);
  };

  onChangeIndex = (index, indexLatest) => {
    this.handleChangeIndex(index, indexLatest);
  };

  // updateHeight2 = updateHeight => {
  //   debugger;
  //   console.table(updateHeight);
  //   updateHeight = () => {
  //     console.table(updateHeight);
  //   };
  // };

  slideRenderer = ({ key, index }) => {
    const { size, match, boundries } = this.props;

    const openComments =
      boundries.minIndex + 1 === index
        ? match.params.withComments !== 'false'
        : false;

    return (
      <Post
        key={key}
        index={index}
        openComments={openComments}
        imgStatus="loading"
        widthDiv={size.width > 768 ? '540px' : '100%'}
      />
    );
  };

  render() {
    const { memesSlide, classes, size, auth, dbUser, match } = this.props;

    return (match.params.idUser &&
      auth.isAuthenticated() &&
      Number(dbUser.id) === Number(match.params.idUser)) ||
      !match.params.idUser ? (
        <article className={classes.root}>
          <div
            id="container-div-slider"
            className={classes.containerDivSlider}
            style={{ width: size.width > 768 ? '540px' : '100%' }}
          >
            {memesSlide.length > 0 && (
              <div key="slider-handler" className={classes.sliderHandler}>
                {size.width > 768 && (
                  <div key="slider-handler-top" className={classes.navigationTop}>
                    <ChevronLeft
                      key="prev"
                      className={classes.iconPrevious}
                      onClick={this.handlePreviousIndex}
                    />
                    <ChevronRight
                      key="next"
                      className={classes.iconNext}
                      onClick={this.handleNextIndex}
                    />
                  </div>
                )}

                <VirtualizeSwipeableViews
                  enableMouseEvents
                  overscanSlideBefore={1}
                  overscanSlideAfter={1}
                  onChangeIndex={this.onChangeIndex}
                  index={this.state.index}
                  slideRenderer={this.slideRenderer}
                />
              </div>
            )}
          </div>
        </article>
      ) : (
        <AccessDenied />
      );
  }
}

PostPage.propTypes = {
  dbUser: PropTypes.object,
  match: PropTypes.object,
  memesSlide: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  loadMemesSlide: PropTypes.func,
  classes: PropTypes.object,
  size: PropTypes.object,
  boundries: PropTypes.object,
  auth: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  dbUser: makeSelecDBUser(),
  memesSlide: makeSelecMemesSlide(),
  boundries: makeSelectBoundries(),
});

const mapDispatchToProps = dispatch => ({
  loadMemesSlide: (idPost, idUser, includeIdPost, whereToLoad, limit) =>
    dispatch(loadMemesSlide(idPost, idUser, includeIdPost, whereToLoad, limit)),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'post', reducer });
const withSaga = injectSaga({ key: 'post', saga });

export default compose(
  withConnect,
  withReducer,
  withSaga,
  sizeMe(),
  withTheme(),
  withStyles(styles),
)(PostPage);
