/*
 * HomePage Messages
 *
 * This contains all the text for the HomePage component.
 */
import { defineMessages } from 'react-intl';

export const scope = 'boilerplate.containers.PostPage';

export default defineMessages({
  next: {
    id: `${scope}.next`,
    defaultMessage: 'Next',
  },
  previous: {
    id: `${scope}.previous`,
    defaultMessage: 'Previous',
  },
  addCommentPlaceholder: {
    id: `${scope}.addCommentPlaceholder`,
    defaultMessage: 'Write your comment...',
  },
  addReplyPlaceholder: {
    id: `${scope}.addReplyPlaceholder`,
    defaultMessage: 'Add a reply...',
  },
});
