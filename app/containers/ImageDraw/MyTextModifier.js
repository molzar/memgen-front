import React from 'react';
import { fromJS } from 'immutable';
import PropTypes from 'prop-types';
import Input from '@material-ui/core/Input';
import { withStyles, withTheme } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import red from '@material-ui/core/colors/red';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { loadTextAttrs } from './actions';
import { makeSelectTextAttrs } from './selectors';
import ColorPicker from './ColorPicker';

const BootstrapInput = withStyles(theme => ({
  root: {
    'label + &': {
      marginTop: theme.spacing.unit * 3,
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    width: 'auto',
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  },
  iconAvg: {
    fontSize: 50,
  },
  cardInput: {
    width: '100%',
    paddingLeft: '5px',
  },
  card: {
    maxWidth: 400,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  avatar: {
    backgroundColor: red[500],
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 90,
    height: 35,
  },
  modifierRow: {
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: '10px',
    paddingRight: '10px',
  },
});

class MyTextModifier extends React.Component {
  handleTextChange = name => event => {
    const textAttrs = { ...this.props.textAttrs };
    textAttrs[name].text.text = event.target.value;
    this.props.loadTextAttrs(fromJS(textAttrs));
  };

  handleSelectChange = name => event => {
    const textAttrs = { ...this.props.textAttrs };
    textAttrs[name].text.fontSize = event.target.value;
    this.props.loadTextAttrs(fromJS(textAttrs));
  };

  render() {
    const { classes, textAttrs, name } = this.props;
    return (
      <div className={classes.modifierRow}>
        <Input
          className={classes.cardInput}
          type="text"
          value={textAttrs[name].text.text}
          onChange={this.handleTextChange(name)}
        />
        <form className={classes.container} noValidate autoComplete="off">
          <FormControl className={classes.formControl}>
            <Select
              value={textAttrs[name].text.fontSize}
              onChange={this.handleSelectChange(name)}
              autoWidth
              input={
                <BootstrapInput
                  name={`font-size-name-${name}`}
                  id={`font-size-select-${name}`}
                />
              }
            >
              {[...Array(15).keys()].map(
                x =>
                  x !== 0 && (
                    <MenuItem value={x * 5} key={x}>
                      {x * 5}
                    </MenuItem>
                  ),
              )}
            </Select>
          </FormControl>
        </form>
        <ColorPicker name={name} />
      </div>
    );
  }
}

MyTextModifier.propTypes = {
  classes: PropTypes.object,
  textAttrs: PropTypes.object.isRequired,
  loadTextAttrs: PropTypes.func,
  name: PropTypes.string,
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
  withConnect,
  withTheme(),
  withStyles(styles),
)(MyTextModifier);
