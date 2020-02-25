import { combineReducers } from 'redux';

import data from './data';
import titleEditModeOn from './title-edit-mode-on';
import textContentEditModeOn from './text-content-edit-mode-on';
import tagsErrorMessages from './tags-error-messages';
import suggestionTags from './suggestion-tags';


export default combineReducers({
  data,
  titleEditModeOn,
  textContentEditModeOn,
  tagsErrorMessages,
  suggestionTags,
});
