import PropTypes from 'prop-types';

import { defineMessages, injectIntl } from 'react-intl';

import classNames from 'classnames';
import { withRouter } from 'react-router-dom';

import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';

import { ReactComponent as BookmarkIcon } from '@material-symbols/svg-600/outlined/bookmark-fill.svg';
import { ReactComponent as BookmarkBorderIcon } from '@material-symbols/svg-600/outlined/bookmark.svg';
import { ReactComponent as MoreHorizIcon } from '@material-symbols/svg-600/outlined/more_horiz.svg';
import { ReactComponent as RepeatIcon } from '@material-symbols/svg-600/outlined/repeat.svg';
import { ReactComponent as ReplyIcon } from '@material-symbols/svg-600/outlined/reply.svg';
import { ReactComponent as ReplyAllIcon } from '@material-symbols/svg-600/outlined/reply_all.svg';
import { ReactComponent as StarIcon } from '@material-symbols/svg-600/outlined/star-fill.svg';
import { ReactComponent as StarBorderIcon } from '@material-symbols/svg-600/outlined/star.svg';
import { ReactComponent as VisibilityIcon } from '@material-symbols/svg-600/outlined/visibility.svg';

import { PERMISSION_MANAGE_USERS, PERMISSION_MANAGE_FEDERATION } from 'flavours/glitch/permissions';
import { accountAdminLink, statusAdminLink } from 'flavours/glitch/utils/backend_links';
import { WithRouterPropTypes } from 'flavours/glitch/utils/react_router';
import { ReactComponent as RepeatDisabledIcon } from 'mastodon/../svg-icons/repeat_disabled.svg';
import { ReactComponent as RepeatPrivateIcon } from 'mastodon/../svg-icons/repeat_private.svg';

import DropdownMenuContainer from '../containers/dropdown_menu_container';
import { me } from '../initial_state';

import { IconButton } from './icon_button';
import { RelativeTimestamp } from './relative_timestamp';

const messages = defineMessages({
  delete: { id: 'status.delete', defaultMessage: 'Delete' },
  redraft: { id: 'status.redraft', defaultMessage: 'Delete & re-draft' },
  edit: { id: 'status.edit', defaultMessage: 'Edit' },
  direct: { id: 'status.direct', defaultMessage: 'Privately mention @{name}' },
  mention: { id: 'status.mention', defaultMessage: 'Mention @{name}' },
  mute: { id: 'account.mute', defaultMessage: 'Mute @{name}' },
  block: { id: 'account.block', defaultMessage: 'Block @{name}' },
  reply: { id: 'status.reply', defaultMessage: 'Reply' },
  share: { id: 'status.share', defaultMessage: 'Share' },
  more: { id: 'status.more', defaultMessage: 'More' },
  replyAll: { id: 'status.replyAll', defaultMessage: 'Reply to thread' },
  reblog: { id: 'status.reblog', defaultMessage: 'Boost' },
  reblog_private: { id: 'status.reblog_private', defaultMessage: 'Boost with original visibility' },
  cancel_reblog_private: { id: 'status.cancel_reblog_private', defaultMessage: 'Unboost' },
  cannot_reblog: { id: 'status.cannot_reblog', defaultMessage: 'This post cannot be boosted' },
  favourite: { id: 'status.favourite', defaultMessage: 'Favorite' },
  bookmark: { id: 'status.bookmark', defaultMessage: 'Bookmark' },
  open: { id: 'status.open', defaultMessage: 'Expand this status' },
  report: { id: 'status.report', defaultMessage: 'Report @{name}' },
  muteConversation: { id: 'status.mute_conversation', defaultMessage: 'Mute conversation' },
  unmuteConversation: { id: 'status.unmute_conversation', defaultMessage: 'Unmute conversation' },
  pin: { id: 'status.pin', defaultMessage: 'Pin on profile' },
  unpin: { id: 'status.unpin', defaultMessage: 'Unpin from profile' },
  embed: { id: 'status.embed', defaultMessage: 'Embed' },
  admin_account: { id: 'status.admin_account', defaultMessage: 'Open moderation interface for @{name}' },
  admin_status: { id: 'status.admin_status', defaultMessage: 'Open this post in the moderation interface' },
  admin_domain: { id: 'status.admin_domain', defaultMessage: 'Open moderation interface for {domain}' },
  copy: { id: 'status.copy', defaultMessage: 'Copy link to post' },
  hide: { id: 'status.hide', defaultMessage: 'Hide post' },
  edited: { id: 'status.edited', defaultMessage: 'Edited {date}' },
  translate: { id: 'status.translate', defaultMessage: 'Translate' },
  filter: { id: 'status.filter', defaultMessage: 'Filter this post' },
  openOriginalPage: { id: 'account.open_original_page', defaultMessage: 'Open original page' },
});

class StatusActionBar extends ImmutablePureComponent {

  static contextTypes = {
    identity: PropTypes.object,
  };

  static propTypes = {
    status: ImmutablePropTypes.map.isRequired,
    onReply: PropTypes.func,
    onFavourite: PropTypes.func,
    onReblog: PropTypes.func,
    onDelete: PropTypes.func,
    onDirect: PropTypes.func,
    onMention: PropTypes.func,
    onMute: PropTypes.func,
    onBlock: PropTypes.func,
    onReport: PropTypes.func,
    onEmbed: PropTypes.func,
    onMuteConversation: PropTypes.func,
    onPin: PropTypes.func,
    onBookmark: PropTypes.func,
    onFilter: PropTypes.func,
    onAddFilter: PropTypes.func,
    onInteractionModal: PropTypes.func,
    withDismiss: PropTypes.bool,
    withCounters: PropTypes.bool,
    showReplyCount: PropTypes.bool,
    scrollKey: PropTypes.string,
    intl: PropTypes.object.isRequired,
    ...WithRouterPropTypes,
  };

  // Avoid checking props that are functions (and whose equality will always
  // evaluate to false. See react-immutable-pure-component for usage.
  updateOnProps = [
    'status',
    'showReplyCount',
    'withCounters',
    'withDismiss',
  ];

  handleReplyClick = () => {
    const { signedIn } = this.context.identity;

    if (signedIn) {
      this.props.onReply(this.props.status, this.props.history);
    } else {
      this.props.onInteractionModal('reply', this.props.status);
    }
  };

  handleShareClick = () => {
    navigator.share({
      url: this.props.status.get('url'),
    });
  };

  handleFavouriteClick = (e) => {
    const { signedIn } = this.context.identity;

    if (signedIn) {
      this.props.onFavourite(this.props.status, e);
    } else {
      this.props.onInteractionModal('favourite', this.props.status);
    }
  };

  handleReblogClick = e => {
    const { signedIn } = this.context.identity;

    if (signedIn) {
      this.props.onReblog(this.props.status, e);
    } else {
      this.props.onInteractionModal('reblog', this.props.status);
    }
  };

  handleBookmarkClick = (e) => {
    this.props.onBookmark(this.props.status, e);
  };

  handleDeleteClick = () => {
    this.props.onDelete(this.props.status, this.props.history);
  };

  handleRedraftClick = () => {
    this.props.onDelete(this.props.status, this.props.history, true);
  };

  handleEditClick = () => {
    this.props.onEdit(this.props.status, this.props.history);
  };

  handlePinClick = () => {
    this.props.onPin(this.props.status);
  };

  handleMentionClick = () => {
    this.props.onMention(this.props.status.get('account'), this.props.history);
  };

  handleDirectClick = () => {
    this.props.onDirect(this.props.status.get('account'), this.props.history);
  };

  handleMuteClick = () => {
    this.props.onMute(this.props.status.get('account'));
  };

  handleBlockClick = () => {
    this.props.onBlock(this.props.status);
  };

  handleOpen = () => {
    this.props.history.push(`/@${this.props.status.getIn(['account', 'acct'])}/${this.props.status.get('id')}`);
  };

  handleEmbed = () => {
    this.props.onEmbed(this.props.status);
  };

  handleReport = () => {
    this.props.onReport(this.props.status);
  };

  handleConversationMuteClick = () => {
    this.props.onMuteConversation(this.props.status);
  };

  handleCopy = () => {
    const url = this.props.status.get('url');
    navigator.clipboard.writeText(url);
  };

  handleHideClick = () => {
    this.props.onFilter();
  };

  handleTranslateClick = () => {
    // Grab the user language
    var userLang = navigator.language || navigator.userLanguage;
    userLang = userLang.split('-')[0];

    // Grab the post content and put it into a div
    // but replace all <p> by two newlines and all <br>s with a newline
    var html = this.props.status.get('content');
    var temp = document.createElement('div');
    temp.innerHTML = html.replaceAll('</p><p>', '\n\n').replace(/<\s*\/?br\s*[/]?>/gi, '\n');

    // Grab the text only and URL encode it
    var plain = temp.textContent || temp.innerText || '';
    var encoded = encodeURIComponent(plain);

    // Open the link on GTranslate
    var url = 'https://translate.google.com/?sl=auto&tl='+userLang+'&text='+encoded+'&op=translate';
    window.open(url, '_blank');
  };

  handleFilterClick = () => {
    this.props.onAddFilter(this.props.status);
  };

  render () {
    const { status, intl, withDismiss, withCounters, showReplyCount, scrollKey } = this.props;
    const { permissions, signedIn } = this.context.identity;

    const mutingConversation = status.get('muted');
    const publicStatus       = ['public', 'unlisted'].includes(status.get('visibility'));
    const pinnableStatus     = ['public', 'unlisted', 'private'].includes(status.get('visibility'));
    const writtenByMe        = status.getIn(['account', 'id']) === me;
    const isRemote           = status.getIn(['account', 'username']) !== status.getIn(['account', 'acct']);

    let menu = [];
    let reblogIcon = 'retweet';
    let replyIcon;
    let replyIconComponent;
    let replyTitle;

    menu.push({ text: intl.formatMessage(messages.open), action: this.handleOpen });
    menu.push({ text: `Google ${intl.formatMessage(messages.translate)}`, action: this.handleTranslateClick });

    if (publicStatus && isRemote) {
      menu.push({ text: intl.formatMessage(messages.openOriginalPage), href: status.get('url') });
    }

    menu.push({ text: intl.formatMessage(messages.copy), action: this.handleCopy });

    if (publicStatus && 'share' in navigator) {
      menu.push({ text: intl.formatMessage(messages.share), action: this.handleShareClick });
    }

    if (publicStatus && (signedIn || !isRemote)) {
      menu.push({ text: intl.formatMessage(messages.embed), action: this.handleEmbed });
    }

    if (signedIn) {
      menu.push(null);

      if (writtenByMe && pinnableStatus) {
        menu.push({ text: intl.formatMessage(status.get('pinned') ? messages.unpin : messages.pin), action: this.handlePinClick });
        menu.push(null);
      }

      if (writtenByMe || withDismiss) {
        menu.push({ text: intl.formatMessage(mutingConversation ? messages.unmuteConversation : messages.muteConversation), action: this.handleConversationMuteClick });
        menu.push(null);
      }

      if (writtenByMe) {
        menu.push({ text: intl.formatMessage(messages.edit), action: this.handleEditClick });
        menu.push({ text: intl.formatMessage(messages.delete), action: this.handleDeleteClick, dangerous: true });
        menu.push({ text: intl.formatMessage(messages.redraft), action: this.handleRedraftClick, dangerous: true });
      } else {
        menu.push({ text: intl.formatMessage(messages.mention, { name: status.getIn(['account', 'username']) }), action: this.handleMentionClick });
        menu.push({ text: intl.formatMessage(messages.direct, { name: status.getIn(['account', 'username']) }), action: this.handleDirectClick });
        menu.push(null);

        if (!this.props.onFilter) {
          menu.push({ text: intl.formatMessage(messages.filter), action: this.handleFilterClick, dangerous: true });
          menu.push(null);
        }

        menu.push({ text: intl.formatMessage(messages.mute, { name: status.getIn(['account', 'username']) }), action: this.handleMuteClick, dangerous: true });
        menu.push({ text: intl.formatMessage(messages.block, { name: status.getIn(['account', 'username']) }), action: this.handleBlockClick, dangerous: true });
        menu.push({ text: intl.formatMessage(messages.report, { name: status.getIn(['account', 'username']) }), action: this.handleReport, dangerous: true });

        if (((permissions & PERMISSION_MANAGE_USERS) === PERMISSION_MANAGE_USERS && (accountAdminLink || statusAdminLink)) || (isRemote && (permissions & PERMISSION_MANAGE_FEDERATION) === PERMISSION_MANAGE_FEDERATION)) {
          menu.push(null);
          if ((permissions & PERMISSION_MANAGE_USERS) === PERMISSION_MANAGE_USERS) {
            if (accountAdminLink !== undefined) {
              menu.push({ text: intl.formatMessage(messages.admin_account, { name: status.getIn(['account', 'username']) }), href: accountAdminLink(status.getIn(['account', 'id'])) });
            }
            if (statusAdminLink !== undefined) {
              menu.push({ text: intl.formatMessage(messages.admin_status), href: statusAdminLink(status.getIn(['account', 'id']), status.get('id')) });
            }
          }
          if (isRemote && (permissions & PERMISSION_MANAGE_FEDERATION) === PERMISSION_MANAGE_FEDERATION) {
            const domain = status.getIn(['account', 'acct']).split('@')[1];
            menu.push({ text: intl.formatMessage(messages.admin_domain, { domain: domain }), href: `/admin/instances/${domain}` });
          }
        }
      }
    }

    if (status.get('in_reply_to_id', null) === null) {
      replyIcon = 'reply';
      replyIconComponent = ReplyIcon;
      replyTitle = intl.formatMessage(messages.reply);
    } else {
      replyIcon = 'reply-all';
      replyIconComponent = ReplyAllIcon;
      replyTitle = intl.formatMessage(messages.replyAll);
    }

    const reblogPrivate = status.getIn(['account', 'id']) === me && status.get('visibility') === 'private';

    let reblogTitle, reblogIconComponent;

    if (status.get('reblogged')) {
      reblogTitle = intl.formatMessage(messages.cancel_reblog_private);
      reblogIconComponent = publicStatus ? RepeatIcon : RepeatPrivateIcon;
    } else if (publicStatus) {
      reblogTitle = intl.formatMessage(messages.reblog);
      reblogIconComponent = RepeatIcon;
    } else if (reblogPrivate) {
      reblogTitle = intl.formatMessage(messages.reblog_private);
      reblogIconComponent = RepeatPrivateIcon;
    } else {
      reblogTitle = intl.formatMessage(messages.cannot_reblog);
      reblogIconComponent = RepeatDisabledIcon;
    }

    const filterButton = this.props.onFilter && (
      <IconButton className='status__action-bar-button' title={intl.formatMessage(messages.hide)} icon='eye' iconComponent={VisibilityIcon} onClick={this.handleHideClick} />
    );

    return (
      <div className='status__action-bar'>
        <IconButton
          className='status__action-bar-button'
          title={replyTitle}
          icon={replyIcon}
          iconComponent={replyIconComponent}
          onClick={this.handleReplyClick}
          counter={showReplyCount ? status.get('replies_count') : undefined}
          obfuscateCount
        />
        <IconButton className={classNames('status__action-bar-button', { reblogPrivate })} disabled={!publicStatus && !reblogPrivate} active={status.get('reblogged')} title={reblogTitle} icon={reblogIcon} iconComponent={reblogIconComponent} onClick={this.handleReblogClick} counter={withCounters ? status.get('reblogs_count') : undefined} />
        <IconButton className='status__action-bar-button star-icon' animate active={status.get('favourited')} title={intl.formatMessage(messages.favourite)} icon='star' iconComponent={status.get('favourited') ? StarIcon : StarBorderIcon} onClick={this.handleFavouriteClick} counter={withCounters ? status.get('favourites_count') : undefined} />
        <IconButton className='status__action-bar-button bookmark-icon' disabled={!signedIn} active={status.get('bookmarked')} title={intl.formatMessage(messages.bookmark)} icon='bookmark' iconComponent={status.get('bookmarked') ? BookmarkIcon : BookmarkBorderIcon} onClick={this.handleBookmarkClick} />

        {filterButton}

        <DropdownMenuContainer
          scrollKey={scrollKey}
          status={status}
          items={menu}
          icon='ellipsis-h'
          size={18}
          iconComponent={MoreHorizIcon}
          direction='right'
          ariaLabel={intl.formatMessage(messages.more)}
        />

        <div className='status__action-bar-spacer' />
        <a href={status.get('url')} className='status__relative-time' target='_blank' rel='noopener'>
          <RelativeTimestamp timestamp={status.get('created_at')} />{status.get('edited_at') && <abbr title={intl.formatMessage(messages.edited, { date: intl.formatDate(status.get('edited_at'), { hour12: false, year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }) })}> *</abbr>}
        </a>
      </div>
    );
  }

}

export default withRouter(injectIntl(StatusActionBar));