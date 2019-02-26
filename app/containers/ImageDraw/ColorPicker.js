import React from 'react';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { SketchPicker } from 'react-color';
import { fromJS } from 'immutable';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import { loadTextAttrs } from './actions';
import { makeSelectTextAttrs } from './selectors';

const styles = () => ({
  color: {
    height: '20px',
    borderRadius: '2px',
  },
  swatch: {
    padding: '5px',
    background: '#fff',
    borderRadius: '1px',
    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
    display: 'inline-block',
    cursor: 'pointer',
  },
  popover: {
    position: 'absolute',
    zIndex: '2',
  },
  cover: {
    position: 'fixed',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
  },
});

class ColorPicker extends React.Component {
  handleClick = name => () => {
    const textAttrs = { ...this.props.textAttrs };
    textAttrs[name].displayColorPicker = !textAttrs[name].displayColorPicker;
    this.props.loadTextAttrs(fromJS(textAttrs));
  };

  handleClose = name => () => {
    const textAttrs = { ...this.props.textAttrs };
    textAttrs[name].displayColorPicker = false;
    this.props.loadTextAttrs(fromJS(textAttrs));
  };

  handleChange = name => color => {
    const textAttrs = { ...this.props.textAttrs };
    textAttrs[name].color = color.rgb;
    this.props.loadTextAttrs(fromJS(textAttrs));
  };

  render() {
    const { textAttrs, name, classes } = this.props;
    return (
      <div>
        <Button
          className={classes.swatch}
          onClick={this.handleClick(name)}
          onKeyDown={this.handleClick(name)}
        >
          <div
            className={classes.color}
            style={{
              background: `rgba(${textAttrs[name].color.r}, ${
                textAttrs[name].color.g
              }, ${textAttrs[name].color.b}, ${textAttrs[name].color.a})`,
            }}
          />
        </Button>
        {textAttrs[name].displayColorPicker ? (
          <Button
            className={classes.popover}
            onClick={this.handleClose(name)}
            onKeyDown={this.handleClose(name)}
          >
            <div className={classes.cover} />
            <SketchPicker
              color={textAttrs[name].color}
              style={{
                background: `rgba(${textAttrs[name].color.r}, ${
                  textAttrs[name].color.g
                }, ${textAttrs[name].color.b}, ${textAttrs[name].color.a})`,
              }}
              onChange={this.handleChange(name)}
            />
          </Button>
        ) : null}
      </div>
    );
  }
}

ColorPicker.propTypes = {
  textAttrs: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  loadTextAttrs: PropTypes.func,
  classes: PropTypes.object,
};

const mapDispatchToProps = dispatch => ({
  loadTextAttrs: textAttrs => dispatch(loadTextAttrs(textAttrs)),
});

const mapStateToProps = createStructuredSelector({
  textAttrs: makeSelectTextAttrs(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withStyles(styles),
  withConnect,
)(ColorPicker);
