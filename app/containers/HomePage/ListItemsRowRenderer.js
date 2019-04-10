import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import ThumbUp from '@material-ui/icons/ThumbUp';
import ThumbDown from '@material-ui/icons/ThumbDown';
import Comment from '@material-ui/icons/Comment';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
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
import { makeSelecDBUser } from 'containers/App/selectors';
import { withStyles } from '@material-ui/core/styles';
import Config from '../../../server/conf/config';
import { likeDislike } from './actions';

const styles = () => ({
  imageDialog: {
    padding: '5px 5px 5px 5px !important',
  },
  noPadding: {
    padding: '5px 5px 5px 5px !important',
  },
  root: {
    marginLeft: 'auto !important',
  },
  bottomHandler: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#3f51b5',
    // borderBottomLeftRadius: '10px',
    // borderBottomRightRadius: '10px',
  },
  commentsHandler: {
    float: 'right',
  },
  containerImage: {
    // paddingTop: '20px',
  },
  itemRow: {
    flexDirection: 'column',
    alignItems: 'center',
    // padding: '0 5px',
    display: 'inline-block',

    // marginBottom: '20px',
    // marginTop: '30px',
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
  shareParentDiv: {
    display: 'inline-flex',
    alignItems: 'center',
    margin: 'auto',
    color: 'white',
  },
  somePadding: {
    // border: '2px solid white',
    margin: '5px',
    boxShadow: '0.1px 0.1px 0.1px 2px rgba(255, 255, 255, .2)',
  },
});

class ListItemsRowRenderer extends React.Component {
  state = {
    open: false,
    openComments: false,
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleClickOpenCommentsAndDialog = () => {
    this.setState(prevState => ({
      openComments: !prevState.openComments,
      open: !prevState.open,
    }));
  };

  handleClickOpenComments = () => {
    this.setState(prevState => ({
      openComments: !prevState.openComments,
    }));
  };

  handleCloseComments = () => {
    this.setState({ openComments: false });
  };

  handleLikeDislike = likeDislikeObj => () => {
    const { meme, dbUser } = this.props;
    if (meme.id && dbUser.id) {
      this.props.likeDislike({
        postId: meme.id,
        userId: dbUser.id,
        like: likeDislikeObj,
      });
    }
  };

  render() {
    const { meme, style, classes, measure, idUserPage } = this.props;

    return (
      <div
        id={`list-item-${meme.id}`}
        style={style}
        key={`list-item-${meme.id}`}
        className={classes.itemRow}
        onLoad={measure}
      >
        <div className={classes.emptyDiv} />
        <Link
          style={{ textDecoration: 'none' }}
          params={{ id: meme.id }}
          to={`${idUserPage ? `/${idUserPage}` : ''}/post/${meme.id}`}
        >
          <div
            id={`container-img-${meme.id}`}
            key={`container-img-${meme.id}`}
            tabIndex="0"
            onClick={this.handleClickOpen}
            onKeyPress={() => {}}
            role="button"
            className={classes.containerImage}
          >
            <img
              src={`/api/proxy/${encodeURIComponent(meme.url)}`}
              alt={`/api/proxy/${encodeURIComponent(meme.url)}`}
              key={`list-img-${meme.id}`}
              // onLoad={measure}
              className={classes.imgClass}
            />
          </div>
        </Link>
        <div className={classes.bottomHandler}>
          <div>
            <IconButton
              className={classes.likeIcon}
              aria-label="Like"
              onClick={this.handleLikeDislike(1)}
            >
              <ThumbUp color="inherit" />
            </IconButton>
            <InputLabel
              disabled
              readOnly
              id="filled-likes"
              shrink
              className={classes.whiteColor}
            >
              {parseInt(meme.likes, 10).toLocaleString()}
            </InputLabel>

            <IconButton
              className={classes.dislikeIcon}
              aria-label="dislike"
              onClick={this.handleLikeDislike(0)}
            >
              <ThumbDown color="inherit" />
            </IconButton>
            <InputLabel
              disabled
              readOnly
              id="filled-dislikes"
              shrink
              className={classes.whiteColor}
            >
              {parseInt(meme.dislikes, 10).toLocaleString()}
            </InputLabel>
          </div>
          <div className={classes.shareParentDiv}>
            <RedditShareButton className={classes.somePadding} url={meme.url}>
              <RedditIcon size={32} />
            </RedditShareButton>
            <RedditShareCount url={meme.url}>
              {count => (count === 0 ? '' : count)}
            </RedditShareCount>
            <FacebookShareButton className={classes.somePadding} url={meme.url}>
              <FacebookIcon size={32} />
            </FacebookShareButton>

            <FacebookShareCount url={meme.url}>
              {count => (count === 0 ? '' : count)}
            </FacebookShareCount>
            <TwitterShareButton className={classes.somePadding} url={meme.url}>
              <TwitterIcon size={32} />
            </TwitterShareButton>

            <TelegramShareButton className={classes.somePadding} url={meme.url}>
              <TelegramIcon size={32} />
            </TelegramShareButton>
          </div>
          <div className={classes.commentsHandler}>
            <InputLabel
              disabled
              readOnly
              id="filled-dislikes"
              shrink
              className={classes.whiteColor}
            >
              {parseInt(meme.nbrComments, 10).toLocaleString()}
            </InputLabel>
            <IconButton
              className={classes.whiteColor}
              aria-label="OpenComments"
              onClick={this.handleClickOpenCommentsAndDialog}
            >
              <Comment color="inherit" />
            </IconButton>
          </div>
        </div>
      </div>
    );
  }
}

ListItemsRowRenderer.propTypes = {
  meme: PropTypes.object,
  style: PropTypes.object,
  dbUser: PropTypes.object,
  likeDislike: PropTypes.func,
  classes: PropTypes.object.isRequired,
  measure: PropTypes.func,
  idUserPage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
const mapDispatchToProps = dispatch => ({
  likeDislike: likeDislikeObjToSend =>
    dispatch(likeDislike(likeDislikeObjToSend)),
});

const mapStateToProps = createStructuredSelector({
  dbUser: makeSelecDBUser(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withStyles(styles),
)(ListItemsRowRenderer);
