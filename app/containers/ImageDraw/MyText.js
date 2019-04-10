import React from 'react';
import { fromJS } from 'immutable';
import { Text } from 'react-konva';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import { loadTextAttrs } from './actions';
import {
  makeSelectTextAttrs,
  makeSelectImage,
  makeSelectLoadedImage,
} from './selectors';

class MyText extends React.Component {
  constructor(props) {
    super(props);
    this.text = React.createRef();
  }

  componentDidMount() {
    if (this.stage && this.stage.getLayer()) this.stage.getLayer().batchDraw();
  }

  componentDidUpdate() {
    if (this.stage && this.stage.getLayer()) this.stage.getLayer().batchDraw();
    if (this.props.loadedImage.width <= this.text.current.textWidth) {
      this.text.current.width(this.props.loadedImage.width);
    }
    // } else {
    //   this.text.current.width(this.text.current.textWidth);
    // }
  }

  handleDragEnd = name => e => {
    const textAttrs = { ...this.props.textAttrs };
    textAttrs[name].text.x = e.target.attrs.x;
    textAttrs[name].text.y = e.target.attrs.y;
    this.props.loadTextAttrs(fromJS(textAttrs));
  };

  handleDragMove = name => e => {
    const { loadedImage, textAttrs } = this.props;
    const newX = e.target.x();
    const newY = e.target.y();
    const textWidth = e.target.getWidth();
    const textHeight = e.target.getHeight();
    let newerX = newX;
    let newerY = newY;
    const CANVAS_INNER_PADDING = 1;
    if (newX < CANVAS_INNER_PADDING) {
      newerX = CANVAS_INNER_PADDING;
    }
    if (newX > loadedImage.width - CANVAS_INNER_PADDING - textWidth) {
      newerX = loadedImage.width - CANVAS_INNER_PADDING - textWidth;
    }

    if (newY < CANVAS_INNER_PADDING) {
      newerY = CANVAS_INNER_PADDING;
    }

    if (newY > loadedImage.height - CANVAS_INNER_PADDING - textHeight) {
      newerY = loadedImage.height - CANVAS_INNER_PADDING - textHeight;
    }

    textAttrs[name].text.x = newerX;
    textAttrs[name].text.y = newerY;
    this.props.loadTextAttrs(fromJS(textAttrs));
    this.text.current.setAttr('x', newerX);
    this.text.current.setAttr('y', newerY);
  };

  render() {
    const { textAttrs, name } = this.props;
    return (
      <Text
        ref={this.text}
        x={textAttrs[name].text.x}
        y={textAttrs[name].text.y}
        wrap="word"
        draggable
        fontSize={textAttrs[name].text.fontSize}
        fontFamily={textAttrs[name].text.fontFamily}
        fill={`rgba(${textAttrs[name].color.r}, ${textAttrs[name].color.g}, ${
          textAttrs[name].color.b
        }, ${textAttrs[name].color.a})`}
        text={textAttrs[name].text.text.toUpperCase()}
        stroke={textAttrs[name].text.stroke}
        onDragEnd={this.handleDragEnd(name)}
        onDragMove={this.handleDragMove(name)}
      />
    );
  }
}

MyText.propTypes = {
  textAttrs: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  loadTextAttrs: PropTypes.func,
  loadedImage: PropTypes.object,
};

const mapDispatchToProps = dispatch => ({
  loadTextAttrs: textAttrs => dispatch(loadTextAttrs(textAttrs)),
});

const mapStateToProps = createStructuredSelector({
  textAttrs: makeSelectTextAttrs(),
  image: makeSelectImage(),
  loadedImage: makeSelectLoadedImage(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default withConnect(MyText);
