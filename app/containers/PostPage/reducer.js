import { fromJS } from 'immutable';
import {
  LOAD_MEMES_SLIDE_SUCCESS,
  UPDATE_MEME_AFTER_LIKE,
  GET_COMMENTS_SUCCESS,
  POST_COMMENT_SUCCESS,
  CHANGE_COMMENTS_NUMBER,
  REMOVE_COMMENT_SUCCESS,
  CHANGE_MIN_MAX_INDEX,
  REPORT_MEME_SLIDE_SUCCESS,
} from './constants';

export const initialState = fromJS({
  memes: [],
  deadEndMeme: {
    id: 0,
    url: 'https://i.imgur.com/JOABpP5.png',
    id_user: 0,
    likes: '1',
    dislikes: '0',
    comments: '0',
  },
  boundries: {
    minIndex: 9999,
    maxIndex: 9999,
    deadEndIdLeft: 0,
    deadEndIdRight: 99999,
  },
  comments: {},
});

function postReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_MIN_MAX_INDEX: {
      const oldBoundries = state.get('boundries').toJS();
      if (action.memesLength === 0) {
        if (action.whereToLoad === -1) {
          oldBoundries.deadEndIdLeft = oldBoundries.minIndex;
        } else {
          oldBoundries.deadEndIdRight = oldBoundries.maxIndex + 1;
        }
        return state.set('boundries', fromJS(oldBoundries));
      }
      if (action.whereToLoad === -1) {
        oldBoundries.minIndex -= action.memesLength;
      } else {
        oldBoundries.maxIndex += action.memesLength;
      }
      return state.set('boundries', fromJS(oldBoundries));
    }
    case LOAD_MEMES_SLIDE_SUCCESS: {
      switch (action.whereToLoad) {
        case -1: {
          const oldBoundries = state.get('boundries').toJS();
          const oldMemes = state.get('memes').toJS();
          const deadEndMeme = state.get('deadEndMeme').toJS();
          if (action.memes.length === 0) {
            oldMemes[oldBoundries.minIndex] = deadEndMeme;
            return state.set('memes', fromJS(oldMemes));
          }

          action.memes.forEach((k, v) => {
            oldMemes[oldBoundries.minIndex - v] = k;
          });

          oldMemes[oldBoundries.minIndex - action.memes.length] = deadEndMeme;
          return state.set('memes', fromJS(oldMemes));
        }
        case 0: {
          const emptyarr = Array(10000);
          const oldBoundries = state.get('boundries').toJS();
          const deadEndMeme = state.get('deadEndMeme').toJS();
          if (action.memes.length === 0) {
            emptyarr.push(deadEndMeme);
          } else {
            emptyarr.push(...action.memes);
          }
          emptyarr[oldBoundries.minIndex] = deadEndMeme;
          emptyarr.push(deadEndMeme);

          return state.set('memes', fromJS(emptyarr));
        }
        case 1: {
          const deadEndMeme = state.get('deadEndMeme').toJS();
          const oldMemes = state.get('memes').toJS();
          if (action.memes.length === 0) {
            return state.set('memes', fromJS(oldMemes.concat(deadEndMeme)));
          }

          return state.set('memes', fromJS(oldMemes.concat(action.memes)));
        }
        default: {
          return state;
        }
      }
    }
    case UPDATE_MEME_AFTER_LIKE: {
      const oldMemes = state.get('memes').toJS();
      oldMemes[
        oldMemes.findIndex(meme => meme && meme.id === action.newMeme.id)
      ] = action.newMeme;
      return state.set('memes', fromJS(oldMemes));
    }
    case GET_COMMENTS_SUCCESS: {
      const oldComments = state.get('comments').toJS();
      if (action.idParent) {
        oldComments[action.idPost][
          oldComments[action.idPost].findIndex(
            el => el.id_comment === action.idParent,
          )
        ].replays = action.comments;
        return state.set('comments', fromJS(oldComments));
      }
      let oldCommentsReplays = state.get('comments').toJS()[action.idPost];
      const localComment = action.comments;
      let newCommentWithReplyIndex = -1;
      if (
        oldCommentsReplays &&
        oldCommentsReplays.length > 0 &&
        action.idPost &&
        oldCommentsReplays[0].id_post === action.idPost
      ) {
        oldCommentsReplays = oldCommentsReplays.filter(el => el.replays);
        if (oldCommentsReplays.length > 0) {
          for (let index = 0; index < oldCommentsReplays.length; index += 1) {
            newCommentWithReplyIndex = localComment.findIndex(
              el => el.id_comment === oldCommentsReplays[index].id_comment,
            );
            if (newCommentWithReplyIndex > -1) {
              localComment[newCommentWithReplyIndex].replays =
                oldCommentsReplays[index].replays;
            }
          }
        }
      }
      oldComments[action.idPost] = localComment;
      return state.set('comments', fromJS(oldComments));
    }

    case POST_COMMENT_SUCCESS: {
      const oldComments = state.get('comments').toJS();
      oldComments[action.idPost] = action.comments;
      return state.set('comments', fromJS(oldComments));
    }
    case REMOVE_COMMENT_SUCCESS: {
      const oldComments = state.get('comments').toJS();
      if (action.idParent) {
        oldComments[action.idPost][
          oldComments[action.idPost].findIndex(
            el => el.id_comment === action.idParent,
          )
        ].replays = oldComments[action.idPost][
          oldComments[action.idPost].findIndex(
            el => el.id_comment === action.idParent,
          )
        ].replays.filter(el => el.id_comment !== action.commentId);

        return state.set('comments', fromJS(oldComments));
      }
      oldComments[action.idPost] = oldComments[action.idPost].filter(
        el => el.id_comment !== action.commentId,
      );
      return state.set('comments', fromJS(oldComments));
    }
    case CHANGE_COMMENTS_NUMBER: {
      if (action.idParent) {
        const oldsComments = state.get('comments').toJS();
        const parentCommentReplayIndex = oldsComments[action.idPost].findIndex(
          comment => comment.id_comment === action.idParent,
        );
        oldsComments[action.idPost][parentCommentReplayIndex].count_replay =
          action.nbrComment !== -1
            ? action.nbrComment
            : oldsComments[action.idPost][parentCommentReplayIndex]
              .count_replay - 1;
        return state.set('comments', fromJS(oldsComments));
      }
      const oldsMemes = state.get('memes').toJS();
      const parentMemeIdenx = oldsMemes.findIndex(
        meme => meme && meme.id === action.idPost,
      );
      oldsMemes[parentMemeIdenx].nbrComments =
        action.nbrComment !== -1
          ? action.nbrComment
          : oldsMemes[parentMemeIdenx].nbrComments - 1;
      return state.set('memes', fromJS(oldsMemes));
    }
    case REPORT_MEME_SLIDE_SUCCESS: {
      const oldMemes = state.get('memes').toJS();
      oldMemes[
        oldMemes.findIndex(meme => meme && meme.id === action.post)
      ].reported += 1;
      return state.set('memes', fromJS(oldMemes));
    }
    default:
      return state;
  }
}

export default postReducer;
