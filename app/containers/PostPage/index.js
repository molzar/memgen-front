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
import { withStyles } from '@material-ui/core/styles';
import ChevronRight from '@material-ui/icons/ChevronRight';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import reducer from './reducer';
import saga from './saga';
import Post from './Post';
import { loadMemesSlide } from './actions';
import AccessDenied from '../../components/AccessDenied/index';
import { makeSelecMemesSlide, makeSelectBoundries } from './selectors';
const VirtualizeSwipeableViews = virtualize(SwipeableViews);
const styles = () => ({
  imageDialog: {
    padding: '5px 5px 5px 5px !important',
  },
  noPadding: {
    padding: '5px 5px 5px 5px !important',
  },
  sliderHandler: {
    display: 'flex',
    flexDirection: 'column',
  },
  containerDivSlider: {
    margin: 'auto',
  },
  root: {
    paddingTop: '85px',
    maxWidth: '100%',
    maxHeght: '100%',
    width: '100%',
    height: '100%',
    backgroundColor: '#0c1024',
  },
  containerDiv: {},
  bottomHandler: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomLeftRadius: '10px',
    borderBottomRightRadius: '10px',
  },
  commentsHandler: {
    marginInlineStart: 'auto',
  },
  containerImage: {
    // paddingTop: '20px',
  },
  itemRow: {
    flexDirection: 'column',
    alignItems: 'center',
    display: 'inline-block',
  },
  imgClass: {
    width: '100%',
  },
  emptyDiv: {
    opacity: '0',
    height: '30px',
  },
  dislikeIcon: {
    color: '#b53f51',
  },
  likeIcon: {
    color: '#51b53f',
  },
  whiteColor: {
    color: 'white !important',
  },
  iconNext: {
    color: 'white !important',
    fontSize: 60,
    float: 'right',
  },
  iconPrevious: {
    color: 'white !important',
    fontSize: 60,
    float: 'left',
  },
  containerPost: {
    display: 'flex',
    flexDirection: 'column',
  },
  divLikeHandler: {
    float: 'left',
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

  slideRenderer = ({ key, index }) => {
    const { size } = this.props;
    return (
      <Post
        key={key}
        index={index}
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
                  <div key="slider-handler-top">
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
  withReducer,
  withSaga,
  sizeMe(),
  withConnect,
  withStyles(styles),
)(PostPage);
