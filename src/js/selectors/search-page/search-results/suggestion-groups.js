import { createSelector } from 'reselect';
import { indexOf, isEmpty, head, keys, map, omitBy, pick, sortBy, isUndefined } from 'lodash';

import * as constants from 'utils/constants';
import { navigationItemTransform, searchResultItemTransform } from 'selectors/common/search-item-transforms';
import extractQuery from 'utils/extract-query';
import { dataToolSearchUrl } from 'utils/v1-url';
import { isItemPinned, pinboardItemsSelector } from 'selectors/pinboard-page/pinboard';
import { isPinButtonIntroductionVisitedSelector } from 'selectors/pinboard-introduction';
import { getQuery } from 'selectors/search-page/common';
import { PINNED_ITEM_TYPES, PIN_BUTTON_INTRODUCTION_INDEX } from 'utils/constants';


const itemsPerCategory = 5;

const getSuggestionGroups = state => state.searchPage.suggestionGroups;
const getSuggestionTags = state => state.searchPage.tags;
const getSuggestionContentType = state => state.searchPage.contentType;
const getPagination = state => state.searchPage.pagination;


export const queryPrefixSelector = createSelector(
  getSuggestionContentType,
  (contentType) => constants.SEARCH_CATEGORY_PREFIXES[contentType],
);

export const suggestionTagsSelector = createSelector(
  getSuggestionTags,
  getQuery,
  (suggestionTags, query) => {
    if (!query) {
      return [constants.RECENT_CONTENT_TYPE];
    }
    return sortBy(suggestionTags, tag => indexOf(constants.SEARCH_CATEGORIES, tag));
  }
);

export const isShowingSingleContentTypeSelector = createSelector(
  getSuggestionContentType,
  getSuggestionTags,
  (contentType, tags) => !!contentType || tags.length === 1
);

/*
[
  {
    header: 'OFFICER',
    items: [
      1, 2, 3, 4, 5
    ],
    canLoadMore: <boolean>
  },
  {
    header: 'CO-ACCUSED',
    items: [
      1, 2, 3, 4
    ],
    canLoadMore: <boolean>
  }
]
*/
export const slicedSuggestionGroupsSelector = createSelector(
  getSuggestionGroups,
  isShowingSingleContentTypeSelector,
  getSuggestionContentType,
  (suggestionGroups, isSingle, contentType) => {
    let groups = pick(omitBy(suggestionGroups, isEmpty), contentType || constants.SEARCH_CATEGORIES);

    let itemRank = 1;
    let lastIndex = 1;
    return keys(groups).map((key) => {
      let items = isSingle ? groups[key] : groups[key].slice(0, itemsPerCategory);
      items = map(items, item => ({
        ...item,
        type: key,
        itemIndex: lastIndex++,
        itemRank: itemRank++,
      }));

      const canLoadMore = !isSingle && items.length >= itemsPerCategory;
      canLoadMore && lastIndex++;
      return {
        header: key,
        items,
        canLoadMore: canLoadMore,
      };
    });
  }
);

export const getPinnedItem = (item, pinboardItems) => {
  const pinnedItemType = constants.PINNED_ITEM_TYPES[item.type];
  return {
    ...item,
    isPinned: isItemPinned(pinnedItemType, item.id, pinboardItems),
  };
};

export const isEmptySelector = createSelector(
  slicedSuggestionGroupsSelector,
  suggestionGroups => !suggestionGroups.length
);

export const searchResultGroupsSelector = createSelector(
  slicedSuggestionGroupsSelector,
  pinboardItemsSelector,
  isPinButtonIntroductionVisitedSelector,
  (groups, pinboardItems, isPinButtonIntroductionVisited) => {
    let hasFirstIntroduction = false;
    return map(groups, ({ header, items, canLoadMore }) => {
      const showIntroduction = !hasFirstIntroduction
        && !isUndefined(PINNED_ITEM_TYPES[header])
        && !isPinButtonIntroductionVisited;
      if (showIntroduction) {
        hasFirstIntroduction = true;
      }
      const pinButtonIntroductionIndex = Math.min(items.length, PIN_BUTTON_INTRODUCTION_INDEX) - 1;
      return {
        header,
        canLoadMore,
        items: map(items, (item, index) => ({
          ...searchResultItemTransform(getPinnedItem(item, pinboardItems)),
          showIntroduction: showIntroduction && (index === pinButtonIntroductionIndex),
        })),
      };
    });
  }
);

export const firstItemSelector = createSelector(
  slicedSuggestionGroupsSelector,
  getQuery,
  (groups, query) => {
    if (groups.length === 0) {
      return {
        url: dataToolSearchUrl(query),
        isDataToolSearchUrl: true,
      };
    } else {
      const firstGroup = head(groups);
      const firstRecord = head(firstGroup.items);

      return navigationItemTransform(firstRecord);
    }
  }
);

export const hasMoreSelector = createSelector(
  isShowingSingleContentTypeSelector,
  getPagination,
  (singleContent, { next }) => (singleContent && !!next)
);

export const nextParamsSelector = createSelector(
  getPagination,
  ({ next }) => (extractQuery(next))
);
