import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import sizeMe from 'react-sizeme';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import ReactPaginate from 'react-paginate';
import { withStyles, withTheme } from '@material-ui/core/styles';
import {
  List,
  CellMeasurer,
  CellMeasurerCache,
  WindowScroller,
} from 'react-virtualized';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { loadMemes } from './actions';
import { findPages } from '../App/actions';
import { makeSelectMemes } from './selectors';
import { makeSelecGridProps } from '../App/selectors';
import ListItemsRowRenderer from './ListItemsRowRenderer';

const styles = theme => ({
  list: {
    height: '100vh',
    margin: 'auto',
    maxWidth: '640px',
    paddingTop: '60px',
  },
  paddingTop85: {
    paddingTop: '60px !important',
    flex: '1 0 auto',
    display: 'flex',
    flexDirection: 'column',
    padding: '0 1rem 1rem 1rem',
    overflow: 'auto',
    margin: 'auto',
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
    padding: '8px 16px',
    float: 'right',
    textDecoration: 'none',
    transition: theme.transitions.easing.sharp,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    marginTop: '30px',
    ':hover': {
      color: theme.palette.action.hover,
    },
    boxShadow: theme.shadows[3],
  },
  paginateliaPrevious: {
    padding: '8px 16px',
    float: 'left',
    textDecoration: 'none',
    transition: theme.transitions.easing.sharp,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    marginTop: '30px',
    boxShadow: theme.shadows[3],
  },
  paginateActive: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
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
      minHeight: 500,
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

  renderRow = memes => ({
    index,
    // isScrolling,
    // isVisible,
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
    const { memes, classes, gridProps, size } = this.props;
    return (
      <div className={classes.paddingTop85}>
        {memes.length > 0 && (
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
                    overscanRowCount={3}
                    rowCount={memes.length}
                    rowHeight={this.cellMeasurerCache.rowHeight}
                    deferredMeasurementCache={this.cellMeasurerCache}
                    rowRenderer={this.renderRow(memes)}
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
                    previousLabel={<FormattedMessage {...messages.previous} />}
                    nextLabel={<FormattedMessage {...messages.next} />}
                  />
                </div>
              </div>
            )}
          </WindowScroller>
        )}
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
  withTheme(),
  withStyles(styles),
)(ListItemsPageVirtualized);
