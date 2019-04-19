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
import SaveIcon from '@material-ui/icons/Save';
import ReplayIcon from '@material-ui/icons/Replay';
import { compose } from 'redux';
import ImageUploader from 'react-images-upload';
import { connect } from 'react-redux';
// import SwipeableViews from 'react-swipeable-views';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import { Stage, Layer } from 'react-konva';
import { FormattedMessage } from 'react-intl';
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
// import { virtualize } from 'react-swipeable-views-utils';
import messages from './messages';
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

// const VirtualizeSwipeableViews = virtualize(SwipeableViews);

const styles = theme => ({
  iconAvg: {
    fontSize: 36,
    padding: '5px',
  },
  cardInput: {
    width: '100%',
  },
  card: {
    textAlign: 'center',
    margin: 'auto',
    paddingBottom: '10px',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderRadious: '0px !important',
    boxShadow: theme.shadows[3],
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
  imageUrlToCopy: {
    marginTop: '0px',
    marginBottom: '0px',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  saveRow: {
    display: 'flex',
    flexDirection: 'row',
    padding: '0px',
  },
  saveRowElement: {
    margin: 'auto',
    padding: '5px',
  },
  saveIconElement: {
    margin: 'auto',
    fontSize: 36,
    padding: '5px',
  },
  modifierRow: {
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: '10px',
    paddingRight: '10px',
  },
  shadowIcons: {
    margin: '5px',
    boxShadow: theme.shadows[3],
  },
  shareParentDiv: {
    display: 'inline-flex',
    alignItems: 'center',
    margin: 'auto',
    color: theme.palette.primary.main,
    // color: 'white',
  },
  iconColor: {
    color: theme.palette.primary2.main,
    fontSize: 36,
  },
  rootUploadFile: {
    backgroundColor: theme.palette.primary.main,
    maxWidth: '30%',
  },
  buttonLoadFIle: {
    backgroundColor: theme.palette.primary2.main,
    color: theme.palette.primary2.contrastText,
    borderRadious: '0px',
  },
});

class ImageDraw extends React.Component {
  constructor(props) {
    super(props);
    this.stage = React.createRef();
    this.layer = React.createRef();
    // this.state = { pictures: [] };
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
    image.src = uploadInput.value;
    this.props.loadImageSuccess(fromJS(image));
  };

  handleUploadInputChange = e => {
    const uploadInput = { ...this.props.uploadInput };
    uploadInput.value = e.target.value;
    this.props.setUploadInput(fromJS(uploadInput));
  };

  handleReset = () => {
    this.props.resetState();
    this.props.loadImageSuccess(fromJS(initialImage));
    this.props.loadTextAttrs(fromJS(initialTextAttrs));
    this.props.insertPostDBSucces(fromJS({}));
  };

  handleCopyToClipboard = () => {
    document.querySelector('#latestUpload').select();
    document.execCommand('copy');
  };

  getBase64 = file => {
    if (file && file.length > 0 && file[file.length - 1]) {
      const reader = new FileReader();
      reader.readAsDataURL(file[file.length - 1]);
      reader.onload = result => {
        this.props.resetState();
        const localimageFromBase64 = {
          src: result.target.result,
          crossOrigin: 'Anonymous',
          width: 236,
          height: 213,
          whereFrom: 'fromFile',
        };

        this.props.loadImageSuccess(fromJS(localimageFromBase64));
      };
      reader.onerror = error => {
        console.log('Error: ', error);
      };
    }
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
          <FormattedMessage {...messages.titleMakeYourOwnMeme}>
            {placeholder => <CardHeader title={placeholder} />}
          </FormattedMessage>
          {base64Meme && base64Meme !== '' ? (
            <a href={base64Meme} download>
              <img src={base64Meme} alt=":)" />
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
                <FormattedMessage {...messages.clickSave} />
              </Typography>
              <IconButton
                variant="contained"
                size="small"
                className={classes.saveIconElement}
                onClick={this.handleExportClick}
              >
                <SaveIcon className={classes.iconColor} />
              </IconButton>
            </CardContent>
          ) : (
            <CardContent>
              <Typography component="p">
                <FormattedMessage {...messages.downloadPictureText} />
              </Typography>
              <div>
                <Typography component="p">
                  <FormattedMessage {...messages.replayText} />
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
              <FormattedMessage {...messages.placeholderUploadImage}>
                {placeholder => (
                  <Input
                    className={classes.cardInput}
                    type="text"
                    value={uploadInput.value}
                    onChange={this.handleUploadInputChange}
                    placeholder={placeholder}
                  />
                )}
              </FormattedMessage>
              <IconButton
                className={classes.iconAvg}
                variant="contained"
                color="default"
                size="small"
                onClick={this.handleLoadImageClick}
              >
                <CloudUploadIcon className={classes.iconColor} />
              </IconButton>
              <Typography
                component="p"
                style={{ margin: 'auto', padding: '10px' }}
              >
                <FormattedMessage {...messages.or} />
              </Typography>
              <FormattedMessage {...messages.placeholderUploadImageLocal}>
                {placeholder => (
                  <ImageUploader
                    buttonText={placeholder}
                    onChange={this.getBase64}
                    imgExtension={['.jpg', '.png', '.jpeg']}
                    maxFileSize={5242880}
                    singleImage
                    className={classes.rootUploadFile}
                    withLabel={false}
                    withIcon={false}
                    fileContainerStyle={{
                      margin: '0px',
                      padding: '0px',
                      backgroundColor: '#fafafa',
                      borderRadious: '0px',
                      boxShadow: 'none',
                    }}
                    buttonClassName={classes.buttonLoadFIle}
                    buttonStyles={{
                      backgroundColor: '#00a9ff',
                      borderRadius: '0px',
                      color: '#263238',
                    }}
                  />
                )}
              </FormattedMessage>
            </div>
          ) : (
            ''
          )}
          {base64Meme &&
            latestUpload.url && (
            <CardActions className={classes.actions}>
              <div className={classes.shareParentDiv}>
                <RedditShareButton
                  className={classes.shadowIcons}
                  url={latestUpload.url}
                >
                  <RedditIcon size={28} />
                </RedditShareButton>
                <RedditShareCount url={latestUpload.url}>
                  {count => (count === 0 ? '' : count)}
                </RedditShareCount>
                <FacebookShareButton
                  className={classes.shadowIcons}
                  url={latestUpload.url}
                >
                  <FacebookIcon size={28} />
                </FacebookShareButton>

                <FacebookShareCount url={latestUpload.url}>
                  {count => (count === 0 ? '' : count)}
                </FacebookShareCount>
                <TwitterShareButton
                  className={classes.shadowIcons}
                  url={latestUpload.url}
                >
                  <TwitterIcon size={28} />
                </TwitterShareButton>

                <TelegramShareButton
                  className={classes.shadowIcons}
                  url={latestUpload.url}
                >
                  <TelegramIcon size={28} />
                </TelegramShareButton>
              </div>
              <FormattedMessage {...messages.labelImageUrl}>
                {placeholder => (
                  <TextField
                    id="latestUpload"
                    label={placeholder}
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
                )}
              </FormattedMessage>
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
          {/* {!base64Meme &&
            base64Meme === '' && (
            <VirtualizeSwipeableViews
              enableMouseEvents
              overscanSlideBefore={1}
              overscanSlideAfter={1}
              onChangeIndex={this.onChangeIndex}
              index={this.state.index}
              slideRenderer={this.slideRenderer}
            />
          )} */}
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
