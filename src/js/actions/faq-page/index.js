import { createAction } from 'redux-actions';

import { get, authenticatedPost, authenticatedPatch } from 'actions/common/async-action';
import {
  FAQS_API_URL, FAQS_REQUEST_START, FAQS_REQUEST_SUCCESS, FAQS_REQUEST_FAILURE,
  FAQS_POST_START, FAQS_POST_SUCCESS, FAQS_POST_FAILURE,
  FAQ_REQUEST_START, FAQ_REQUEST_SUCCESS, FAQ_REQUEST_FAILURE,
  UPDATE_FAQ_REQUEST_START, UPDATE_FAQ_REQUEST_SUCCESS, UPDATE_FAQ_REQUEST_FAILURE,
  BULK_UPDATE_FAQS_START, BULK_UPDATE_FAQS_SUCCESS, BULK_UPDATE_FAQS_FAILURE
} from 'utils/constants';

export const requestFAQs = get(
  `${FAQS_API_URL}?limit=100`, [FAQS_REQUEST_START, FAQS_REQUEST_SUCCESS, FAQS_REQUEST_FAILURE]
);

export const fetchFAQ = (id) => (get(
  `${FAQS_API_URL}${id}/`,
  [FAQ_REQUEST_START, FAQ_REQUEST_SUCCESS, FAQ_REQUEST_FAILURE]
)());

export const askQuestion = authenticatedPost(
  FAQS_API_URL, [FAQS_POST_START, FAQS_POST_SUCCESS, FAQS_POST_FAILURE]
);

export const EXPAND_FAQ = 'EXPAND_FAQ';
export const expandFAQ = createAction(EXPAND_FAQ);

export const updateFAQ = (id, data) => (authenticatedPatch(
  `${FAQS_API_URL}${id}/`,
  [UPDATE_FAQ_REQUEST_START, UPDATE_FAQ_REQUEST_SUCCESS, UPDATE_FAQ_REQUEST_FAILURE]
  )(data)
);

export const updateOrder = (faqs) => (authenticatedPatch(
  `${FAQS_API_URL}bulk-update/`,
  [BULK_UPDATE_FAQS_START, BULK_UPDATE_FAQS_SUCCESS, BULK_UPDATE_FAQS_FAILURE]
  )(faqs)
);
