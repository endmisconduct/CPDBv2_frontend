import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { map, noop, get, isEqual, isEmpty } from 'lodash';
import cx from 'classnames';

import SuggestionGroup from './suggestion-group';
import SuggestionNoResult from './search-no-result';
import PreviewPane from 'components/common/preview-pane';
import * as constants from 'utils/constants';
import { SEARCH_PAGE_NAVIGATION_KEYS } from 'utils/constants';
import * as LayeredKeyBinding from 'utils/layered-key-binding';
import SearchTags from 'components/search-page/search-tags';
import PinboardButtonContainer from 'containers/search-page/pinboard-button-container';
import ScrollIntoView from 'components/common/scroll-into-view';
import style from './search-results.sass';
import * as tracking from 'utils/tracking';


const previewPaneIdFieldMapping = {
  'SEARCH-TERMS': 'text',
  'DATE > CR': 'id',
  'DATE > TRR': 'id',
  'DATE > OFFICERS': 'id',
  'UNIT > OFFICERS': 'id',
  OFFICER: 'id',
  CR: 'id',
  TRR: 'id',
  COMMUNITY: 'text',
  NEIGHBORHOOD: 'text',
  WARD: 'text',
  'POLICE-DISTRICT': 'text',
  BEAT: 'text',
  'SCHOOL-GROUND': 'text',
  RANK: 'text',
  'INVESTIGATOR > CR': 'id',
  UNIT: 'text',
};

export default class SearchResults extends Component {
  state = {
    prevFocusedItem: this.props.focusedItem,
    scrollIntoItemClassName: '',
  };

  static getDerivedStateFromProps(props, state) {
    const { focusedItem } = props;
    const { prevFocusedItem } = state;
    const scrollIntoItemClassName = !isEmpty(focusedItem) && !isEqual(focusedItem, prevFocusedItem) ?
      `suggestion-item-${get(focusedItem, 'uniqueKey', '')}` : '';
    return { prevFocusedItem: focusedItem, scrollIntoItemClassName };
  }

  componentDidMount() {
    const { move } = this.props;

    SEARCH_PAGE_NAVIGATION_KEYS.map((direction) => (LayeredKeyBinding.bind(
      direction,
      (event) => {
        event.preventDefault && event.preventDefault();
        // totalItemCount cannot be declared in the "const" way as it needs updating
        move(direction, this.props.totalItemCount);
      }
    )));
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { focusedItem, searchText } = this.props;
    const { focusedItem: prevFocusedItem } = prevProps;

    if (!isEqual(focusedItem, prevFocusedItem)) {
      const { type, itemRank } = focusedItem;
      const itemId = focusedItem[previewPaneIdFieldMapping[type]];
      if (itemId)
        tracking.trackSearchFocusedItem(type, searchText, itemId, itemRank);
    }
  }

  componentWillUnmount() {
    SEARCH_PAGE_NAVIGATION_KEYS.map((direction) => (LayeredKeyBinding.unbind(direction)));

    this.props.resetNavigation(0);
  }

  renderGroups() {
    const {
      suggestionGroups,
      searchText,
      isEmpty,
      navigation,
      onLoadMore,
      aliasEditModeOn,
      setAliasAdminPageContent,
      focusedItem,
      getSuggestionWithContentType,
      hasMore,
      singleContent,
      nextParams,
      setSearchNavigation,
      addOrRemoveItemInPinboard,
      pinboardUrl,
      visitPinButtonIntroduction,
      hide,
    } = this.props;

    if (isEmpty) {
      return (
        <SuggestionNoResult searchText={ searchText }/>
      );
    }

    return map(suggestionGroups, (group) => (
      <SuggestionGroup
        setSearchNavigation={ setSearchNavigation }
        focusedItem={ focusedItem }
        onLoadMore={ onLoadMore }
        key={ `suggestion-group-${group.header}` }
        navigation={ navigation }
        setAliasAdminPageContent={ setAliasAdminPageContent }
        suggestions={ group.items }
        showMoreButton={ group.canLoadMore }
        header={ group.header }
        aliasEditModeOn={ aliasEditModeOn }
        getSuggestionWithContentType={ getSuggestionWithContentType }
        hasMore={ hasMore }
        searchText={ searchText }
        nextParams={ nextParams }
        singleContent={ singleContent }
        pinboardUrl={ pinboardUrl }
        visitPinButtonIntroduction={ visitPinButtonIntroduction }
        hide={ hide }
        addOrRemoveItemInPinboard={ addOrRemoveItemInPinboard }/>
    ));
  }

  renderActionBar() {
    const { aliasEditModeOn } = this.props;

    if (aliasEditModeOn) {
      return (
        <div className='action-bar'>
          <Link
            to={ `/edit${constants.SEARCH_PATH}` }
            className='cancel-alias-button'>
            Cancel
          </Link>
        </div>
      );
    } else {
      return (
        <div className='plus-sign-wrapper'>
          <Link to={ `/edit${constants.SEARCH_ALIAS_EDIT_PATH}` } className='plus-sign'>[+]</Link>
        </div>
      );
    }
  }

  renderContent() {
    const { editModeOn } = this.props;

    return (
      <div className='content-wrapper'>
        <ScrollIntoView focusedItemClassName={ this.state.scrollIntoItemClassName }>
          { editModeOn ? this.renderActionBar() : null }
          { this.renderGroups() }
        </ScrollIntoView>
      </div>
    );
  }

  render() {
    const {
      isRequesting,
      aliasEditModeOn,
      previewPaneInfo,
      tags,
      onSelect,
      contentType,
      onEmptyPinboardButtonClick,
      addOrRemoveItemInPinboard,
    } = this.props;

    return (
      <div className={ style.searchResults }>
        <div className='buttons-wrapper'>
          <SearchTags
            tags={ tags }
            onSelect={ onSelect }
            selected={ contentType }
            isRequesting={ isRequesting }
          />
          <PinboardButtonContainer
            emptyText={ true }
            onEmptyPinboardButtonClick={ onEmptyPinboardButtonClick }
          />
        </div>
        <div className={ cx('suggestion-results', { 'edit-mode-on': aliasEditModeOn }) }>
          {
            isRequesting ?
              <div className='loading'>
                Loading...
              </div> :
              <div className='result-wrapper'>
                { this.renderContent() }
              </div>
          }
          <PreviewPane { ...previewPaneInfo } addOrRemoveItemInPinboard={ addOrRemoveItemInPinboard }/>
        </div>
      </div>
    );
  }
}

SearchResults.propTypes = {
  navigation: PropTypes.object,
  searchText: PropTypes.string,
  suggestionGroups: PropTypes.array,
  isRequesting: PropTypes.bool,
  editModeOn: PropTypes.bool,
  onLoadMore: PropTypes.func,
  onSelect: PropTypes.func,
  resetNavigation: PropTypes.func,
  setAliasAdminPageContent: PropTypes.func,
  isEmpty: PropTypes.bool,
  aliasEditModeOn: PropTypes.bool,
  previewPaneInfo: PropTypes.object,
  focusedItem: PropTypes.object,
  getSuggestionWithContentType: PropTypes.func,
  hasMore: PropTypes.bool,
  nextParams: PropTypes.object,
  singleContent: PropTypes.bool,
  move: PropTypes.func,
  totalItemCount: PropTypes.number,
  setSearchNavigation: PropTypes.func,
  addOrRemoveItemInPinboard: PropTypes.func,
  tags: PropTypes.array,
  contentType: PropTypes.string,
  onEmptyPinboardButtonClick: PropTypes.func,
  pinboardUrl: PropTypes.string,
  visitPinButtonIntroduction: PropTypes.func,
  isPinButtonIntroductionVisited: PropTypes.bool,
  hide: PropTypes.bool,
};

SearchResults.defaultProps = {
  previewPaneInfo: {},
  focusedItem: {},
  getSuggestionWithContentType: noop,
  resetNavigation: noop,
  onEmptyPinboardButtonClick: noop,
  visitPinButtonIntroduction: noop,
  isPinButtonIntroductionVisited: true,
};
