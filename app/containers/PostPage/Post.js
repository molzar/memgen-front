/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import ArrowUpwardSharp from '@material-ui/icons/ArrowUpwardSharp';
import ArrowDownwardSharp from '@material-ui/icons/ArrowDownwardSharp';
import CommentSharp from '@material-ui/icons/CommentSharp';
import sizeMe from 'react-sizeme';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { makeSelecDBUser } from 'containers/App/selectors';
import { CardContent, Card } from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';
import {
  FacebookShareButton,
  FacebookIcon,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  RedditIcon,
  RedditShareButton,
  FacebookShareCount,
  RedditShareCount,
} from 'react-share';

import CommentsComponent from './CommentsComponent';
import { makeSelecMemesSlide } from './selectors';
import { reportMemesSlide, likeDislike } from './actions';
import TopPost from '../../components/TopPost';
import ImgWithSpinner from './ImgWithSpinner';
const styles = theme => ({
  imageDialog: {
    padding: '0px 0px 0px 0px !important',
    width: '540xp',
    boxShadow: theme.shadows[3],
  },
  noPadding: {
    padding: '0px 0px 0px 0px !important',
    height: 'auto',
    transitionDuration: '0.3s',
  },
  root: {
    paddingTop: '85px !important',
  },
  somePadding: {
    margin: '5px',
    boxShadow: theme.shadows[3],
  },
  bottomHandler: {
    backgroundColor: theme.palette.primary.main,
    display: 'flex',
    flexDirection: 'row',
  },
  commentsHandler: {
    float: 'right',
  },
  cardRoot: {
    borderRadius: '0px !important',
    height: 'auto',
  },
  dislikeIcon: {
    color: theme.palette.secondary.main,
  },
  shadowIcons: {
    margin: '5px',
    boxShadow: theme.shadows[3],
  },
  likeIcon: {
    color: theme.palette.primary2.main,
  },
  whiteColor: {
    color: theme.palette.primary.contrastText,
  },
  shareParentDiv: {
    display: 'inline-flex',
    alignItems: 'center',
    margin: 'auto',
    color: theme.palette.primary.main,
  },
  progress: {
    margin: 'auto',
    display: 'block',
    marginTop: '30%',
    marginBottom: '30%',
    color: theme.palette.primary2.main,
  },
  containerLoading: {
    width: 'auto',
  },
});

export class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openComments: props.openComments || false,
    };
  }

  handleClickOpenComments = () => {
    this.setState(prevState => ({
      openComments: !prevState.openComments,
    }));
  };

  handleCloseComments = () => {
    this.setState({ openComments: false });
  };

  handleLikeDislike = likeDislikeObj => () => {
    const { memes, dbUser, index } = this.props;
    if (memes[index].id && dbUser.id) {
      this.props.likeDislike({
        postId: memes[index].id,
        userId: dbUser.id,
        like: likeDislikeObj,
      });
    }
  };

  reportMemesSlide = idPost => {
    this.props.reportMemesSlide(idPost);
  };

  render() {
    const { index, classes, memes, widthDiv } = this.props;
    return (
      <div key={`container-post-index-${index}`}>
        {memes[index] && (
          <div style={{ width: widthDiv }}>
            <Card
              aria-labelledby="scroll-dialog-title"
              key={`dialog-key-${memes[index].id}`}
              className={classes.cardRoot}
            >
              {memes[index].id > 0 && (
                <TopPost
                  meme={memes[index]}
                  reportMemesSlide={this.reportMemesSlide}
                  backgroundColor={this.props.theme.palette.primary.main}
                />
              )}
              <CardContent
                className={classes.noPadding}
                key={`dialog-content-${memes[index].id}`}
              >
                <ImgWithSpinner
                  classes={classes}
                  meme={memes[index]}
                  imageStatus={this.props.imgStatus}
                />
                {memes[index].id > 0 && (
                  <div
                    className={classes.bottomHandler}
                    key={`div-bottom-handler-key-${memes[index].id}`}
                  >
                    <div className={classes.divLikeHandler}>
                      <IconButton
                        key={`like-key-${memes[index].id}`}
                        color="inherit"
                        className={classes.likeIcon}
                        aria-label="Like"
                        onClick={this.handleLikeDislike(1)}
                      >
                        <ArrowUpwardSharp
                          color="inherit"
                          className={classes.shadowIcons}
                          key={`like-icon-key-${memes[index].id}`}
                        />
                      </IconButton>
                      <InputLabel
                        disabled
                        readOnly
                        className={classes.whiteColor}
                        id="filled-likes"
                        shrink
                        key={`input-like-key-${memes[index].id}`}
                      >
                        {parseInt(memes[index].likes, 10).toLocaleString()}
                      </InputLabel>

                      <IconButton
                        color="inherit"
                        aria-label="dislike"
                        className={classes.dislikeIcon}
                        onClick={this.handleLikeDislike(0)}
                        key={`dislike-key-${memes[index].id}`}
                      >
                        <ArrowDownwardSharp
                          color="inherit"
                          key={`dislike-icon-key-${memes[index].id}`}
                          className={classes.shadowIcons}
                        />
                      </IconButton>
                      <InputLabel
                        disabled
                        readOnly
                        id="filled-dislikes"
                        shrink
                        className={classes.whiteColor}
                        color="inherit"
                        key={`input-dislike-key-${memes[index].id}`}
                      >
                        {parseInt(memes[index].dislikes, 10).toLocaleString()}
                      </InputLabel>
                    </div>
                    <div className={classes.shareParentDiv}>
                      <RedditShareButton
                        className={classes.shadowIcons}
                        url={memes[index].url}
                      >
                        <RedditIcon size={28} />
                      </RedditShareButton>
                      <RedditShareCount url={memes[index].url}>
                        {count => (count === 0 ? '' : count)}
                      </RedditShareCount>
                      <FacebookShareButton
                        className={classes.shadowIcons}
                        url={memes[index].url}
                      >
                        <FacebookIcon size={28} />
                      </FacebookShareButton>

                      <FacebookShareCount url={memes[index].url}>
                        {count => (count === 0 ? '' : count)}
                      </FacebookShareCount>
                      <TwitterShareButton
                        className={classes.shadowIcons}
                        url={memes[index].url}
                      >
                        <TwitterIcon size={28} />
                      </TwitterShareButton>

                      <TelegramShareButton
                        className={classes.shadowIcons}
                        url={memes[index].url}
                      >
                        <TelegramIcon size={28} />
                      </TelegramShareButton>
                    </div>
                    <div
                      className={classes.commentsHandler}
                      key={`div-comment-handler-key-${memes[index].id}`}
                    >
                      <InputLabel
                        disabled
                        readOnly
                        id="filled-comments"
                        className={classes.whiteColor}
                        shrink
                        color="inherit"
                        key={`input-comment-key-${memes[index].id}`}
                      >
                        {parseInt(
                          memes[index].nbrComments,
                          10,
                        ).toLocaleString()}
                      </InputLabel>
                      <IconButton
                        color="inherit"
                        className={classes.whiteColor}
                        aria-label="OpenComments"
                        onClick={this.handleClickOpenComments}
                        key={`comment-key-${memes[index].id}`}
                      >
                        <CommentSharp
                          color="inherit"
                          className={classes.shadowIcons}
                          key={`comment-icon-key-${memes[index].id}`}
                        />
                      </IconButton>
                    </div>
                  </div>
                )}
                <div>
                  {this.state.openComments && (
                    <CommentsComponent
                      meme={memes[index]}
                      key={`comment-component-key-${memes[index].id}`}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  }
}

Post.propTypes = {
  memes: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  dbUser: PropTypes.object,
  likeDislike: PropTypes.func,
  reportMemesSlide: PropTypes.func,
  classes: PropTypes.object.isRequired,
  index: PropTypes.number,
  widthDiv: PropTypes.string,
  openComments: PropTypes.bool,
  imgStatus: PropTypes.string,
  theme: PropTypes.object,
};
const mapDispatchToProps = dispatch => ({
  likeDislike: likeDislikeObjToSend =>
    dispatch(likeDislike(likeDislikeObjToSend)),
  reportMemesSlide: idPost => dispatch(reportMemesSlide(idPost)),
});

const mapStateToProps = createStructuredSelector({
  memes: makeSelecMemesSlide(),
  dbUser: makeSelecDBUser(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  sizeMe(),
  withTheme(),
  withStyles(styles),
)(Post);
