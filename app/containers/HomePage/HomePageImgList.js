import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
// import CssBaseline from '@material-ui/core/CssBaseline';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { loadMemes } from './actions';
import { makeSelectMemes } from './selectors';
import { makeSelecGridProps } from '../App/selectors';
const styles = theme => ({
  icon: {
    marginRight: theme.spacing.unit * 2,
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up((768 + theme.spacing.unit) * 3 * 2)]: {
      width: 768,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  cardGrid: {
    padding: `${theme.spacing.unit * 8}px 0`,
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '90%', // 16:9
    // backgroundSize: 'auto',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
  },
  cardContent: {
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
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
    const { classes, memes } = this.props;
    return (
      <main className={classes.content}>
        <div className={classNames(classes.layout, classes.cardGrid)}>
          <Grid container spacing={8}>
            {memes.map(meme => (
              <Grid item key={meme.id} sm={12} md={4} lg={2}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image={meme.url}
                    title="Image title"
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
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
  withStyles(styles),
)(HomePageImgList);
