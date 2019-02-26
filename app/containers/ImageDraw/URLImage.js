import React from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import { Image } from 'react-konva';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  makeSelectImage,
  makeSelectUploadInput,
  makeSelectTextAttrs,
  makeSelectLoadedImage,
} from './selectors';
import { setLoadedImage, setUploadInput, loadTextAttrs } from './actions';

class URLImage extends React.Component {
  state = { image: null };

  componentDidMount() {
    this.loadImage();
    this.imageNode.getLayer().batchDraw();
  }

  componentDidUpdate(oldProps) {
    if (oldProps.image.src !== this.props.image.src) {
      this.loadImage();
      this.imageNode.getLayer().batchDraw();
    }
  }

  componentWillUnmount() {
    this.image.removeEventListener('load', this.handleLoad);
  }

  loadImage() {
    this.image = new window.Image();
    this.image.crossOrigin = this.props.image.crossOrigin;
    this.image.addEventListener('load', this.handleLoad);
    this.image.src = this.props.image.src;
    // if (this.props.loadedImage && this.props.loadedImage.src) {
    //   this.image.src = this.props.loadedImage.src;
    // } else {

    // }
  }

  handleLoad = () => {
    this.handleLoadedImage(this.image);
    this.setState({
      image: this.image,
    });
  };

  handleLoadedImage(loadedImage) {
    this.props.setLoadedImage(fromJS(loadedImage));
    const uploadInput = { ...this.props.uploadInput };
    uploadInput.value = '';
    this.props.setUploadInput(fromJS(uploadInput));
    const textAttrs = { ...this.props.textAttrs };
    textAttrs.txt1.text.x =
      loadedImage.width / 2 - this.imageNode.parent.children[1].textWidth / 2;
    textAttrs.txt1.text.y = 10;
    textAttrs.txt2.text.x =
      loadedImage.width / 2 - this.imageNode.parent.children[2].textWidth / 2;
    textAttrs.txt2.text.y =
      loadedImage.height - 10 - this.imageNode.parent.children[2].textHeight;
    this.props.loadTextAttrs(fromJS(textAttrs));
  }

  render() {
    return (
      <Image
        image={this.state.image}
        ref={node => {
          this.imageNode = node;
        }}
      />
    );
  }
}

URLImage.propTypes = {
  image: PropTypes.object,
  setLoadedImage: PropTypes.func,
  uploadInput: PropTypes.object,
  setUploadInput: PropTypes.func,
  loadTextAttrs: PropTypes.func,
  textAttrs: PropTypes.object,
};

const mapDispatchToProps = dispatch => ({
  setLoadedImage: loadedImage => dispatch(setLoadedImage(loadedImage)),
  setUploadInput: uploadInput => dispatch(setUploadInput(uploadInput)),
  loadTextAttrs: textAttrs => dispatch(loadTextAttrs(textAttrs)),
});

const mapStateToProps = createStructuredSelector({
  image: makeSelectImage(),
  uploadInput: makeSelectUploadInput(),
  textAttrs: makeSelectTextAttrs(),
  loadedImage: makeSelectLoadedImage(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default withConnect(URLImage);
