/*
 * HomePage Messages
 *
 * This contains all the text for the HomePage component.
 */
import { defineMessages } from 'react-intl';

export const scope = 'boilerplate.containers.ImageDraw';

export default defineMessages({
  titleMakeYourOwnMeme: {
    id: `${scope}.titleMakeYourOwnMeme`,
    defaultMessage: 'Make your own MeMe',
  },
  clickSave: {
    id: `${scope}.clickSave`,
    defaultMessage: "Click Save icon when you're pleased",
  },
  placeholderFirstText: {
    id: `${scope}.placeholderFirstText`,
    defaultMessage: 'CHANGE ME NOW',
  },
  placeholderSecondText: {
    id: `${scope}.placeholderSecondText`,
    defaultMessage: 'DRAG ME LATER',
  },
  placeholderUploadImage: {
    id: `${scope}.placeholderUploadImage`,
    defaultMessage: 'Upload image from url...',
  },
  downloadPictureText: {
    id: `${scope}.downloadPictureText`,
    defaultMessage: 'Click the picture to download it.',
  },
  replayText: {
    id: `${scope}.replayText`,
    defaultMessage: 'Click Replay icon to start from scratch.',
  },
  labelImageUrl: {
    id: `${scope}.labelImageUrl`,
    defaultMessage: 'Image URL',
  },
  placeholderUploadImageLocal: {
    id: `${scope}.placeholderUploadImageLocal`,
    defaultMessage: 'Choose image',
  },
  or: {
    id: `${scope}.or`,
    defaultMessage: 'or',
  },
});
