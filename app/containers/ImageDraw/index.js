import React from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import Input from '@material-ui/core/Input';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import FileCopySharp from '@material-ui/icons/FileCopySharp';
import injectSaga from 'utils/injectSaga';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import red from '@material-ui/core/colors/red';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import SaveIcon from '@material-ui/icons/Save';
import ReplayIcon from '@material-ui/icons/Replay';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import { Stage, Layer } from 'react-konva';
import {
  FacebookShareButton,
  FacebookIcon,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  RedditIcon,
  RedditShareButton,
  FacebookShareCount,
  RedditShareCount,
} from 'react-share';
import saga from './saga';
import reducer, {
  image as initialImage,
  textAttrs as initialTextAttrs,
} from './reducer';
import {
  loadImage,
  setBase64Meme,
  loadTextAttrs,
  setUploadInput,
  loadImageSuccess,
  resetState,
  uploadImage,
  insertPostDBSucces,
} from './actions';
import {
  makeSelectBase64Meme,
  makeSelectTextAttrs,
  makeSelectImage,
  makeSelectLoadedImage,
  makeSelectUploadInput,
  makeSelectLatestUpload,
} from './selectors';
import { makeSelecDBUser } from '../App/selectors';
import MyTextModifier from './MyTextModifier';
import URLImage from './URLImage';
import MyText from './MyText';

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
    fontSize: 28,
  },
  cardInput: {
    width: '100%',
  },
  card: {
    textAlign: 'center',
    margin: 'auto',
    paddingBottom: '10px',
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
  content: {
    flexGrow: 1,
    position: 'relative',
    width: '100%',
    height: '100%',
    paddingTop: '90px',
    padding: theme.spacing.unit * 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 90,
    height: 35,
  },
  containerGrid: {
    justify: 'center',
    alignItems: 'center',
    alignContents: 'center',
    direction: 'column',
  },
  root: {
    flexGrow: 1,
    alignSelf: 'center',
  },
  imageUrlToCopy: {
    marginTop: '0px',
    marginBottom: '0px',
    backgroundColor: 'white',
  },
  saveRow: {
    display: 'flex',
    flexDirection: 'row',
    padding: '0px',
  },
  saveRowElement: {
    margin: 'auto',
  },
  modifierRow: {
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: '10px',
    paddingRight: '10px',
  },
  somePadding: {
    margin: '5px',
    boxShadow: '0.1px 0.1px 0.1px 2px rgba(255, 255, 255, .2)',
  },
  shareParentDiv: {
    display: 'inline-flex',
    alignItems: 'center',
    margin: 'auto',
    color: 'white',
  },
});

class ImageDraw extends React.Component {
  constructor(props) {
    super(props);
    this.stage = React.createRef();
    this.layer = React.createRef();
  }

  componentDidMount() {
    if (this.layer && this.layer.current) this.layer.current.batchDraw();
  }

  componentDidUpdate() {
    if (this.layer && this.layer.current) this.layer.current.batchDraw();
  }

  handleExportClick = () => {
    const localBase64 = this.stage.current.toDataURL({
      mimeType: 'image/png',
      // width: this.stage.attrs.Width,
      // height: this.stage.attrs.Height,
      quality: 1,
      pixelRadio: 2,
    });

    if (localBase64) {
      this.props.setBase64Img(localBase64);
      this.props.uploadImage(localBase64, this.props.dbUser);
    }
  };

  handleLoadImageClick = () => {
    const { image, uploadInput } = this.props;
    image.src = `/api/proxy/${encodeURIComponent(uploadInput.value)}`;
    this.props.loadImageSuccess(fromJS(image));
  };

  handleUploadInputChange = e => {
    const uploadInput = { ...this.props.uploadInput };
    uploadInput.value = e.target.value;
    this.props.setUploadInput(fromJS(uploadInput));
  };

  handleReset = () => {
    this.props.resetState();
    this.props.loadImage(fromJS(initialImage));
    this.props.loadTextAttrs(fromJS(initialTextAttrs));
    this.props.insertPostDBSucces(fromJS({}));
  };

  handleCopyToClipboard = () => {
    document.querySelector('#latestUpload').select();
    document.execCommand('copy');
  };

  render() {
    const {
      classes,
      base64Meme,
      loadedImage,
      uploadInput,
      latestUpload,
    } = this.props;

    return (
      <div className={classes.content}>
        <Card className={classes.card} style={{ width: loadedImage.width }}>
          <CardHeader title="Make your own MeMe" />
          {base64Meme && base64Meme !== '' ? (
            <a href={base64Meme} download>
              <img src={base64Meme} alt="img" />
            </a>
          ) : (
            <div
              id="WorkingCanvas"
              width={loadedImage.width}
              height={loadedImage.height}
            >
              <Stage
                width={loadedImage.width}
                height={loadedImage.height}
                ref={this.stage}
              >
                <Layer ref={this.layer}>
                  <URLImage />
                  <MyText name="txt1" />
                  <MyText name="txt2" />
                </Layer>
              </Stage>
            </div>
          )}
          {!base64Meme && base64Meme === '' ? (
            <CardContent className={classes.saveRow}>
              <Typography component="p" className={classes.saveRowElement}>
                Click Save when your done editing.
              </Typography>
              <IconButton
                variant="contained"
                size="small"
                className={classes.saveRowElement}
                onClick={this.handleExportClick}
              >
                <SaveIcon />
              </IconButton>
            </CardContent>
          ) : (
            <CardContent>
              <Typography component="p">
                Click the picture to download it.
              </Typography>
              <div>
                <Typography component="p">
                  Click Replay icon to start from scratch.
                </Typography>
                <IconButton
                  variant="contained"
                  size="small"
                  onClick={this.handleReset}
                >
                  <ReplayIcon />
                </IconButton>
              </div>
            </CardContent>
          )}
          {!base64Meme && base64Meme === '' ? (
            <MyTextModifier name="txt1" />
          ) : (
            ''
          )}
          {!base64Meme && base64Meme === '' ? (
            <MyTextModifier name="txt2" />
          ) : (
            ''
          )}
          {!base64Meme && base64Meme === '' ? (
            <div className={classes.modifierRow}>
              <Input
                className={classes.cardInput}
                type="text"
                value={uploadInput.value}
                onChange={this.handleUploadInputChange}
                placeholder={uploadInput.placeholder}
              />
              <IconButton
                className={classes.iconAvg}
                variant="contained"
                color="default"
                size="small"
                onClick={this.handleLoadImageClick}
              >
                <CloudUploadIcon className={classes.iconAvg} />
              </IconButton>
            </div>
          ) : (
            ''
          )}
          {base64Meme && (
            <CardActions className={classes.actions}>
              <div className={classes.shareParentDiv}>
                <RedditShareButton
                  className={classes.somePadding}
                  url={latestUpload.url}
                >
                  <RedditIcon size={28} />
                </RedditShareButton>
                <RedditShareCount url={latestUpload.url}>
                  {count => (count === 0 ? '' : count)}
                </RedditShareCount>
                <FacebookShareButton
                  className={classes.somePadding}
                  url={latestUpload.url}
                >
                  <FacebookIcon size={28} />
                </FacebookShareButton>

                <FacebookShareCount url={latestUpload.url}>
                  {count => (count === 0 ? '' : count)}
                </FacebookShareCount>
                <TwitterShareButton
                  className={classes.somePadding}
                  url={latestUpload.url}
                >
                  <TwitterIcon size={28} />
                </TwitterShareButton>

                <TelegramShareButton
                  className={classes.somePadding}
                  url={latestUpload.url}
                >
                  <TelegramIcon size={28} />
                </TelegramShareButton>
              </div>

              <TextField
                id="latestUpload"
                label="Image URL"
                value={latestUpload.url}
                className={classes.imageUrlToCopy}
                margin="normal"
                autoFocus
                InputProps={{
                  readOnly: true,
                  className: classes.imageUrlToCopy,
                }}
                variant="filled"
              />
              <IconButton
                variant="contained"
                color="default"
                size="small"
                onClick={this.handleCopyToClipboard}
              >
                <FileCopySharp />
              </IconButton>
            </CardActions>
          )}
        </Card>
      </div>
    );
  }
}

ImageDraw.propTypes = {
  image: PropTypes.object,
  loadedImage: PropTypes.object,
  base64Meme: PropTypes.string,
  classes: PropTypes.object,
  uploadInput: PropTypes.object,
  dbUser: PropTypes.object,
  latestUpload: PropTypes.object,
  loadImage: PropTypes.func,
  loadImageSuccess: PropTypes.func,
  setBase64Img: PropTypes.func,
  setUploadInput: PropTypes.func,
  resetState: PropTypes.func,
  loadTextAttrs: PropTypes.func,
  uploadImage: PropTypes.func,
  insertPostDBSucces: PropTypes.func,
};

const mapDispatchToProps = dispatch => ({
  loadImage: image => dispatch(loadImage(image)),
  loadImageSuccess: image => dispatch(loadImageSuccess(image)),
  setUploadInput: uploadInput => dispatch(setUploadInput(uploadInput)),
  setBase64Img: base64Meme => dispatch(setBase64Meme(base64Meme)),
  loadTextAttrs: textAttrs => dispatch(loadTextAttrs(textAttrs)),
  insertPostDBSucces: textAttrs => dispatch(insertPostDBSucces(textAttrs)),
  resetState: () => dispatch(resetState()),
  uploadImage: (base64Meme, dbUser) =>
    dispatch(uploadImage(base64Meme, dbUser)),
});

const mapStateToProps = createStructuredSelector({
  textAttrs: makeSelectTextAttrs(),
  uploadInput: makeSelectUploadInput(),
  base64Meme: makeSelectBase64Meme(),
  image: makeSelectImage(),
  loadedImage: makeSelectLoadedImage(),
  dbUser: makeSelecDBUser(),
  latestUpload: makeSelectLatestUpload(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'imageDraw', reducer });
const withSaga = injectSaga({ key: 'imageDraw', saga });

export default compose(
  withReducer,
  withConnect,
  withSaga,
  withStyles(styles),
)(ImageDraw);
