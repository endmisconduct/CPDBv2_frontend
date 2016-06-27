import { get, post } from 'actions/common/async-action';


export const FAQ_PAGE_REQUEST_START = 'FAQ_PAGE_REQUEST_START';
export const FAQ_PAGE_REQUEST_SUCCESS = 'FAQ_PAGE_REQUEST_SUCCESS';
export const FAQ_PAGE_REQUEST_FAILURE = 'FAQ_PAGE_REQUEST_FAILURE';

export const FAQ_PAGE_API_URL = 'faqs/';

export const requestFAQs = get(
  FAQ_PAGE_API_URL, [FAQ_PAGE_REQUEST_START, FAQ_PAGE_REQUEST_SUCCESS, FAQ_PAGE_REQUEST_FAILURE]
);

export const FAQ_PAGE_POST_START = 'FAQ_PAGE_POST_START';
export const FAQ_PAGE_POST_SUCCESS = 'FAQ_PAGE_POST_SUCCESS';
export const FAQ_PAGE_POST_FAILURE = 'FAQ_PAGE_POST_FAILURE';

export const askQuestion = post(
  FAQ_PAGE_API_URL, [FAQ_PAGE_POST_START, FAQ_PAGE_POST_SUCCESS, FAQ_PAGE_POST_FAILURE]
);
