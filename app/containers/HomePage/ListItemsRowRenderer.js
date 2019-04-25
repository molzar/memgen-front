import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import ArrowUpwardSharp from '@material-ui/icons/ArrowUpwardSharp';
import ArrowDownwardSharp from '@material-ui/icons/ArrowDownwardSharp';
import CommentSharp from '@material-ui/icons/CommentSharp';
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
import { withStyles, withTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { likeDislike, removePost, reportMemesSlide } from './actions';
import TopPost from '../../components/TopPost';

const styles = theme => ({
  bottomHandler: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: theme.palette.primary.light,
  },
  commentsHandler: {
    float: 'right',
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
    height: '50px',
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
    color: 'white !important',
  },
  textColor: {
    color: theme.palette.primary.contrastText,
  },
  shareParentDiv: {
    display: 'inline-flex',
    alignItems: 'center',
    margin: 'auto',
    color: theme.palette.background.paper,
  },
  buttonNo: {
    backgroundColor: theme.palette.primary2.main,
  },
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class ListItemsRowRenderer extends React.Component {
  state = {
    open: false,
    openComments: false,
    openDialogDelete: false,
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

  handleClickOpenDialogDelete = () => {
    this.setState({ openDialogDelete: true });
  };

  handleCloseDialogDelete = () => {
    this.setState({ openDialogDelete: false });
  };

  handlePostDelete = () => {
    this.setState({ openDialogDelete: false });
    const { meme } = this.props;
    this.props.removePost(-1, meme.id, meme.delete_hash);
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

  reportMemesSlide = idPost => {
    this.props.reportMemesSlide(idPost);
  };

  render() {
    const { meme, style, classes, measure, dbUser, idUserPage } = this.props;

    return (
      <div
        id={`list-item-${meme.id}`}
        style={style}
        key={`list-item-${meme.id}`}
        className={classes.itemRow}
      >
        <TopPost meme={meme} reportMemesSlide={this.reportMemesSlide} />
        <Link
          style={{ textDecoration: 'none' }}
          params={{ id: meme.id }}
          to={`${idUserPage ? `/${idUserPage}` : ''}/post/${meme.id}/false`}
        >
          <div
            id={`container-img-${meme.id}`}
            key={`container-img-${meme.id}`}
            tabIndex="0"
            onClick={this.handleClickOpen}
            onKeyPress={() => {}}
            role="button"
          >
            <img
              src={`/api/proxy/${encodeURIComponent(meme.url)}?width=${
                window.document.body.offsetWidth > 540
                  ? 540
                  : window.document.body.offsetWidth
              }`}
              alt=":)"
              key={`list-img-${meme.id}`}
              onLoad={measure}
              className={classes.imgClass}
            />
          </div>
        </Link>
        <div
          className={classes.bottomHandler}
          key={`bottom-handler-utils-${meme.id}`}
        >
          <div>
            <IconButton
              className={classes.likeIcon}
              aria-label="Like"
              onClick={this.handleLikeDislike(1)}
            >
              <ArrowUpwardSharp
                color="inherit"
                className={classes.shadowIcons}
              />
            </IconButton>
            <InputLabel
              disabled
              readOnly
              id="filled-likes"
              shrink
              className={classes.textColor}
            >
              {parseInt(meme.likes, 10).toLocaleString()}
            </InputLabel>

            <IconButton
              className={classes.dislikeIcon}
              aria-label="dislike"
              onClick={this.handleLikeDislike(0)}
            >
              <ArrowDownwardSharp
                color="inherit"
                className={classes.shadowIcons}
              />
            </IconButton>
            <InputLabel
              disabled
              readOnly
              id="filled-dislikes"
              shrink
              className={classes.textColor}
            >
              {parseInt(meme.dislikes, 10).toLocaleString()}
            </InputLabel>
          </div>
          <div className={classes.shareParentDiv}>
            <RedditShareButton className={classes.shadowIcons} url={meme.url}>
              <RedditIcon size={28} />
            </RedditShareButton>
            <RedditShareCount url={meme.url}>
              {count => (count === 0 ? '' : count)}
            </RedditShareCount>
            <FacebookShareButton className={classes.shadowIcons} url={meme.url}>
              <FacebookIcon size={28} />
            </FacebookShareButton>

            <FacebookShareCount url={meme.url}>
              {count => (count === 0 ? '' : count)}
            </FacebookShareCount>
            <TwitterShareButton className={classes.shadowIcons} url={meme.url}>
              <TwitterIcon size={28} />
            </TwitterShareButton>

            <TelegramShareButton className={classes.shadowIcons} url={meme.url}>
              <TelegramIcon size={28} />
            </TelegramShareButton>
          </div>
          <Link
            style={{ textDecoration: 'none' }}
            to={`${idUserPage ? `/${idUserPage}` : ''}/post/${meme.id}/true`}
          >
            <div className={classes.commentsHandler}>
              <InputLabel
                disabled
                readOnly
                id="filled-dislikes"
                shrink
                className={classes.textColor}
              >
                {parseInt(meme.nbrComments, 10).toLocaleString()}
              </InputLabel>
              <IconButton
                className={classes.textColor}
                aria-label="OpenComments"
                onClick={this.handleClickOpenCommentsAndDialog}
              >
                <CommentSharp color="inherit" className={classes.shadowIcons} />
              </IconButton>
            </div>
          </Link>
        </div>
        {meme.id_user &&
          dbUser.id &&
          dbUser.id === meme.id_user && (
          <div
            className={classes.bottomHandler}
            key={`bottom-handler-detele-${meme.id}`}
          >
            <Button
              variant="contained"
              color="secondary"
              size="small"
              style={{ borderRadius: '0px' }}
              onClick={this.handleClickOpenDialogDelete}
            >
              <FormattedMessage {...messages.deleteMeme} />
            </Button>
            <Dialog
              open={this.state.openDialogDelete}
              onClose={this.handleCloseDialogDelete}
              aria-labelledby="alert-dialog-slide-title"
              TransitionComponent={Transition}
              style={{ borderRadius: '0px' }}
              PaperProps={{ style: { borderRadius: '0px' } }}
            >
              <DialogTitle id="alert-dialog-slide-title">
                  Really ?
              </DialogTitle>
              <DialogActions>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={this.handlePostDelete}
                  style={{ borderRadius: '0px' }}
                >
                    Yes
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={this.handleCloseDialogDelete}
                  className={classes.buttonNo}
                  style={{ borderRadius: '0px' }}
                >
                    No
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        )}
        <div className={classes.emptyDiv} />
      </div>
    );
  }
}

ListItemsRowRenderer.propTypes = {
  meme: PropTypes.object,
  style: PropTypes.object,
  dbUser: PropTypes.object,
  likeDislike: PropTypes.func,
  removePost: PropTypes.func,
  reportMemesSlide: PropTypes.func,
  classes: PropTypes.object.isRequired,
  measure: PropTypes.func,
  idUserPage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
const mapDispatchToProps = dispatch => ({
  likeDislike: likeDislikeObjToSend =>
    dispatch(likeDislike(likeDislikeObjToSend)),
  removePost: (indexPost, idPost, deletehash) =>
    dispatch(removePost(indexPost, idPost, deletehash)),
  reportMemesSlide: idPost => dispatch(reportMemesSlide(idPost)),
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
  withTheme(),
  withStyles(styles),
)(ListItemsRowRenderer);
