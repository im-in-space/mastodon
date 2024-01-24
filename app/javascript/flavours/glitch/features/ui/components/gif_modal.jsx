import PropTypes from 'prop-types';

import { defineMessages, injectIntl } from 'react-intl';

import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect } from 'react-redux';

import Tenor from 'react-tenor';

import CloseIcon from '@/material-icons/400-24px/close.svg?react';
import { tenorSet, uploadCompose } from 'flavours/glitch/actions/compose';
import { IconButton } from 'flavours/glitch/components/icon_button';

const messages = defineMessages({
  search:    { id: 'tenor.search', defaultMessage: 'Search for GIFs' },
  error:     { id: 'tenor.error', defaultMessage: 'Oops! Something went wrong. Please, try again.' },
  loading:   { id: 'tenor.loading', defaultMessage: 'Loading...' },
  nomatches: { id: 'tenor.nomatches', defaultMessage: 'No matches found.' },
  close:     { id: 'settings.close', defaultMessage: 'Close' },
});

// Utility for converting base64 image to binary for upload
// https://stackoverflow.com/questions/35940290/how-to-convert-base64-string-to-javascript-file-object-like-as-from-file-input-f
function dataURLtoFile(dataurl, filename) {
  let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

const mapStateToProps = state => ({
  options: state.getIn(['compose', 'tenor']),
});

const mapDispatchToProps = dispatch => ({
  setOpt: (opts) => dispatch(tenorSet(opts)),
  submit: (file, alt) => dispatch(uploadCompose([file], alt)),
});

class GIFModal extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    options: ImmutablePropTypes.map,
    onClose: PropTypes.func.isRequired,
    setOpt: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
  };

  handleSelect = result => {
    const url = result.media[0].mp4.url;
    const alt = result.content_description;
    var modal = this;
    fetch(url).then(res => res.blob()).then(blob => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function() {
        var dataUrl = reader.result;
        const file = dataURLtoFile(dataUrl, 'tenor.mp4');
        modal.props.submit(file, alt);
        modal.props.onClose(); // close dialog
      };
    }).catch(err => {
      console.error(err);
    });
  };

  render () {
    const { intl } = this.props;

    return (
      <div className='modal-root__modal tenor-modal'>
        <div className='tenor-modal__container'>
          <IconButton title={intl.formatMessage(messages.close)} icon='times' iconComponent={CloseIcon} onClick={this.props.onClose} style={{ float: 'right' }} />
          <Tenor
            token='FJBKNQSVF2DD'
            onSelect={this.handleSelect}
            autoFocus='true'
            searchPlaceholder={intl.formatMessage(messages.search)}
            messageError={intl.formatMessage(messages.error)}
            messageLoading={intl.formatMessage(messages.loading)}
            messageNoMatches={intl.formatMessage(messages.nomatches)}
            contentFilter='off'
          />
          <br /><img src='/tenor.svg' alt='Tenor logo' />
        </div>
      </div>
    );
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(GIFModal));
