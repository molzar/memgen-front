import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import sizeMe from 'react-sizeme';
import StackGrid from 'react-stack-grid';
import Image from 'material-ui-image';
// import CssBaseline from '@material-ui/core/CssBaseline';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { loadMemes } from './actions';
import { makeSelectMemes } from './selectors';
import { makeSelecGridProps } from '../App/selectors';
const styles = theme => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 10,
    marginRight: theme.spacing.unit * 10,
    [theme.breakpoints.up((768 + theme.spacing.unit) * 3 * 2)]: {
      width: 768,
      marginLeft: theme.spacing.unit * 1,
      marginRight: theme.spacing.unit * 1,
    },
  },
});

export class HomePageImgList extends React.Component {
  constructor(props) {
    super(props);
    props.loadMemes(
      props.gridProps.limit,
      props.gridProps.offset,
      this.props.match.url === '/myMemes' ? props.userID : '',
    );
  }

  componentDidUpdate(oldProps) {
    if (
      oldProps.userID !== this.props.userID ||
      oldProps.match.url !== this.props.match.url
    ) {
      this.props.loadMemes(
        this.props.gridProps.limit,
        this.props.gridProps.offset,
        this.props.match.url === '/myMemes' ? this.props.userID : '',
      );
    }
  }

  render() {
    const {
      classes,
      memes,
      size: { width },
    } = this.props;
    let dinamicWidth = '100%';
    switch (true) {
      case width <= 640:
        dinamicWidth = '100%';
        break;
      case width > 640 && width <= 768:
        dinamicWidth = '50%';
        break;
      case width > 768 && width <= 1024:
        dinamicWidth = '33.33%';
        break;
      default:
        dinamicWidth = '25%';
    }
    return (
      <main className={classes.layout}>
        <StackGrid columnWidth={dinamicWidth}>
          {memes.map(meme => (
            <Image
              src={`/api/proxy/${encodeURIComponent(meme.url)}`}
              key={meme.id}
            />
          ))}
        </StackGrid>
      </main>
    );
  }
}

HomePageImgList.propTypes = {
  classes: PropTypes.object.isRequired,
  memes: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  loadMemes: PropTypes.func,
  gridProps: PropTypes.object,
  userID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  match: PropTypes.object,
  size: PropTypes.object,
};

const mapDispatchToProps = dispatch => ({
  loadMemes: (limit, offset, userID) =>
    dispatch(loadMemes(limit, offset, userID)),
});

const mapStateToProps = createStructuredSelector({
  memes: makeSelectMemes(),
  gridProps: makeSelecGridProps(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withRouter,
  withConnect,
  sizeMe(),
  withStyles(styles),
)(HomePageImgList);
