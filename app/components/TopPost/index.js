import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Report from '@material-ui/icons/Report';
import { Typography } from '@material-ui/core';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import messages from './messages';

function TopPost(props) {
  const stringToColor = stringC => {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < stringC.length; i += 1) {
      hash = stringC.charCodeAt(i) + ((hash << 5) - hash);
    }

    let colour = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      colour += `00${value.toString(16)}`.substr(-2);
    }
    /* eslint-enable no-bitwise */

    return colour;
  };
  const reportedColor =
    props.meme.reported && props.meme.reported > 0 ? '#ff0c3e' : '#00a9ff';
  return (
    <div
      style={{
        marginLeft: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto',
        color: '#263238',
        display: 'flex',
        flexDirection: 'row',
        paddingRight: '10px',
        backgroundColor: props.backgroundColor,
      }}
    >
      <IconButton
        key={`report-key-${props.meme.id}`}
        aria-label="Like"
        onClick={() => props.reportMemesSlide(props.meme.id)}
      >
        <Report
          style={{
            color: reportedColor,
            marginRight: 'auto',
            marginTop: 'auto',
            marginBottom: 'auto',
            width: 30,
            height: 30,
            margin: '2px',
          }}
        />
      </IconButton>

      <Typography
        style={{
          color: '#263238',
          marginLeft: 'auto',
          marginTop: 'auto',
          marginBottom: 'auto',
        }}
      >
        <FormattedMessage {...messages.createdBy} />
      </Typography>
      <IconButton color="inherit">
        {props.meme.avatarurl ? (
          <Avatar
            alt={props.meme.username}
            src={`/api/proxy/${encodeURIComponent(
              props.meme.avatarurl,
            )}?width=40`}
            style={{
              width: 30,
              height: 30,
              margin: '2px',
              color: '#fff',
            }}
          />
        ) : (
          <Avatar
            style={{
              color: '#fff',
              width: 30,
              height: 30,
              margin: '2px',
              backgroundColor: stringToColor(props.meme.username),
            }}
          >
            {props.meme.username.charAt(0).toUpperCase()}
          </Avatar>
        )}
      </IconButton>
      <Typography
        style={{
          color: '#263238',
          marginTop: 'auto',
          marginBottom: 'auto',
        }}
      >
        <FormattedRelative value={props.meme.created_at} />
      </Typography>
    </div>
  );
}

TopPost.propTypes = {
  meme: PropTypes.object,
  backgroundColor: PropTypes.string,
  reportMemesSlide: PropTypes.func,
};

export default TopPost;
