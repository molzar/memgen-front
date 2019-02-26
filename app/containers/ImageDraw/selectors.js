import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectImageDraw = state => state.get('imageDraw', initialState);

const makeSelectUploadInput = () =>
  createSelector(selectImageDraw, imageDrawState =>
    imageDrawState.get('uploadInput').toJS(),
  );

const makeSelectImage = () =>
  createSelector(selectImageDraw, imageDrawState =>
    imageDrawState.get('image').toJS(),
  );

const makeSelectLoadedImage = () =>
  createSelector(selectImageDraw, imageDrawState =>
    imageDrawState.get('loadedImage'),
  );

const makeSelectTextAttrs = () =>
  createSelector(selectImageDraw, imageDrawState =>
    imageDrawState.get('textAttrs').toJS(),
  );

const makeSelectBase64Meme = () =>
  createSelector(selectImageDraw, imageDrawState =>
    imageDrawState.get('base64Meme'),
  );

const makeSelectLatestUpload = () =>
  createSelector(selectImageDraw, imageDrawState =>
    imageDrawState.get('latestUpload').toJS(),
  );

export {
  selectImageDraw,
  makeSelectImage,
  makeSelectLoadedImage,
  makeSelectTextAttrs,
  makeSelectBase64Meme,
  makeSelectUploadInput,
  makeSelectLatestUpload,
};
