import {
  TRACKER_DOCUMENTS_REQUEST_FAILURE,
  TRACKER_DOCUMENTS_REQUEST_START,
  TRACKER_DOCUMENTS_REQUEST_SUCCESS,
  TRACKER_DOCUMENTS_URL,
} from 'utils/constants';
import { get } from 'actions/common/async-action';

export const fetchTrackerDocuments = (params) => (get(
  `${TRACKER_DOCUMENTS_URL}`,
  [
    TRACKER_DOCUMENTS_REQUEST_START,
    TRACKER_DOCUMENTS_REQUEST_SUCCESS,
    TRACKER_DOCUMENTS_REQUEST_FAILURE
  ]
)({ ...params }));
