import React from 'react';
import { fromJS } from 'immutable';
import PropTypes from 'prop-types';
import Input from '@material-ui/core/Input';
import { withStyles } from '@material-ui/core/styles';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import CardActions from '@material-ui/core/CardActions';
import red from '@material-ui/core/colors/red';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { loadTextAttrs } from './actions';
import { makeSelectTextAttrs } from './selectors';
import ColorPicker from './ColorPicker';

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
      <CardActions>
        <Input
          className={classes.cardInput}
          type="text"
          value={textAttrs[name].text.text}
          onChange={this.handleTextChange(name)}
        />
        <form className={classes.container} noValidate autoComplete="off">
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel
              ref={ref => {
                this.InputLabelRef = ref;
              }}
              htmlFor={`font-size-${name}`}
            >
              Size
            </InputLabel>
            <Select
              value={textAttrs[name].text.fontSize}
              onChange={this.handleSelectChange(name)}
              autoWidth
              input={
                <OutlinedInput
                  labelWidth={30}
                  name="age"
                  id={`font-size-${name}`}
                />
              }
            >
              {[...Array(99).keys()].map(x => (
                <MenuItem value={x} key={x}>
                  {x}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </form>
        <ColorPicker name={name} />
      </CardActions>
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
  withStyles(styles),
)(MyTextModifier);
