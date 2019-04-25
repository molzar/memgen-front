import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './cssSlider.css';
import { compose } from 'redux';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { fromJS } from 'immutable';
import { makeSelectImagesSLide } from './selectors';
import { loadImageSuccess } from './actions';

const styles = theme => ({
  container: {
    margin: '0 auto',
    color: theme.palette.primary.contrastText,
    background: theme.palette.primary.main,
  },
});

class ImgSlider extends React.Component {
  handlerChangeImage = image => () => {
    this.props.loadImageSuccess(fromJS(image));
  };

  render() {
    const { classes, imagesSlide } = this.props;
    const settingsImgSlider = {
      centerMode: true,
      className: 'center',
      lazyLoad: true,
      arrows: true,
      centerPadding: '50px',
      slidesToShow: 3,
      speed: 500,
      infinite: true,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '40px',
            slidesToShow: 3,
          },
        },
        {
          breakpoint: 480,
          settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '40px',
            slidesToShow: 2,
          },
        },
      ],
    };
    const widthContainer =
      window.document.body.offsetWidth - 16 > 540
        ? 540
        : window.document.body.offsetWidth - 16;
    return (
      <div className={classes.container} style={{ width: widthContainer }}>
        <Slider {...settingsImgSlider}>
          {imagesSlide.map(item => (
            <div
              key={`div-image-slide-key-${item.key}`}
              onClick={this.handlerChangeImage(item)}
              tabIndex="-1"
              onKeyPress={() => {}}
              role="button"
            >
              <img
                src={`/api/proxy/${encodeURIComponent(item.src)}?width=${
                  window.document.body.offsetWidth > 540
                    ? 540 / 4
                    : window.document.body.offsetWidth / 3
                }`}
                alt=":)"
                key={`image-slide-key-${item.key}`}
              />
            </div>
          ))}
        </Slider>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  loadImageSuccess: image => dispatch(loadImageSuccess(image)),
});

const mapStateToProps = createStructuredSelector({
  imagesSlide: makeSelectImagesSLide(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withTheme(),
  withStyles(styles),
  withConnect,
)(ImgSlider);
