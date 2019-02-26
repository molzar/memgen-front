import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { Stage, Layer } from 'react-konva';
import { connect } from 'react-redux';
import URLImage from './URLImage';
import MyText from './MyText';
import { makeSelectImage, makeSelectLoadedImage } from './selectors';
class MyCanvas extends Component {
  componentDidMount() {
    if (this.stage && this.stage.getLayer()) this.stage.getLayer().batchDraw();
  }

  componentDidUpdate() {
    if (this.stage && this.stage.getLayer()) this.stage.getLayer().batchDraw();
  }

  render() {
    const { loadedImage, image } = this.props;
    const localWidth =
      loadedImage && loadedImage.width ? loadedImage.width : image.width;
    const localHeight =
      loadedImage && loadedImage.height ? loadedImage.height : image.height;
    return (
      <div id="WorkingCanvas" width={localWidth + 1} height={localHeight + 1}>
        <Stage
          width={localWidth}
          height={localHeight}
          //   ref={ref => {
          //     this.stage = ref;
          //   }}
          ref={this.stage}
        >
          <Layer ref={this.layer}>
            <URLImage />
            <MyText name="txt1" />
            <MyText name="txt2" />
          </Layer>
        </Stage>
      </div>
    );
  }
}

MyCanvas.propTypes = { loadedImage: PropTypes.object, image: PropTypes.object };

const mapStateToProps = createStructuredSelector({
  image: makeSelectImage(),
  loadedImage: makeSelectLoadedImage(),
});

const withConnect = connect(
  mapStateToProps,
  null,
);

export default withConnect(MyCanvas);
