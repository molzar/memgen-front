import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';

class ImgWithSpinner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageStatus: props.imgStatus || 'loading',
    };
  }

  componentDidMount() {
    this.setState({ imageStatus: 'loading' });
  }

  componentDidUpdate = prevProps => {
    if (prevProps.meme.url !== this.props.meme.url) {
      this.setState({ imageStatus: 'loading' });
    }
  };

  handleImageLoaded = () => {
    this.setState({ imageStatus: 'loaded' });
  };

  handleImageErrored = () => {
    this.setState({ imageStatus: 'failed to load' });
  };

  handleHashChange = () => {
    this.setState({ imageStatus: 'loading' });
  };

  render() {
    const { meme, classes } = this.props;
    return (
      <div>
        {this.state.imageStatus === 'loading' && (
          <div
            key={`container-loading-${meme.id}`}
            className={classes.containerLoading}
          >
            <CircularProgress
              key={`loading-${meme.id}`}
              className={classes.progress}
              size={100}
            />
          </div>
        )}
        <img
          className={classes.imageDialog}
          key={`dialog-content-text-${meme.id}`}
          src={`/api/proxy/${encodeURIComponent(meme.url)}?width=${
            window.document.body.offsetWidth > 540
              ? 540
              : window.document.body.offsetWidth
          }`}
          alt=":)"
          onLoad={this.handleImageLoaded}
          onError={this.handleImageErrored}
        />
      </div>
    );
  }
}

ImgWithSpinner.propTypes = {
  classes: PropTypes.object,
  meme: PropTypes.object,
  imgStatus: PropTypes.string,
};

export default ImgWithSpinner;
