import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import {
  getPinboardId,
  isEmptyPinboardWithRemovingItemSelector,
  pinboardPageLoadingSelector,
  getInitialRequested,
} from 'selectors/pinboard-page/pinboard';
import PinboardPage from 'components/pinboard-page';
import { hasMapMarkersSelector } from 'selectors/pinboard-page/geographic-data';
import { hasComplaintSummarySelector } from 'selectors/pinboard-page/widgets/complaint-summary';
import { focusedItemSelector } from 'selectors/pinboard-page/focused-item';
import { createNewEmptyPinboard, duplicatePinboard } from 'actions/pinboard';
import {
  focusItem,
  addOrRemoveItemInPinboardFromPreviewPane,
  showPinboardsList,
} from 'actions/pinboard-page';
import { updatePathName } from 'actions/path-name';


function mapStateToProps(state, ownProps) {
  return {
    ...ownProps,
    pinboardId: getPinboardId(state),
    initialRequested: getInitialRequested(state),
    pinboardPageLoading: pinboardPageLoadingSelector(state),
    isEmptyPinboard: isEmptyPinboardWithRemovingItemSelector(state),
    focusedItem: focusedItemSelector(state),
    hasMapMarker: hasMapMarkersSelector(state),
    hasComplaintSummary: hasComplaintSummarySelector(state),
  };
}

const mapDispatchToProps = {
  focusItem,
  updatePathName,
  addOrRemoveItemInPinboardFromPreviewPane,
  showPinboardsList,
  createNewEmptyPinboard,
  duplicatePinboard,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PinboardPage));
