/**
 *
 * LocaleToggle
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

// import Select from './Select';
import Select from '@material-ui/core/Select';
import { FormControl, OutlinedInput, InputLabel } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import ToggleOption from '../ToggleOption';

const styles = theme => ({
  root: {
    display: 'flex',
  },
});
function Toggle(props) {
  let content = <option>--</option>;

  // If we have items, render them
  if (props.values) {
    content = props.values.map(value => (
      <ToggleOption key={value} value={value} message={props.messages[value]} />
    ));
  }
  return (
    <FormControl variant="outlined" style={{ minWidth: '120px' }}>
      <InputLabel htmlFor="outlined-language-native-simple">
        {props.placeholderLanguage}
      </InputLabel>
      <Select
        native
        value={props.value}
        onChange={props.onToggle}
        input={
          <OutlinedInput
            name="age"
            id="filled-language-native-simple"
            labelWidth={80}
          />
        }
      >
        {content}
      </Select>
    </FormControl>
  );
}

Toggle.propTypes = {
  onToggle: PropTypes.func,
  values: PropTypes.array,
  value: PropTypes.string,
  messages: PropTypes.object,
  placeholderLanguage: PropTypes.string,
};

export default withStyles(styles, { withTheme: true })(Toggle);
