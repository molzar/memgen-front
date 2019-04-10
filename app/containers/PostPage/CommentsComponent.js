import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import sizeMe from 'react-sizeme';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import ReactPaginate from 'react-paginate';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';

import red from '@material-ui/core/colors/red';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import RemoveIcon from '@material-ui/icons/Remove';
import InputLabel from '@material-ui/core/InputLabel';
import { makeSelecGridProps, makeSelecDBUser } from '../App/selectors';
import { makeSelectComments } from './selectors';
import {
  getComments,
  postComment,
  editComment,
  removeComment,
} from './actions';

const styles = theme => ({
  card: {
    maxWidth: 'auto',
    backgroundColor: 'lightgray',
    marginTop: '5px',
    borderRadius: '0px',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
    margin: 10,
  },
  customTextField: {
    // maxWidth: '60%',
    width: 'inherit',
    color: 'white',
    flex: '1 1 25%',
  },
  fab: {
    margin: 'auto',
  },
  whiteText: {
    color: 'white',
  },
  extendedIcon: {
    margin: '10px',
  },
  centerDiv: {
    textAlign: 'center',
    height: '75px',
  },
  replayBody: {
    margin: '10px',
    maxWidth: 'auto',
    padding: '0px',
    paddingBottom: '0px',
    borderRadius: '0px',
  },
  replayCard: {
    margin: '10px',
    maxWidth: 'auto',
    padding: '0px',
    paddingBottom: '0px',
    borderRadius: '0px',
    backgroundColor: 'darkgrey',
  },
  paginate: {
    padding: 0,
    margin: 0,
  },
  bottomHandler: {
    textAlign: 'center',
  },
  paginateli: {
    display: 'inline',
  },
  paginateliaNextComment: {
    color: '#fff',
    padding: '8px 16px',
    float: 'right',
    textDecoration: 'none',
    transition: 'background-color 0.3s',
    backgroundColor: '#3f51b5',
    marginTop: '30px',
    marginRight: '10px',
  },
  paginateliaPreviousComment: {
    color: '#fff',
    padding: '8px 16px',
    float: 'left',
    textDecoration: 'none',
    transition: 'background-color 0.3s',
    backgroundColor: '#3f51b5',
    marginTop: '30px',
    marginLeft: '10px',
  },
  paginateActive: {
    backgroundColor: '#3f51b5',
    color: 'white',
    border: '1px solid #3f51b5',
  },
  hideMe: {
    display: 'none !important',
  },
  rootdivComment: {
    backgroundColor: '#0c1024',
    paddingLeft: '5px',
    paddingRight: '5px',
    paddingBottom: '10px',
  },
});

class CommentsComponent extends Component {
  constructor(props) {
    super(props);
    this.commentsTopRef = React.createRef();
    this.state = {
      expanded: [],
      textComment: '',
      editCommentId: '',
    };
    Array(props.gridProps.limit)
      .fill(1)
      .forEach((k, v) => {
        this[`comment_${v}`] = React.createRef();
      });
    props.getComments(
      props.meme.id,
      props.gridProps.limit,
      props.gridProps.offset,
    );
  }

  resetScrollPosition = index => {
    window.scrollTo(
      0,
      this[`comment_${index || 0}`].current.offsetTop +
        this[`comment_${index || 0}`].current.offsetParent.offsetTop,
    );
  };

  restScrollToTop = () => {
    window.scrollTo(
      0,
      this.commentsTopRef.current.offsetTop +
        this.commentsTopRef.current.offsetParent.offsetTop,
    );
  };

  handlePageClick = (idComment, index) => data => {
    this.resetScrollPosition(index);

    const { gridProps, meme } = this.props;
    const offsetLocal = Math.ceil(
      data.selected *
        (gridProps.offset === 0 ? gridProps.limit : gridProps.offset),
    );
    this.props.getComments(meme.id, gridProps.limit, offsetLocal, idComment);
  };

  handleExpandClick = idComment => () => {
    this.setState(state => {
      const oldExpanded = state.expanded;
      oldExpanded[idComment] = !oldExpanded[idComment];
      return { expanded: oldExpanded };
    });
    this.props.getComments(
      this.props.meme.id,
      this.props.gridProps.limit,
      this.props.gridProps.offset,
      idComment,
    );
  };

  handlePostComment = idParentComment => () => {
    if (
      idParentComment ? this.state.replayTextComment : this.state.textComment
    ) {
      const comment = {
        id: this.state.editCommentId,
        postId: this.props.meme.id,
        userId: this.props.dbUser.id,
        textComment: idParentComment
          ? this.state.replayTextComment
          : this.state.textComment,
        limit: this.props.gridProps.limit,
        offset: this.props.gridProps.offset,
        idParent: idParentComment || '',
      };
      if (this.state.editCommentId) {
        this.props.editComment(comment);
      } else {
        this.props.postComment(comment);
      }
      if (idParentComment) {
        this.setState({ replayTextComment: '', editCommentId: '' });
      } else {
        this.setState({ textComment: '', editCommentId: '' });
      }
    }
  };

  handleEditComment = (textEditedComment, editCommentId) => () => {
    this.restScrollToTop();
    this.setState({
      textComment: textEditedComment,
      editCommentId,
    });
  };

  handleEditReplay = (replayTextComment, editCommentId, index) => () => {
    this.resetScrollPosition(index);
    this.setState({
      replayTextComment,
      editCommentId,
    });
  };

  handleRemoveComment = (postId, commentId) => () => {
    this.props.removeComment(postId, commentId);
  };

  handleTextChange = event => {
    this.setState({ textComment: event.target.value });
  };

  handleReplayTextChange = event => {
    this.setState({ replayTextComment: event.target.value });
  };

  render() {
    const { meme, classes, gridProps, dbUser, comments } = this.props;
    return (
      <div className={classes.rootdivComment} ref={this.commentsTopRef}>
        {dbUser.id && (
          <Grid container justify="flex-start" alignItems="center">
            <Avatar
              alt={dbUser.username}
              src={dbUser.avatarurl}
              className={classes.avatar}
            />
            <TextField
              placeholder="Write your comment ..."
              InputLabelProps={{ shrink: true }}
              InputProps={{ className: classes.whiteText }}
              className={classes.customTextField}
              multiline
              rows={1}
              rowsMax={4}
              ref={this.textComment}
              value={this.state.textComment}
              onChange={this.handleTextChange}
            />
            <Fab
              color="primary"
              size="small"
              aria-label="Add"
              className={classes.extendedIcon}
              onClick={this.handlePostComment()}
            >
              <AddIcon />
            </Fab>
          </Grid>
        )}
        {comments[meme.id] &&
          comments[meme.id].length > 0 &&
          comments[meme.id].map((comment, index) => (
            <div
              ref={this[`comment_${index}`]}
              key={`key-card-${comment.id_comment}`}
            >
              <Card className={classes.card} key={comment.id_comment}>
                <CardHeader
                  avatar={
                    <Avatar
                      aria-label="Recipe"
                      className={classes.avatar}
                      src={comment.avatarurl}
                      key={`AvatarComment${comment.avatarurl}`}
                    >
                      R
                    </Avatar>
                  }
                  key={`comment_${comment.id_comment}`}
                  action={
                    <div>
                      {dbUser.id &&
                        dbUser.id === comment.id_user && (
                        <Fab
                          color="primary"
                          size="small"
                          aria-label="Edit"
                          className={classes.fab}
                          onClick={this.handleEditComment(
                            comment.text_comment,
                            comment.id_comment,
                          )}
                        >
                          <EditIcon />
                        </Fab>
                      )}
                      {dbUser.id &&
                        dbUser.id === comment.id_user && (
                        <Fab
                          color="secondary"
                          size="small"
                          aria-label="Remove"
                          className={classes.fab}
                          onClick={this.handleRemoveComment(
                            comment.id_post,
                            comment.id_comment,
                          )}
                        >
                          <RemoveIcon />
                        </Fab>
                      )}

                      <IconButton
                        className={classnames(classes.expand, {
                          [classes.expandOpen]: this.state.expanded[
                            comment.id_comment
                          ],
                        })}
                        onClick={this.handleExpandClick(comment.id_comment)}
                        aria-expanded={this.state.expanded}
                        aria-label="Show more"
                      >
                        <ExpandMoreIcon />
                      </IconButton>
                      <InputLabel
                        disabled
                        readOnly
                        id="filled-count-replay"
                        shrink
                      >
                        {parseInt(comment.count_replay, 10).toLocaleString()}
                      </InputLabel>
                    </div>
                  }
                  title={
                    <TextField
                      InputLabelProps={{ shrink: true, disableUnderline: true }}
                      InputProps={{ disableUnderline: true }}
                      multiline
                      fullWidth
                      readOnly
                      rows={1}
                      rowsMax={4}
                      value={comment.text_comment}
                      onChange={this.handleTextChange}
                    />
                  }
                  subheader={comment.updated_at}
                />

                <Collapse
                  in={this.state.expanded[comment.id_comment]}
                  timeout="auto"
                  unmountOnExit
                >
                  {dbUser.id && (
                    <Grid container justify="flex-start" alignItems="center">
                      <Avatar
                        alt={dbUser.username}
                        src={dbUser.avatarurl}
                        className={classes.avatar}
                      />
                      <TextField
                        placeholder="Add a replay ..."
                        InputLabelProps={{ shrink: true }}
                        className={classes.customTextField}
                        multiline
                        fullWidth
                        rows={1}
                        rowsMax={4}
                        ref={this.replayTextComment}
                        value={this.state.replayTextComment}
                        onChange={this.handleReplayTextChange}
                      />
                      <Fab
                        color="primary"
                        size="small"
                        aria-label="Add"
                        className={classes.extendedIcon}
                        onClick={this.handlePostComment(comment.id_comment)}
                      >
                        <AddIcon />
                      </Fab>
                    </Grid>
                  )}
                  {comment.count_replay > 0 && comment.replays
                    ? comment.replays.map(replay => (
                      <CardContent
                        className={classes.replayBody}
                        key={`card-content-${replay.id_comment}`}
                      >
                        <Card
                          className={classes.replayCard}
                          key={`card-${replay.id_comment}`}
                        >
                          <CardHeader
                            key={`card-header-${replay.id_comment}`}
                            avatar={
                              <Avatar
                                aria-label={`aria-label-card-header-${
                                  replay.id_comment
                                }`}
                                className={classes.avatar}
                                src={replay.avatarurl}
                                key={`aria-label-card-header-${
                                  replay.id_comment
                                }`}
                              >
                                  R
                              </Avatar>
                            }
                            action={
                              <div>
                                {dbUser.id &&
                                    dbUser.id === replay.id_user && (
                                  <Fab
                                    color="primary"
                                    size="small"
                                    aria-label="Edit"
                                    className={classes.fab}
                                    onClick={this.handleEditReplay(
                                      replay.text_comment,
                                      replay.id_comment,
                                      // replay.id_parent,
                                      index,
                                    )}
                                    key={`edit-replay-${replay.id_comment}`}
                                  >
                                    <EditIcon />
                                  </Fab>
                                )}
                                {dbUser.id &&
                                    dbUser.id === replay.id_user && (
                                  <Fab
                                    color="secondary"
                                    size="small"
                                    aria-label="Remove"
                                    className={classes.fab}
                                    onClick={this.handleRemoveComment(
                                      replay.id_post,
                                      replay.id_comment,
                                    )}
                                    key={`delete-replay-${
                                      replay.id_comment
                                    }`}
                                  >
                                    <RemoveIcon />
                                  </Fab>
                                )}
                              </div>
                            }
                            title={
                              <TextField
                                InputLabelProps={{
                                  shrink: true,
                                  disableUnderline: true,
                                }}
                                InputProps={{ disableUnderline: true }}
                                multiline
                                fullWidth
                                readOnly
                                rows={1}
                                rowsMax={4}
                                value={replay.text_comment}
                                key={`replay-text-${replay.id_comment}`}
                              />
                            }
                            subheader={replay.updated_at}
                          />
                        </Card>
                      </CardContent>
                    ))
                    : ''}
                </Collapse>
                {comment.count_replay > gridProps.limit &&
                  this.state.expanded[comment.id_comment] && (
                  <div className={classes.centerDiv}>
                    <ReactPaginate
                      className="pagination"
                      pageCount={comment.count_replay / gridProps.limit || 1}
                      marginPagesDisplayed={0}
                      pageRangeDisplayed={0}
                      onPageChange={this.handlePageClick(
                        comment.id_comment,
                        index,
                      )}
                      containerClassName={classes.paginate}
                      activeClassName={classes.paginateActive}
                      pageClassName={classes.hideMe}
                      breakClassName={classes.hideMe}
                      previousClassName={classes.paginateli}
                      nextClassName={classes.paginateli}
                      previousLinkClassName={
                        classes.paginateliaPreviousComment
                      }
                      nextLinkClassName={classes.paginateliaNextComment}
                      key={`replay_paginate${comment.id_comment}`}
                    />
                  </div>
                )}
              </Card>
            </div>
          ))}
        {meme.nbrComments > gridProps.limit && (
          <div className={classes.centerDiv}>
            <ReactPaginate
              pageCount={meme.nbrComments / gridProps.limit || 1}
              marginPagesDisplayed={0}
              pageRangeDisplayed={0}
              onPageChange={this.handlePageClick()}
              containerClassName={classes.paginate}
              activeClassName={classes.paginateActive}
              pageClassName={classes.hideMe}
              breakClassName={classes.hideMe}
              previousClassName={classes.paginateli}
              nextClassName={classes.paginateli}
              previousLinkClassName={classes.paginateliaPreviousComment}
              nextLinkClassName={classes.paginateliaNextComment}
            />
          </div>
        )}
      </div>
    );
  }
}

CommentsComponent.propTypes = {
  meme: PropTypes.object,
  gridProps: PropTypes.object,
  classes: PropTypes.object.isRequired,
  dbUser: PropTypes.object,
  getComments: PropTypes.func,
  postComment: PropTypes.func,
  editComment: PropTypes.func,
  removeComment: PropTypes.func,
  comments: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

const mapDispatchToProps = dispatch => ({
  getComments: (idPost, limit, offset, idParent) =>
    dispatch(getComments(idPost, limit, offset, idParent)),
  postComment: comment => dispatch(postComment(comment)),
  editComment: comment => dispatch(editComment(comment)),
  removeComment: (postId, commentId) =>
    dispatch(removeComment(postId, commentId)),
});

const mapStateToProps = createStructuredSelector({
  comments: makeSelectComments(),
  gridProps: makeSelecGridProps(),
  dbUser: makeSelecDBUser(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withRouter,
  withConnect,
  sizeMe(),
  withStyles(styles),
)(CommentsComponent);
