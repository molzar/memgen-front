import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import sizeMe from 'react-sizeme';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import ReactPaginate from 'react-paginate';
import List from 'react-virtualized-listview';
import { withStyles } from '@material-ui/core/styles';
import { loadMemes } from './actions';
import { findPages } from '../App/actions';
import { makeSelectMemes } from './selectors';
import { makeSelecGridProps } from '../App/selectors';
import ListItem from './ListItem';
import './style.css';

const styles = () => ({
  list: {
    height: '90vh',
    overflow: 'auto',
    // paddingRight: '20px',
  },
  parentContainer: {
    height: '100%',
    width: '100%',
    overflow: 'hidden',
  },
  centerDiv: {
    textAlign: 'center',
  },
});

class ListItemsPage extends Component {
  constructor(props) {
    super();
    this.listRef = React.createRef();
    this.divContainerRef = React.createRef();
    props.findPages(props.gridProps);
    props.loadMemes(
      props.gridProps.limit,
      props.gridProps.offset,
      props.match.url === '/myMemes' ? props.userID : '',
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

    this.resetScrollPosition();
  }

  resetScrollPosition = () => {
    this.listRef.current.container.children[0].children[0].scrollTop = 0;
    this.listRef.current.container.children[0].scrollTop = 0;
    this.listRef.current.container.scrollTop = 0;
    this.divContainerRef.current.scrollTop = 0;
  };

  handlePageClick = data => {
    this.resetScrollPosition();
    const { gridProps } = this.props;
    const limitLocal = Math.ceil(
      data.selected *
        (gridProps.limit === 0 ? gridProps.offset : gridProps.limit),
    );
    this.props.loadMemes(
      data.selected === 0 ? 0 : limitLocal,
      gridProps.offset,
      this.props.match.url === '/myMemes' ? this.props.userID : '',
    );
  };

  render() {
    const { memes, classes, gridProps } = this.props;
    return (
      <div
        id="list"
        className="list disable-scrollbars"
        ref={this.divContainerRef}
      >
        <List
          source={memes}
          overScanCount={4}
          ref={this.listRef}
          rowHeight={460}
          renderItem={({ index, style }) => (
            <ListItem
              key={index}
              index={index}
              meme={memes[index]}
              style={style}
            />
          )}
        />
        <div className={classes.centerDiv}>
          <ReactPaginate
            className="pagination"
            pageCount={gridProps.pages || 1}
            marginPagesDisplayed={0}
            pageRangeDisplayed={0}
            onPageChange={this.handlePageClick}
            containerClassName="pagination"
            subContainerClassName="pages pagination"
            activeClassName="active"
            pageClassName="hideMe"
            breakClassName="hideMe"
          />
        </div>
      </div>
    );
  }
}

ListItemsPage.propTypes = {
  memes: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  loadMemes: PropTypes.func,
  gridProps: PropTypes.object,
  userID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  match: PropTypes.object,
  classes: PropTypes.object.isRequired,
  findPages: PropTypes.func,
};

const mapDispatchToProps = dispatch => ({
  loadMemes: (limit, offset, userID) =>
    dispatch(loadMemes(limit, offset, userID)),
  findPages: gridProps => dispatch(findPages(gridProps)),
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
)(ListItemsPage);
