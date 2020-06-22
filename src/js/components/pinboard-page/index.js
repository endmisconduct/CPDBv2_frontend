import PropTypes from 'prop-types';
import React, { Component } from 'react';
import cx from 'classnames';
import { isEmpty, noop } from 'lodash';

import responsiveContainerStyles from 'components/common/responsive-container.sass';
import SearchBar from './search-bar';
import Header from './header';
import styles from './pinboard-page.sass';
import PinboardInfoContainer from 'containers/pinboard-page/pinboard-info';
import RelevantSectionContainer from 'containers/pinboard-page/relevant-section';
import PinnedOfficersContainer from 'containers/pinboard-page/pinned-officers';
import PinnedCRsContainer from 'containers/pinboard-page/pinned-crs';
import PinnedTRRsContainer from 'containers/pinboard-page/pinned-trrs';
import FooterContainer from 'containers/footer-container';
import PinboardsContainer from 'containers/pinboard-page/pinboards-container';
import EmptyPinboardContainer from 'containers/pinboard-page/empty-pinboard';
import { PreviewPaneWithOverlay } from 'components/common/preview-pane';
import ManagePinboardsButtons from 'components/pinboard-page/manage-pinboards-buttons';
import LoadingSpinner from 'components/common/loading-spinner';
import PinboardDataVisualizationContainer from 'containers/pinboard-page/pinboard-data-visualization-container';


export default class PinboardPage extends Component {
  componentDidMount() {
    document.body.classList.add('body-fixed-viewport');
  }

  componentWillUnmount() {
    document.body.classList.remove('body-fixed-viewport');
    document.body.classList.remove('body-not-scrollable');
  }

  handleOverlayClick = () => {
    this.props.focusItem({});
  };

  handlePinChangedOnPreviewPane = item => {
    const {
      focusItem,
      addOrRemoveItemInPinboardFromPreviewPane,
    } = this.props;

    focusItem({});
    addOrRemoveItemInPinboardFromPreviewPane(item);
  };

  renderPreviewPane() {
    const { focusedItem } = this.props;

    return (
      <PreviewPaneWithOverlay
        isShown={ !isEmpty(focusedItem) }
        handleClose={ this.handleOverlayClick }
        customClass='preview-pane'
        yScrollable={ true }
        addOrRemoveItemInPinboard={ this.handlePinChangedOnPreviewPane }
        { ...focusedItem }
      />
    );
  }

  renderContent() {
    const { isEmptyPinboard } = this.props;

    if (isEmptyPinboard) {
      return (
        <EmptyPinboardContainer />
      );
    }

    return (
      <div>
        <div className={ cx(responsiveContainerStyles.responsiveContainer, 'pinboard-page') }>
          <PinboardInfoContainer />
          <PinboardDataVisualizationContainer />
          <div className='pinned-section'>
            <PinnedOfficersContainer/>
            <PinnedCRsContainer/>
            <PinnedTRRsContainer/>
          </div>
        </div>
        <RelevantSectionContainer />
        { this.renderPreviewPane() }
      </div>
    );
  }

  render() {
    const {
      pinboardId,
      initialRequested,
      pinboardPageLoading,
      isEmptyPinboard,
      showPinboardsList,
      createNewEmptyPinboard,
      duplicatePinboard,
    } = this.props;

    if (!initialRequested) {
      return null;
    }

    if (pinboardPageLoading) {
      return <LoadingSpinner className={ styles.pinboardLoading } />;
    }

    return (
      <div className={ cx(styles.pinboardPage, { 'empty': isEmptyPinboard } ) }>
        <div className='pinboard-header'>
          <Header />
          <SearchBar
            shareable={ !isEmptyPinboard }
            headerButtons={
              <ManagePinboardsButtons
                pinboardId={ pinboardId }
                showPinboardsList={ showPinboardsList }
                createNewEmptyPinboard={ createNewEmptyPinboard }
                duplicatePinboard={ duplicatePinboard }
              />
            }
          />
        </div>
        { this.renderContent() }
        <PinboardsContainer />
        <FooterContainer className='footer' />
      </div>
    );
  }
}

PinboardPage.propTypes = {
  pinboardId: PropTypes.string,
  params: PropTypes.object,
  initialRequested: PropTypes.bool,
  pinboardPageLoading: PropTypes.bool,
  isEmptyPinboard: PropTypes.bool,
  focusedItem: PropTypes.object,
  focusItem: PropTypes.func,
  routes: PropTypes.array,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  updatePathName: PropTypes.func,
  addOrRemoveItemInPinboardFromPreviewPane: PropTypes.func,
  showPinboardsList: PropTypes.func,
  createNewEmptyPinboard: PropTypes.func,
  duplicatePinboard: PropTypes.func,
};

PinboardPage.defaultProps = {
  pinboard: {},
  focusItem: noop,
  addOrRemoveItemInPinboardFromPreviewPane: noop,
  showPinboardsList: noop,
  createNewEmptyPinboard: noop,
  duplicatePinboard: noop,
};
