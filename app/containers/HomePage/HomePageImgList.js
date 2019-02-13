import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { loadMemes } from './actions';
import { makeSelectMemes } from './selectors';

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
    backgroundSize: 'auto',
  },
  cardContent: {
    flexGrow: 1,
  },
});

// const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export class HomePageImgList extends React.Component {
  constructor(props) {
    super(props);
    props.loadMemes();
  }

  render() {
    const { classes, memes } = this.props;
    return (
      <React.Fragment>
        <CssBaseline />
        <main>
          <div className={classNames(classes.layout, classes.cardGrid)}>
            {/* End hero unit */}
            <Grid container spacing={8}>
              {memes.map(meme => (
                <Grid item key={meme.id} sm={6} md={4} lg={3}>
                  <Card className={classes.card}>
                    <CardMedia
                      className={classes.cardMedia}
                      image={meme.url}
                      title="Image title"
                    />

                    <CardActions>
                      <Button size="small" color="primary">
                        View
                      </Button>
                      <Button size="small" color="primary">
                        Edit
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
        </main>
      </React.Fragment>
    );
  }
}

HomePageImgList.propTypes = {
  classes: PropTypes.object.isRequired,
  memes: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  loadMemes: PropTypes.func,
};

const mapDispatchToProps = dispatch => ({
  loadMemes: () => dispatch(loadMemes(0, 10)),
});

const mapStateToProps = createStructuredSelector({
  memes: makeSelectMemes(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  withStyles(styles),
)(HomePageImgList);
