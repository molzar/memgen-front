/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
import Image from 'material-ui-image';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import ThumbUp from '@material-ui/icons/ThumbUp';
import ThumbDown from '@material-ui/icons/ThumbDown';
import Comment from '@material-ui/icons/Comment';
import sizeMe from 'react-sizeme';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { makeSelecDBUser } from 'containers/App/selectors';
import { CardContent, Card } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
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
import Config from '../../../server/conf/config';

import CommentsComponent from './CommentsComponent';
import { makeSelecMemesSlide } from './selectors';
import { likeDislike } from '../HomePage/actions';
const styles = () => ({
  imageDialog: {
    padding: '0px 0px 0px 0px !important',
    width: '540xp',
  },
  noPadding: {
    padding: '0px 0px 0px 0px !important',
  },
  root: {
    paddingTop: '85px !important',
  },
  somePadding: {
    // border: '2px solid white',
    margin: '5px',
    boxShadow: '0.1px 0.1px 0.1px 2px rgba(255, 255, 255, .2)',
  },
  bottomHandler: {
    backgroundColor: '#0c1024',
    display: 'flex',
    flexDirection: 'row',
  },
  commentsHandler: {
    // marginInlineStart: 'auto',
    // margin: 'auto',
    float: 'right',
  },
  containerImage: {
    // paddingTop: '20px',
  },
  cardRoot: {
    borderRadius: '0px !important',
  },
  itemRow: {
    flexDirection: 'column',
    alignItems: 'center',
    display: 'inline-block',
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
  shareParentDiv: {
    display: 'inline-flex',
    alignItems: 'center',
    margin: 'auto',
    color: 'white',
  },
});

export class Post extends React.Component {
  constructor() {
    super();
    this.state = {
      openComments: false,
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

  render() {
    const { index, classes, memes, widthDiv } = this.props;
    return (
      <>
        {memes[index] && (
          <div style={{ width: widthDiv }}>
            <Card
              aria-labelledby="scroll-dialog-title"
              key={`dialog-key-${memes[index].id}`}
              className={classes.cardRoot}
            >
              <CardContent
                className={classes.noPadding}
                key={`dialog-content-${memes[index].id}`}
              >
                <Image
                  className={classes.imageDialog}
                  key={`dialog-content-text-${memes[index].id}`}
                  src={`/api/proxy/${encodeURIComponent(memes[index].url)}`}
                  alt={`/api/proxy/${encodeURIComponent(memes[index].url)}`}
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
                        <ThumbUp key={`like-icon-key-${memes[index].id}`} />
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
                        <ThumbDown
                          key={`dislike-icon-key-${memes[index].id}`}
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
                        className={classes.somePadding}
                        url={memes[index].url}
                      >
                        <RedditIcon size={28} />
                      </RedditShareButton>
                      <RedditShareCount url={memes[index].url}>
                        {count => (count === 0 ? '' : count)}
                      </RedditShareCount>
                      <FacebookShareButton
                        className={classes.somePadding}
                        url={memes[index].url}
                      >
                        <FacebookIcon size={28} />
                      </FacebookShareButton>

                      <FacebookShareCount url={memes[index].url}>
                        {count => (count === 0 ? '' : count)}
                      </FacebookShareCount>
                      <TwitterShareButton
                        className={classes.somePadding}
                        url={memes[index].url}
                      >
                        <TwitterIcon size={28} />
                      </TwitterShareButton>

                      <TelegramShareButton
                        className={classes.somePadding}
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
                        <Comment key={`comment-icon-key-${memes[index].id}`} />
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
      </>
    );
  }
}

Post.propTypes = {
  memes: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  dbUser: PropTypes.object,
  likeDislike: PropTypes.func,
  classes: PropTypes.object.isRequired,
  index: PropTypes.number,
  widthDiv: PropTypes.string,
};
const mapDispatchToProps = dispatch => ({
  likeDislike: likeDislikeObjToSend =>
    dispatch(likeDislike(likeDislikeObjToSend)),
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
  withStyles(styles),
)(Post);
