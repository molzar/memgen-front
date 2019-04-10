import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import sizeMe from 'react-sizeme';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import ReactPaginate from 'react-paginate';

import { withStyles } from '@material-ui/core/styles';
import {
  List,
  CellMeasurer,
  CellMeasurerCache,
  WindowScroller,
} from 'react-virtualized';
import { loadMemes } from './actions';
import { findPages } from '../App/actions';
import { makeSelectMemes } from './selectors';
import { makeSelecGridProps } from '../App/selectors';
import ListItemsRowRenderer from './ListItemsRowRenderer';

const styles = () => ({
  list: {
    height: '100vh',
    margin: 'auto',
    maxWidth: '640px',
    paddingTop: '85px',
  },
  paddingTop85: {
    paddingTop: '85px !important',
    flex: '1 0 auto',
    display: 'flex',
    flexDirection: 'column',
    padding: '0 1rem 1rem 1rem',
    overflow: 'auto',
    margin: 'auto',
    backgroundColor: '#0c1024',
    alignItems: 'center',
  },
  WindowScrollerWrapper: {
    flex: '1 1 auto',
  },
  listVirtualized: {
    maxWidth: '640px',
  },
  parentContainer: {
    height: '100%',
    width: '100%',
    overflow: 'hidden',
  },
  centerDiv: {
    textAlign: 'center',
  },
  paginate: {
    padding: 0,
    margin: 0,
  },
  bottomHandler: {
    textAlign: 'center',
  },
  paginateli: {
    display: 'inline',
  },
  paginateliaNext: {
    color: '#fff',
    padding: '8px 16px',
    float: 'right',
    textDecoration: 'none',
    transition: 'background-color 0.3s',
    backgroundColor: '#3f51b5',
    marginTop: '30px',
  },
  paginateliaPrevious: {
    color: '#fff',
    padding: '8px 16px',
    float: 'left',
    textDecoration: 'none',
    transition: 'background-color 0.3s',
    backgroundColor: '#3f51b5',
    marginTop: '30px',
  },
  paginateActive: {
    backgroundColor: '#3f51b5',
    color: 'white',
    border: '1px solid #3f51b5',
  },
  hideMe: {
    display: 'none !important',
  },
});

class ListItemsPageVirtualized extends Component {
  constructor(props) {
    super(props);
    this.cellMeasurerCache = new CellMeasurerCache({
      fixedWidth: true,
      minHeight: 150,
    });

    this.scrollRef = React.createRef();
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
  }

  resetScrollPosition = () => {
    window.scrollTo(0, 0);
    this.scrollRef.current.state.scrollTop = 0;
  };

  handlePageClick = data => {
    this.resetScrollPosition();
    const { gridProps } = this.props;
    const limitOffset = Math.ceil(
      data.selected *
        (gridProps.offset === 0 ? gridProps.limit : gridProps.offset),
    );
    this.props.loadMemes(
      gridProps.limit,
      data.selected === 0 ? 0 : limitOffset,
      this.props.match.url === '/myMemes' ? this.props.userID : '',
    );
  };

  renderRow = (memes, dbUser) => ({
    index,
    isScrolling,
    isVisible,
    key,
    style,
    parent,
  }) => (
    <CellMeasurer
      key={key}
      cache={this.cellMeasurerCache}
      parent={parent}
      columnIndex={0}
      rowIndex={index}
    >
      {({ measure }) => (
        <ListItemsRowRenderer
          measure={measure}
          key={index}
          index={index}
          meme={memes[index]}
          // dbUser={dbUser}
          idUserPage={
            this.props.match.url === '/myMemes' ? this.props.userID : ''
          }
          style={style}
          memes={memes}
        />
      )}
    </CellMeasurer>
  );

  render() {
    const { memes, classes, gridProps, dbUser, size } = this.props;
    return (
      <div className={classes.paddingTop85}>
        <WindowScroller
          scrollElement={window}
          style={{ width: size.width > 768 ? size.width : 580 }}
          ref={this.scrollRef}
        >
          {({
            height,
            isScrolling,
            registerChild,
            onChildScroll,
            scrollTop,
          }) => (
            <div className={styles.WindowScrollerWrapper}>
              <div ref={registerChild}>
                <List
                  ref={el => {
                    window.listEl = el;
                  }}
                  autoHeight
                  className={styles.List}
                  height={height}
                  isScrolling={isScrolling}
                  onScroll={onChildScroll}
                  overscanRowCount={5}
                  rowCount={memes.length}
                  rowHeight={this.cellMeasurerCache.rowHeight}
                  deferredMeasurementCache={this.cellMeasurerCache}
                  rowRenderer={this.renderRow(memes, dbUser)}
                  scrollTop={scrollTop}
                  width={size.width > 768 ? 590 : size.width}
                />
              </div>
              <div className={classes.bottomHandler}>
                <ReactPaginate
                  pageCount={gridProps.pages || 1}
                  marginPagesDisplayed={0}
                  pageRangeDisplayed={0}
                  onPageChange={this.handlePageClick}
                  containerClassName={classes.paginate}
                  activeClassName={classes.paginateActive}
                  pageClassName={classes.hideMe}
                  breakClassName={classes.hideMe}
                  previousClassName={classes.paginateli}
                  nextClassName={classes.paginateli}
                  previousLinkClassName={classes.paginateliaPrevious}
                  nextLinkClassName={classes.paginateliaNext}
                />
              </div>
            </div>
          )}
        </WindowScroller>
      </div>
    );
  }
}

ListItemsPageVirtualized.propTypes = {
  memes: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  loadMemes: PropTypes.func,
  gridProps: PropTypes.object,
  userID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  match: PropTypes.object,
  classes: PropTypes.object.isRequired,
  findPages: PropTypes.func,
  dbUser: PropTypes.object,
  size: PropTypes.object,
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
)(ListItemsPageVirtualized);
