import React from 'react';
import PropTypes from 'prop-types';
import Image from 'material-ui-image';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

class ListItem extends React.PureComponent {
  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { meme, style } = this.props;
    return (
      <div
        id="list-item"
        className="list-item disable-scrollbars"
        style={style}
      >
        <div
          id={meme.id}
          role="button"
          tabIndex="0"
          className="list-body disable-scrollbars"
          onClick={this.handleClickOpen}
          onKeyPress={() => {}}
        >
          <img
            className="list-image disable-scrollbars"
            src={`/api/proxy/${encodeURIComponent(meme.url)}`}
            alt={`/api/proxy/${encodeURIComponent(meme.url)}`}
            key={meme.id}
          />
        </div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          scroll="paper"
          aria-labelledby="scroll-dialog-title"
          fullWidth
        >
          <DialogContent>
            <DialogContentText>
              <Image
                src={`/api/proxy/${encodeURIComponent(meme.url)}`}
                alt={`/api/proxy/${encodeURIComponent(meme.url)}`}
                key={meme.id}
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Back
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

ListItem.propTypes = {
  meme: PropTypes.object,
  style: PropTypes.object,
};

export default ListItem;
