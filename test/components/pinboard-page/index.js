import React from 'react';
import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import MockStore from 'redux-mock-store';
import { stub } from 'sinon';
import { MemoryRouter, Router, Route } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { createStore as ReduxCreateStore } from 'redux';
import { set } from 'lodash';

import PinnedOfficersContainer from 'containers/pinboard-page/pinned-officers';
import PinnedCRsContainer from 'containers/pinboard-page/pinned-crs';
import PinnedTRRsContainer from 'containers/pinboard-page/pinned-trrs';
import PinboardPageContainer from 'containers/pinboard-page';
import RelevantSectionContainer from 'containers/pinboard-page/relevant-section';
import SearchBar from 'components/pinboard-page/search-bar';
import { PreviewPaneWithOverlay } from 'components/common/preview-pane';
import RootReducer from 'reducers/root-reducer';
import FooterContainer from 'containers/footer-container';
import PinboardsContainer from 'containers/pinboard-page/pinboards-container';
import {
  PINBOARD_PAGE_FOCUS_ITEM,
  PINBOARD_EDIT_TYPES,
} from 'utils/constants';
import PinboardPage from 'components/pinboard-page';
import EmptyPinboardContainer from 'containers/pinboard-page/empty-pinboard';
import EmptyPinboardPage from 'components/pinboard-page/empty-pinboard';
import ManagePinboardsButtons from 'components/pinboard-page/manage-pinboards-buttons';
import PinboardDataVisualizationContainer from 'containers/pinboard-page/pinboard-data-visualization-container';
import { buildEditStateFields } from 'utils/test/factories/draft';
import LoadingSpinner from 'components/common/loading-spinner';


describe('PinboardPage component', function () {
  const defaultPaginationState = {
    requesting: false,
    items: [],
    count: 0,
    pagination: { next: null, previous: null },
  };

  const createPinboardPage = (pinboard, editModeOn) => ({
    graphData: { requesting: false },
    geographicData: { crsRequesting: false, trrsRequesting: false, mapCrsData: [], mapTrrsData: [] },
    relevantDocuments: defaultPaginationState,
    relevantCoaccusals: defaultPaginationState,
    relevantComplaints: defaultPaginationState,
    crItems: { requesting: false, items: [] },
    officerItems: { requesting: false, items: [] },
    trrItems: { requesting: false, items: [] },
    initialRequested: true,
    focusedItem: {},
    pinboard,
    editModeOn,
    pinboards: [],
    widgets: {},
  });

  const defaultFields = buildEditStateFields({
    'empty_pinboard_title': ['Get started'],
    'empty_pinboard_description': [
      'Use search to find officers and individual complaint records and ' +
      'press the plus button to add cards to your pinboard.',
      '',
      'Come back to the pinboard to give it a title and see a network map or discover relevant documents.',
    ],
  });

  const defaultEditModeOn = {
    [PINBOARD_EDIT_TYPES.EMPTY_PINBOARD_TITLE]: false,
    [PINBOARD_EDIT_TYPES.EMPTY_PINBOARD_DESCRIPTION]: false,
  };

  const createStore = (pinboard, editModeOn=defaultEditModeOn, fields=defaultFields) => MockStore()({
    pinboardPage: createPinboardPage(pinboard, editModeOn),
    cms: {
      pages: {
        'pinboard-page': {
          fields,
        },
      },
    },
  });

  it('should render LoadingSpinner if pinboardPageLoading is true', function () {
    const pinboard = {
      'id': '5cd06f2b',
      'title': 'Pinboard title',
    };

    const state = {
      pinboardPage: createPinboardPage(pinboard),
      pathname: 'pinboard/5cd06f2b',
    };
    state.pinboardPage.initialRequested = true;
    state.pinboardPage.pinboard.hasPendingChanges = true;

    const store = MockStore()(state);

    const wrapper = mount(
      <Provider store={ store }>
        <MemoryRouter>
          <PinboardPageContainer />
        </MemoryRouter>
      </Provider>
    );

    wrapper.find(LoadingSpinner).exists().should.be.true();
  });

  it('should render PinnedSection component and SearchBar component', function () {
    const pinboard = {
      'id': '5cd06f2b',
      'crids': ['123'],
    };

    const wrapper = mount(
      <Provider store={ createStore(pinboard) }>
        <MemoryRouter>
          <PinboardPageContainer />
        </MemoryRouter>
      </Provider>
    );

    wrapper.find('.pinned-section').exists().should.be.true();
    wrapper.find(PinnedOfficersContainer).exists().should.be.true();
    wrapper.find(PinnedCRsContainer).exists().should.be.true();
    wrapper.find(PinnedTRRsContainer).exists().should.be.true();
    wrapper.find(PinboardsContainer).exists().should.be.true();
    const pinboardPageComponent = wrapper.find(PinboardPage);
    const searchBar = wrapper.find(SearchBar);
    const headerButtons = searchBar.prop('headerButtons');
    headerButtons.props.pinboardId.should.equal('5cd06f2b');
    headerButtons.props.showPinboardsList.should.eql(pinboardPageComponent.prop('showPinboardsList'));
    headerButtons.props.createNewEmptyPinboard.should.eql(pinboardPageComponent.prop('createNewEmptyPinboard'));
    headerButtons.props.duplicatePinboard.should.eql(pinboardPageComponent.prop('duplicatePinboard'));
  });

  it('should render pinboard page correctly', function () {
    const pinboard = {
      id: 'fe12bc',
      title: 'This is pinboard title',
      description: 'This is pinboard description',
      crids: ['123'],
    };

    const wrapper = mount(
      <Provider store={ createStore(pinboard) }>
        <MemoryRouter>
          <PinboardPageContainer />
        </MemoryRouter>
      </Provider>
    );

    wrapper.find(RelevantSectionContainer).exists().should.be.true();
    wrapper.find(PinboardDataVisualizationContainer).exists().should.be.true();
    wrapper.find(ManagePinboardsButtons).prop('pinboardId').should.equal('fe12bc');
    const footer = wrapper.find(FooterContainer);
    footer.prop('className').should.equal('footer');
  });

  it('should render EmptyPinboard instead of pinboard contents if pinboard is empty', function () {
    const pinboard = {
      title: 'This is pinboard title',
      description: 'This is pinboard description',
      'example_pinboards': [{
        id: '66ef1561',
        title: 'Pinboard 1',
        description: 'Description 1',
      }, {
        id: '66ef1562',
        title: 'Pinboard 2',
        description: 'Description 2',
      }],
    };

    const wrapper = mount(
      <Provider store={ createStore(pinboard) }>
        <MemoryRouter>
          <PinboardPageContainer />
        </MemoryRouter>
      </Provider>
    );

    wrapper.find(EmptyPinboardContainer).exists().should.be.true();

    wrapper.find('.pinboard-title').exists().should.be.false();
    wrapper.find('.pinboard-description').exists().should.be.false();
    wrapper.find(RelevantSectionContainer).exists().should.be.false();

    wrapper.find(SearchBar).prop('shareable').should.be.false();

    const emptyPinboard = wrapper.find(EmptyPinboardPage);
    emptyPinboard.prop('examplePinboards').should.eql([{
      id: '66ef1561',
      title: 'Pinboard 1',
      description: 'Description 1',
    }, {
      id: '66ef1562',
      title: 'Pinboard 2',
      description: 'Description 2',
    }]);

    wrapper.find(FooterContainer).exists().should.be.true();
  });

  it('should render PreviewPaneWithOverlay if there is no focused item by default', function () {
    const wrapper = shallow(
      <PinboardPage initialRequested={ true } focusedItem={ {} }/>
    );

    const instance = wrapper.instance();
    const previewPaneWithOverlay = wrapper.find(PreviewPaneWithOverlay);
    previewPaneWithOverlay.prop('isShown').should.be.false();
    previewPaneWithOverlay.prop('handleClose').should.be.eql(instance.handleOverlayClick);
    previewPaneWithOverlay.prop('yScrollable').should.be.true();
    previewPaneWithOverlay.prop('addOrRemoveItemInPinboard').should.be.eql(
      instance.handlePinChangedOnPreviewPane
    );
  });

  it('should render PreviewPaneWithOverlay if there is focused item', function () {
    const focusedItem = {
      type: 'CR',
      data: {
        address: '49XX South KARLOV AVE, CHICAGO ILLINOIS 60632',
        category: 'Unknown',
        coaccused: [],
        incidentDate: 'MAY 9, 2016',
        isPinned: true,
        subCategory: 'Unknown',
        subText: '',
        to: '/complaint/1080449/',
      },
    };

    const wrapper = shallow(
      <PinboardPage initialRequested={ true } focusedItem={ focusedItem }/>
    );

    const instance = wrapper.instance();
    const previewPaneWithOverlay = wrapper.find(PreviewPaneWithOverlay);
    previewPaneWithOverlay.prop('isShown').should.be.true();
    previewPaneWithOverlay.prop('handleClose').should.be.eql(instance.handleOverlayClick);
    previewPaneWithOverlay.prop('yScrollable').should.be.true();
    previewPaneWithOverlay.prop('addOrRemoveItemInPinboard').should.be.eql(instance.handlePinChangedOnPreviewPane);
  });

  it('should handle on overlay click', function () {
    const pinboard = {
      title: 'This is pinboard title',
      description: 'This is pinboard description',
      crids: ['123'],
    };

    const pinboardPageData = createPinboardPage(pinboard);
    set(pinboardPageData, 'crItems', { requesting: false, items: [{ 'crid': '123' }] });

    const state = {
      pinboardPage: pinboardPageData,
      pathname: 'pinboard/5cd06f2b',
    };

    const history = createMemoryHistory();

    const store = ReduxCreateStore(RootReducer(history), state);

    const pinboardPage = () => (
      <Provider store={ store }>
        <PinboardPageContainer />
      </Provider>
    );

    const wrapper = mount(
      <Router history={ history }>
        <Route path='/' component={ pinboardPage } />
      </Router>
    );

    store.dispatch({
      type: PINBOARD_PAGE_FOCUS_ITEM,
      payload: {
        type: 'CR',
        id: '123',
      },
    });
    wrapper.update();
    let previewPaneWithOverlay = wrapper.find(PreviewPaneWithOverlay);
    previewPaneWithOverlay.prop('isShown').should.be.true();

    const overlay = wrapper.find('.overlay').at(0);
    overlay.simulate('click');
    wrapper.update();

    previewPaneWithOverlay = wrapper.find(PreviewPaneWithOverlay);
    previewPaneWithOverlay.prop('isShown').should.be.false();
  });

  it('should handle when pin status is changed from preview pane', function () {
    const pinboard = {
      title: 'This is pinboard title',
      description: 'This is pinboard description',
      'officer_ids': [123],
    };
    const pinboardPageData = createPinboardPage(pinboard);
    const item = {
      id: 123,
      'full_name': 'John Watts',
      'allegation_count': 1,
      'sustained_count': 1,
      'birth_year': 1975,
      'appointed_date': '2010-10-21',
      race: 'black',
      rank: 'Police Officer',
      gender: 'Male',
    };
    set(pinboardPageData, 'officerItems', { requesting: false, items: [item] });
    const state = {
      pinboardPage: pinboardPageData,
      pathname: 'pinboard/5cd06f2b',
    };
    const history = createMemoryHistory();
    const store = ReduxCreateStore(RootReducer(history), state);

    const pinboardPage = () => (
      <Provider store={ store }>
        <PinboardPageContainer />
      </Provider>
    );

    const wrapper = mount(
      <Router history={ history }>
        <Route path='/' component={ pinboardPage } />
      </Router>
    );

    store.dispatch({
      type: PINBOARD_PAGE_FOCUS_ITEM,
      payload: {
        type: 'OFFICER',
        id: 123,
      },
    });

    const instance = wrapper.find(PinboardPage).instance();
    const handlePinChangedOnPreviewPane = stub(instance, 'handlePinChangedOnPreviewPane');
    instance.forceUpdate();
    wrapper.update();

    const pinButton = wrapper.find('.pin-button').first();
    pinButton.simulate('click');

    handlePinChangedOnPreviewPane.should.be.calledWith({
      type: 'OFFICER',
      id: 123,
      isPinned: true,
      fullName: 'John Watts',
      complaintCount: 1,
      sustainedCount: 1,
      age: '42-year-old',
      race: 'black',
      rank: 'Police Officer',
      gender: 'Male',
    });
  });

  it('should add and remove body-fixed-viewport to body when did mount and unmount', function () {
    const pinboard = {
      title: 'This is pinboard title',
      description: 'This is pinboard description',
    };

    const wrapper = mount(
      <Provider store={ createStore(pinboard) }>
        <MemoryRouter>
          <PinboardPage initialRequested={ true } />
        </MemoryRouter>
      </Provider>
    );

    document.body.classList.contains('body-fixed-viewport').should.be.true();
    wrapper.unmount();
    document.body.classList.contains('body-fixed-viewport').should.be.false();
  });
});
