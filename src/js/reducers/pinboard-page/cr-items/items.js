import { handleActions } from 'redux-actions';
import * as _ from 'lodash';

import {
  PINBOARD_COMPLAINTS_FETCH_REQUEST_SUCCESS,
  ADD_ITEM_IN_PINBOARD_PAGE,
  ORDER_PINBOARD,
  REMOVE_ITEM_IN_PINBOARD_PAGE,
  PINBOARD_ITEM_REMOVE_MODE,
  LOCATION_CHANGE,
} from 'utils/constants';


const toRawCR = item => item.recentItemData;

export default handleActions({
  [PINBOARD_COMPLAINTS_FETCH_REQUEST_SUCCESS]: (state, action) => action.payload,
  [ADD_ITEM_IN_PINBOARD_PAGE]: (state, action) => {
    const currentItems = state;
    if (action.payload.type === 'CR') {
      const item = action.payload;
      if (_.every(currentItems, currentItem => currentItem.crid !== item.id)) {
        return currentItems.concat(toRawCR(item));
      }
    }
    return currentItems;
  },
  [REMOVE_ITEM_IN_PINBOARD_PAGE]: (state, action) => {
    const currentItems = state;
    const { id, type, mode } = action.payload;

    if (type === 'CR' && mode !== PINBOARD_ITEM_REMOVE_MODE.API_ONLY) {
      return _.reject(currentItems, { crid: id });
    }
    return currentItems;
  },
  [ORDER_PINBOARD]: (state, action) => {
    const currentItems = state;
    const { ids, type } = action.payload;

    if (type === 'CR') {
      return _.sortBy(currentItems, item => _.findIndex(ids, id => id === item.crid));
    }
    return currentItems;
  },
  [LOCATION_CHANGE]: (state, action) => [],
}, []);