import { Promise } from 'es6-promise';
import { stub, useFakeTimers } from 'sinon';
import { browserHistory } from 'react-router';

import restoreCreateOrUpdatePinboard from 'middleware/restore-create-or-update-pinboard';
import * as constants from 'utils/constants';
import {
  createPinboard,
  updatePinboard,
  orderPinboardState,
  savePinboard,
  addItemToPinboardState,
  removeItemFromPinboardState,
  fetchPinboardSocialGraph,
  fetchPinboardGeographic,
  fetchFirstPagePinboardGeographicCrs,
  fetchFirstPagePinboardGeographicTrrs,
  fetchPinboardRelevantDocuments,
  fetchPinboardRelevantCoaccusals,
  fetchPinboardRelevantComplaints,
  performFetchPinboardRelatedData,
  updatePinboardInfoState,
  savePinboardWithoutChangingState,
  handleRemovingItemInPinboardPage,
  fetchLatestRetrievedPinboard,
  setPinboardHasPendingChanges,
} from 'actions/pinboard';
import PinboardFactory from 'utils/test/factories/pinboard';
import { Toastify } from 'utils/vendors';
import extractQuery from 'utils/extract-query';


describe('restoreCreateOrUpdatePinboard middleware', function () {
  const createStore = (pinboard, pathname='', dispatchResults='abc') => ({
    getState: () => {
      return {
        pinboardPage: {
          pinboard,
          officerItems: {
            items: [],
            removingItems: [],
            requesting: false,
          },
          crItems: {
            items: [],
            removingItems: [],
            requesting: false,
          },
          trrItems: {
            items: [],
            removingItems: [],
            requesting: false,
          },
        },
        pathname,
      };
    },
    dispatch: stub().usingPromise(Promise).resolves(dispatchResults),
  });

  it('should not dispatch any action if action is not adding or removing items', function () {
    const action = {
      type: 'other action',
    };
    const store = createStore();
    let dispatched;

    restoreCreateOrUpdatePinboard(store)(action => dispatched = action)(action);
    dispatched.should.eql(action);
    store.dispatch.called.should.be.false();
  });

  it('should handle UPDATE_PINBOARD_INFO and dispatch updatePinboardInfoState', function (done) {
    const action = {
      type: constants.UPDATE_PINBOARD_INFO,
      payload: {
        'title': 'Updated Title',
        'description': 'Updated Description',
        'unit_id': '123',
      },
    };
    const store = createStore(PinboardFactory.build());
    let dispatched;
    restoreCreateOrUpdatePinboard(store)(action => dispatched = action)(action);
    dispatched.should.eql(action);

    store.dispatch.should.be.calledWith(updatePinboardInfoState({
      'title': 'Updated Title',
      'description': 'Updated Description',
      'unit_id': '123',
    }));

    setTimeout(
      () => {
        store.dispatch.should.be.calledWith(savePinboard());
        done();
      },
      50
    );
  });

  it('should handle ORDER_PINBOARD and dispatch orderPinboardState', function (done) {
    const action = {
      type: constants.ORDER_PINBOARD,
      payload: {
        type: 'OFFICER',
        ids: ['123', '789', '456'],
      },
    };
    const store = createStore(PinboardFactory.build());

    let dispatched;
    restoreCreateOrUpdatePinboard(store)(action => dispatched = action)(action);
    dispatched.should.eql(action);

    store.dispatch.should.be.calledWith(orderPinboardState({
      type: 'OFFICER',
      ids: ['123', '789', '456'],
    }));

    setTimeout(
      () => {
        store.dispatch.should.be.calledWith(savePinboard());
        done();
      },
      50
    );
  });

  it('should handle ADD_OR_REMOVE_ITEM_IN_PINBOARD and dispatch addItemToPinboardState', function (done) {
    const action = {
      type: constants.ADD_OR_REMOVE_ITEM_IN_PINBOARD,
      payload: {
        id: '123',
        type: 'CR',
        isPinned: false,
      },
    };
    const store = createStore(PinboardFactory.build());

    let dispatched;
    restoreCreateOrUpdatePinboard(store)(action => dispatched = action)(action);
    dispatched.should.eql(action);

    store.dispatch.should.be.calledWith(addItemToPinboardState({
      id: '123',
      type: 'CR',
      isPinned: false,
    }));

    setTimeout(
      () => {
        store.dispatch.should.be.calledWith(savePinboard());
        done();
      },
      50
    );
  });

  it('should handle ADD_OR_REMOVE_ITEM_IN_PINBOARD and dispatch removeItemFromPinboardState', function (done) {
    const action = {
      type: constants.ADD_OR_REMOVE_ITEM_IN_PINBOARD,
      payload: {
        id: '123',
        type: 'CR',
        isPinned: true,
      },
    };
    const store = createStore(PinboardFactory.build());

    let dispatched;
    restoreCreateOrUpdatePinboard(store)(action => dispatched = action)(action);
    dispatched.should.eql(action);

    store.dispatch.should.be.calledWith(removeItemFromPinboardState({
      id: '123',
      type: 'CR',
      isPinned: true,
    }));

    setTimeout(
      () => {
        store.dispatch.should.be.calledWith(savePinboard());
        done();
      },
      50
    );
  });

  it('should handle ADD_OR_REMOVE_ITEM_IN_PINBOARD and show adding toast', function () {
    Toastify.toast.resetHistory();
    const browserHistoryPush = stub(browserHistory, 'push');

    const action = {
      type: constants.ADD_OR_REMOVE_ITEM_IN_PINBOARD,
      payload: {
        id: '123',
        type: 'CR',
        isPinned: false,
      },
    };
    const store = createStore(PinboardFactory.build({
      'id': '66ef1560',
      'title': 'Pinboard Title',
    }));

    let dispatched;
    restoreCreateOrUpdatePinboard(store)(action => dispatched = action)(action);
    dispatched.should.eql(action);

    store.dispatch.should.be.calledWith(addItemToPinboardState({
      id: '123',
      type: 'CR',
      isPinned: false,
    }));

    Toastify.toast.should.be.calledOnce();
    Toastify.toast.getCall(0).args[0].should.eql('CR added');
    Toastify.toast.getCall(0).args[1]['className'].should.eql('toast-wrapper added');
    Toastify.toast.getCall(0).args[1]['bodyClassName'].should.eql('toast-body');
    Toastify.toast.getCall(0).args[1]['transition'].should.eql(
      Toastify.cssTransition({
        enter: 'toast-enter',
        exit: 'toast-exit',
        duration: 500,
        appendPosition: true,
      }),
    );
    Toastify.toast.getCall(0).args[1]['onClick']();
    browserHistoryPush.should.be.calledWith('/pinboard/66ef1560/pinboard-title/');
    Toastify.toast.resetHistory();
    browserHistoryPush.restore();
  });

  it('should handle ADD_OR_REMOVE_ITEM_IN_PINBOARD and show removing toast', function () {
    Toastify.toast.resetHistory();
    const browserHistoryPush = stub(browserHistory, 'push');

    const action = {
      type: constants.ADD_OR_REMOVE_ITEM_IN_PINBOARD,
      payload: {
        id: '123',
        type: 'CR',
        isPinned: true,
      },
    };
    const store = createStore(PinboardFactory.build({
      'id': '66ef1560',
      'title': 'Pinboard Title',
    }));

    let dispatched;
    restoreCreateOrUpdatePinboard(store)(action => dispatched = action)(action);
    dispatched.should.eql(action);

    store.dispatch.should.be.calledWith(removeItemFromPinboardState({
      id: '123',
      type: 'CR',
      isPinned: true,
    }));

    Toastify.toast.should.be.calledOnce();
    Toastify.toast.getCall(0).args[0].should.eql('CR removed');
    Toastify.toast.getCall(0).args[1]['className'].should.eql('toast-wrapper removed');
    Toastify.toast.getCall(0).args[1]['bodyClassName'].should.eql('toast-body');
    Toastify.toast.getCall(0).args[1]['transition'].should.eql(
      Toastify.cssTransition({
        enter: 'toast-enter',
        exit: 'toast-exit',
        duration: 500,
        appendPosition: true,
      }),
    );
    Toastify.toast.getCall(0).args[1]['onClick']();
    browserHistoryPush.should.be.calledWith('/pinboard/66ef1560/pinboard-title/');
    Toastify.toast.resetHistory();
    browserHistoryPush.restore();
  });

  it('should handle ADD_ITEM_IN_PINBOARD_PAGE and dispatch addItemToPinboardState', function (done) {
    const action = {
      type: constants.ADD_ITEM_IN_PINBOARD_PAGE,
      payload: {
        id: '123',
        type: 'CR',
      },
    };
    const store = createStore(PinboardFactory.build());

    let dispatched;
    restoreCreateOrUpdatePinboard(store)(action => dispatched = action)(action);
    dispatched.should.eql(action);

    store.dispatch.should.be.calledWith(addItemToPinboardState({
      id: '123',
      type: 'CR',
    }));

    setTimeout(
      () => {
        store.dispatch.should.be.calledWith(savePinboard());
        done();
      },
      50
    );
  });

  it('should handle REMOVE_ITEM_IN_PINBOARD_PAGE and dispatch removeItemFromPinboardState', function (done) {
    const action = {
      type: constants.REMOVE_ITEM_IN_PINBOARD_PAGE,
      payload: {
        id: '123',
        type: 'CR',
      },
    };
    const store = createStore(PinboardFactory.build());

    let dispatched;
    restoreCreateOrUpdatePinboard(store)(action => dispatched = action)(action);
    dispatched.should.eql(action);

    store.dispatch.should.be.calledWith(removeItemFromPinboardState({
      id: '123',
      type: 'CR',
    }));

    setTimeout(
      () => {
        store.dispatch.should.be.calledWith(savePinboard());
        done();
      },
      50
    );
  });

  it('should handle REMOVE_ITEM_IN_PINBOARD_PAGE with API_ONLY mode', function (done) {
    const action = {
      type: constants.REMOVE_ITEM_IN_PINBOARD_PAGE,
      payload: {
        id: '123',
        type: 'CR',
        mode: constants.PINBOARD_ITEM_REMOVE_MODE.API_ONLY,
      },
    };
    const store = createStore(PinboardFactory.build());

    let dispatched;
    restoreCreateOrUpdatePinboard(store)(action => dispatched = action)(action);
    dispatched.should.eql(action);
    store.dispatch.should.be.calledWith(setPinboardHasPendingChanges(true));

    store.dispatch.should.be.calledWith(handleRemovingItemInPinboardPage({
      id: '123',
      type: 'CR',
      mode: constants.PINBOARD_ITEM_REMOVE_MODE.API_ONLY,
    }));

    setTimeout(
      () => {
        store.dispatch.should.be.calledWith(savePinboardWithoutChangingState(action.payload));
        done();
      },
      50
    );
  });

  it('should handle REMOVE_ITEM_IN_PINBOARD_PAGE with STATE_ONLY mode', function () {
    const action = {
      type: constants.REMOVE_ITEM_IN_PINBOARD_PAGE,
      payload: {
        id: '123',
        type: 'CR',
        mode: constants.PINBOARD_ITEM_REMOVE_MODE.STATE_ONLY,
      },
    };
    const store = createStore(PinboardFactory.build());

    let dispatched;
    restoreCreateOrUpdatePinboard(store)(action => dispatched = action)(action);
    dispatched.should.eql(action);

    store.dispatch.should.be.calledWith(removeItemFromPinboardState(action.payload));
  });

  it('should handle SAVE_PINBOARD_WITHOUT_CHANGING_STATE', function (done) {
    const action = {
      type: constants.SAVE_PINBOARD_WITHOUT_CHANGING_STATE,
      payload: {
        type: 'OFFICER',
        id: '123',
      },
    };
    const store = {
      getState: () => {
        return {
          pinboardPage: {
            pinboard: PinboardFactory.build({
              'id': '66ef1560',
              'officer_ids': [123, 456],
              'saving': false,
              'needRefreshData': true,
              'hasPendingChanges': true,
            }),
            officerItems: {
              items: [],
              removingItems: ['123'],
              requesting: false,
            },
            crItems: {
              items: [],
              removingItems: [],
              requesting: false,
            },
            trrItems: {
              items: [],
              removingItems: [],
              requesting: false,
            },
          },
        };
      },
      dispatch: stub().usingPromise(Promise).resolves({
        payload: {
          id: '66ef1560',
          title: '',
          description: '',
          'officer_ids': ['456'],
          crids: [],
          'trr_ids': [],
        },
      }),
    };

    let dispatched;
    restoreCreateOrUpdatePinboard(store)(action => dispatched = action)(action);
    dispatched.should.eql(action);

    store.dispatch.should.be.calledWith(updatePinboard({
      id: '66ef1560',
      title: '',
      description: '',
      officerIds: ['456'],
      crids: [],
      trrIds: [],
    }));

    setTimeout(
      () => {
        store.dispatch.should.be.calledWith(setPinboardHasPendingChanges(false));
        store.dispatch.should.be.calledWith(fetchPinboardSocialGraph('66ef1560'));
        store.dispatch.should.be.calledWith(fetchPinboardGeographic());
        store.dispatch.should.be.calledWith(fetchFirstPagePinboardGeographicCrs({ 'pinboard_id': '66ef1560' }));
        store.dispatch.should.be.calledWith(fetchFirstPagePinboardGeographicTrrs({ 'pinboard_id': '66ef1560' }));
        store.dispatch.should.be.calledWith(fetchPinboardRelevantDocuments('66ef1560'));
        store.dispatch.should.be.calledWith(fetchPinboardRelevantCoaccusals('66ef1560'));
        store.dispatch.should.be.calledWith(fetchPinboardRelevantComplaints('66ef1560'));
        store.dispatch.should.be.calledWith(performFetchPinboardRelatedData());
        done();
      },
      50
    );
  });

  describe('handling SAVE_PINBOARD', function () {
    it('should dispatch createPinboard', function (done) {
      const action = {
        type: constants.SAVE_PINBOARD,
        payload: null,
      };
      const store = createStore(PinboardFactory.build({
        'id': null,
        'officer_ids': [123, 456],
        'trr_ids': [789],
        'crids': ['abc'],
        'saving': false,
      }));

      let dispatched;
      restoreCreateOrUpdatePinboard(store)(action => dispatched = action)(action);
      dispatched.should.eql(action);
      store.dispatch.should.be.calledWith(setPinboardHasPendingChanges(true));

      store.dispatch.should.be.calledWith(createPinboard({
        id: null,
        title: '',
        description: '',
        officerIds: ['123', '456'],
        crids: ['abc'],
        trrIds: ['789'],
      }));

      setTimeout(
        () => {
          store.dispatch.should.be.calledWith(savePinboard());
          done();
        },
        50
      );
    });

    it('should dispatch updatePinboard', function (done) {
      const action = {
        type: constants.SAVE_PINBOARD,
        payload: null,
      };

      const store = createStore(PinboardFactory.build({
        'id': '66ef1560',
        'officer_ids': [123, 456],
        'saving': false,
        'hasPendingChanges': true,
      }));

      let dispatched;
      restoreCreateOrUpdatePinboard(store)(action => dispatched = action)(action);
      dispatched.should.eql(action);

      store.dispatch.should.be.calledOnce();

      store.dispatch.should.be.calledWith(updatePinboard({
        id: '66ef1560',
        title: '',
        description: '',
        officerIds: ['123', '456'],
        crids: [],
        trrIds: [],
      }));

      setTimeout(
        () => {
          store.dispatch.should.be.calledWith(savePinboard());
          done();
        },
        50
      );
    });

    it('should dispatch nothing when saving is true', function () {
      const action = {
        type: constants.SAVE_PINBOARD,
        payload: null,
      };
      const store = createStore(PinboardFactory.build({
        'id': '66ef1560',
        'officer_ids': [123, 456],
        'saving': true,
      }));

      let dispatched;
      restoreCreateOrUpdatePinboard(store)(action => dispatched = action)(action);
      dispatched.should.eql(action);

      store.dispatch.should.not.be.called();
    });

    it('should dispatch updatePinboard when not up to date', function (done) {
      const action = {
        type: constants.SAVE_PINBOARD,
        payload: PinboardFactory.build({
          'id': '66ef1560',
          'officer_ids': [123],
        }),
      };
      const store = createStore(PinboardFactory.build({
        'id': null,
        'officer_ids': [123, 456],
        'saving': false,
      }));

      let dispatched;
      restoreCreateOrUpdatePinboard(store)(action => dispatched = action)(action);
      dispatched.should.eql(action);

      store.dispatch.should.be.called();
      store.dispatch.should.be.calledWith(createPinboard({
        id: null,
        title: '',
        description: '',
        officerIds: ['123', '456'],
        crids: [],
        trrIds: [],
      }));

      setTimeout(
        () => {
          store.dispatch.should.be.calledWith(savePinboard());
          done();
        },
        50
      );
    });

    it('should stop the loop if nothing else to save', function () {
      const action = {
        type: constants.SAVE_PINBOARD,
        payload: PinboardFactory.build({
          'id': '66ef1560',
          'officer_ids': [123, 456],
        }),
      };
      const store = createStore(PinboardFactory.build({
        'id': '66ef1560',
        'officer_ids': [123, 456],
        'saving': false,
        'hasPendingChanges': true,
      }));

      let dispatched;
      restoreCreateOrUpdatePinboard(store)(action => dispatched = action)(action);
      dispatched.should.eql(action);

      store.dispatch.should.be.calledOnce();
      store.dispatch.should.be.calledWith(setPinboardHasPendingChanges(false));
    });

    it('should fetch data at end the loop when being on the pinboard page', function () {
      const action = {
        type: constants.SAVE_PINBOARD,
        payload: PinboardFactory.build({
          'id': '66ef1560',
          'officer_ids': [123, 456],
        }),
      };
      const store = createStore(
        PinboardFactory.build({
          'id': '66ef1560',
          'officer_ids': [123, 456],
          'saving': false,
          'needRefreshData': true,
          'hasPendingChanges': true,
        }),
        '/pinboard/66ef1560/'
      );

      let dispatched;
      restoreCreateOrUpdatePinboard(store)(action => dispatched = action)(action);
      dispatched.should.eql(action);
      store.dispatch.should.be.calledWith(setPinboardHasPendingChanges(false));

      store.dispatch.should.be.calledWith(fetchPinboardSocialGraph('66ef1560'));
      store.dispatch.should.be.calledWith(fetchPinboardGeographic());
      store.dispatch.should.be.calledWith(fetchFirstPagePinboardGeographicCrs({ 'pinboard_id': '66ef1560' }));
      store.dispatch.should.be.calledWith(fetchFirstPagePinboardGeographicTrrs({ 'pinboard_id': '66ef1560' }));
      store.dispatch.should.be.calledWith(fetchPinboardRelevantDocuments('66ef1560'));
      store.dispatch.should.be.calledWith(fetchPinboardRelevantCoaccusals('66ef1560'));
      store.dispatch.should.be.calledWith(fetchPinboardRelevantComplaints('66ef1560'));
      store.dispatch.should.be.calledWith(performFetchPinboardRelatedData());
    });

    it('should retry saving on failure after 1 second', function (done) {
      const action = {
        type: constants.SAVE_PINBOARD,
        payload: PinboardFactory.build({ 'id': '66ef1560' }),
      };
      const store = {
        getState: () => {
          return {
            pinboardPage: {
              pinboard: PinboardFactory.build({
                'id': '66ef1560',
                'officer_ids': [123, 456],
                'saving': false,
                'hasPendingChanges': true,
              }),
              officerItems: {
                items: [],
                removingItems: [],
                requesting: false,
              },
              crItems: {
                items: [],
                removingItems: [],
                requesting: false,
              },
              trrItems: {
                items: [],
                removingItems: [],
                requesting: false,
              },
            },
          };
        },
        dispatch: stub().usingPromise(Promise).rejects(new Error('abc')),
      };

      const realSetTimeout = setTimeout;
      const clock = useFakeTimers();

      let dispatched;
      restoreCreateOrUpdatePinboard(store)(action => dispatched = action)(action);
      dispatched.should.eql(action);

      store.dispatch.should.be.calledOnce();
      store.dispatch.should.be.calledWith(updatePinboard({
        id: '66ef1560',
        title: '',
        description: '',
        officerIds: ['123', '456'],
        crids: [],
        trrIds: [],
      }));

      realSetTimeout(
        () => {
          clock.tick(1500);

          store.dispatch.should.be.calledTwice();
          store.dispatch.should.be.calledWith(savePinboard());

          clock.restore();
          done();
        },
        50,
      );
    });

    it('should retry maximum 60 times', function (done) {
      const action = {
        type: constants.SAVE_PINBOARD,
        payload: null,
      };
      const store = {
        getState: () => {
          return {
            pinboardPage: {
              pinboard: PinboardFactory.build({
                'id': '66ef1560',
                'officer_ids': [123, 456],
                'saving': false,
                'hasPendingChanges': true,
              }),
            },
          };
        },
        dispatch: stub().usingPromise(Promise).resolves('abc'),
      };

      restoreCreateOrUpdatePinboard(store)(action => action)(action);

      const failingStore = {
        getState: () => {
          return {
            pinboardPage: {
              pinboard: PinboardFactory.build({
                'id': '66ef1560',
                'officer_ids': [123, 456],
                'saving': false,
                'hasPendingChanges': true,
              }),
            },
          };
        },
        dispatch: stub().usingPromise(Promise).rejects(new Error('abc')),
      };

      const realSetTimeout = setTimeout;
      const clock = useFakeTimers();

      function repeatSave(count) {
        if (count < 61) {
          restoreCreateOrUpdatePinboard(failingStore)(action => action)(action);
          realSetTimeout(
            () => {
              clock.tick(2000);
              repeatSave(count + 1);
            },
            10
          );
        } else {
          failingStore.dispatch.callCount.should.equal(121);
          clock.restore();
          done();
        }
      }

      repeatSave(0);
    });
  });

  it('should handle @@router/LOCATION_CHANGE and dispatch createPinboard', function (done) {
    const action = {
      type: '@@router/LOCATION_CHANGE',
      payload: {
        pathname: 'pinboard/abcd1234/',
      },
    };
    const store = createStore(PinboardFactory.build({
      'id': null,
      'officer_ids': [123, 456],
      'saving': true,
    }));

    let dispatched;
    restoreCreateOrUpdatePinboard(store)(action => dispatched = action)(action);
    dispatched.should.eql(action);

    store.dispatch.should.be.calledWith(createPinboard({
      id: null,
      title: '',
      description: '',
      officerIds: ['123', '456'],
      crids: [],
      trrIds: [],
    }));

    setTimeout(
      () => {
        store.dispatch.should.be.calledWith(savePinboard());
        done();
      },
      50
    );
  });

  it('should handle @@router/LOCATION_CHANGE and dispatch updatePinboard', function (done) {
    const action = {
      type: '@@router/LOCATION_CHANGE',
      payload: {
        pathname: 'pinboard/abcd1234/',
      },
    };
    const store = createStore(PinboardFactory.build({
      'id': '66ef1560',
      'officer_ids': [123, 456],
      'saving': true,
    }));

    let dispatched;
    restoreCreateOrUpdatePinboard(store)(action => dispatched = action)(action);
    dispatched.should.eql(action);

    store.dispatch.should.be.calledWith(updatePinboard({
      id: '66ef1560',
      title: '',
      description: '',
      officerIds: ['123', '456'],
      crids: [],
      trrIds: [],
    }));

    setTimeout(
      () => {
        store.dispatch.should.be.calledWith(savePinboard());
        done();
      },
      50
    );
  });

  it('should handle @@router/LOCATION_CHANGE and do nothing if not saving and isPinboardRestored', function () {
    const action = {
      type: '@@router/LOCATION_CHANGE',
      payload: {
        pathname: '/search/',
      },
    };
    const store = createStore(PinboardFactory.build({
      'id': '66ef1560',
      'officer_ids': [123, 456],
      'saving': false,
      isPinboardRestored: true,
    }));

    let dispatched;
    restoreCreateOrUpdatePinboard(store)(action => dispatched = action)(action);
    dispatched.should.eql(action);

    store.dispatch.should.not.be.called();
  });

  describe('Session creator', function () {
    beforeEach(function () {
      Toastify.toast.resetHistory();
    });

    const testCreatePinboardWith = (action, pathname, done) => {
      const store = createStore(
        PinboardFactory.build({
          'id': null,
          'officer_ids': [],
          'saving': false,
        }),
        pathname,
        {
          payload: {
            id: 'abc123',
            'officer_ids': [1, 3, 4, 5],
            crids: ['1053673'],
            'trr_ids': [1, 2],
          },
        },
      );

      let dispatched;
      restoreCreateOrUpdatePinboard(store)(action => dispatched = action)(action);
      dispatched.should.eql(action);

      store.dispatch.should.be.calledWith(createPinboard({
        officerIds: [1, 3, 4, 5],
        crids: ['1053673'],
        trrIds: [1, 2],
      }));

      setTimeout(
        () => {
          Toastify.toast.should.not.be.called();
          Toastify.toast.resetHistory();
          done();
        },
        50,
      );
    };

    it('should handle @@router/LOCATION_CHANGE with query to create pinboard but may not show toasts', function (done) {
      const pathname = '/pinboard/?officer-ids=1,3,4,5&crids=1053673&trr-ids=1,2';
      const action = {
        type: '@@router/LOCATION_CHANGE',
        payload: {
          query: {
            'officer-ids': '1,3,4,5',
            crids: '1053673',
            'trr-ids': '1,2',
          },
          pathname,
        },
      };
      testCreatePinboardWith(action, pathname, done);
    });

    it('should accept params without s', function (done) {
      const pathname = '/pinboard/?officer-id=1,3,4,5&crid=1053673&trr-id=1,2';
      const action = {
        type: '@@router/LOCATION_CHANGE',
        payload: {
          query: {
            'officer-id': '1,3,4,5',
            crid: '1053673',
            'trr-id': '1,2',
          },
          pathname,
        },
      };
      testCreatePinboardWith(action, pathname, done);
    });

    it('should accept params with under score', function (done) {
      const pathname = '/pinboard/?officer_ids=1,3,4,5&crid=1053673&trr_ids=1,2';
      const action = {
        type: '@@router/LOCATION_CHANGE',
        payload: {
          query: {
            'officer_ids': '1,3,4,5',
            crid: '1053673',
            'trr_ids': '1,2',
          },
          pathname,
        },
      };
      testCreatePinboardWith(action, pathname, done);
    });

    it('should accept camelCase params', function (done) {
      const pathname = '/pinboard/?officerId=1,3,4,5&crids=1053673&trrIds=1,2';
      const action = {
        type: '@@router/LOCATION_CHANGE',
        payload: {
          query: {
            'officerId': '1,3,4,5',
            crids: '1053673',
            'trrIds': '1,2',
          },
          pathname,
        },
      };
      testCreatePinboardWith(action, pathname, done);
    });

    it('should accept params with some capitalizing mistakes', function (done) {
      const pathname = '/pinboard/?officeR-ids=1,3,4,5&CRids=1053673&tRRIds=1,2';
      const action = {
        type: '@@router/LOCATION_CHANGE',
        payload: {
          query: {
            'officeR-ids': '1,3,4,5',
            CRids: '1053673',
            'tRRIds': '1,2',
          },
          pathname,
        },
      };
      testCreatePinboardWith(action, pathname, done);
    });

    it('should handle @@router/LOCATION_CHANGE to create pinboard and show toast', function (done) {
      Toastify.toast.resetHistory();
      Toastify.toast.should.not.be.called();

      const action = {
        type: '@@router/LOCATION_CHANGE',
        payload: {
          query: {
            'officer-ids': '1',
            crids: 'xyz567,1053673,tyu890',
            'trr-ids': '3,99',
          },
          pathname: '/pinboard/?officer-ids=1&crids=xyz567,1053673,tyu890&trr-ids=3,99',
        },
      };
      const store = createStore(
        PinboardFactory.build({
          'id': null,
          'saving': false,
        }),
        '/pinboard/?officer-id=1&crids=xyz567,1053673,tyu890&trr-ids=3,99',
        {
          payload: {
            id: 'abc123',
            'officer_ids': [1],
            crids: ['1053673'],
            'trr_ids': [],
            'not_found_items': {
              'officer_ids': [],
              crids: ['xyz567', 'tyu890'],
              'trr_ids': [3, 99],
            },
          },
        },
      );

      let dispatched;
      restoreCreateOrUpdatePinboard(store)(action => dispatched = action)(action);
      dispatched.should.eql(action);

      store.dispatch.should.be.calledWith(createPinboard({
        officerIds: [1],
        crids: ['xyz567', '1053673', 'tyu890'],
        trrIds: [3, 99],
      }));

      setTimeout(
        () => {
          Toastify.toast.should.be.calledTwice();
          Toastify.toast.should.be.calledWith(
            '1 out of 3 allegations were added to this pinboard. ' +
            '2 out of 3 allegation IDs could not be recognized (xyz567, tyu890).',
          );
          Toastify.toast.should.be.calledWith('2 out of 2 TRR IDs could not be recognized (3, 99).');

          Toastify.toast.resetHistory();
          done();
        },
        50,
      );
    });

    it('should skip invalid param and show invalid param message', function (done) {
      const pathname = '/pinboard/?officer-ids=1&crids=xyz567,1053673,tyu890&trr-ids=3,99&invalid-param=1,2';
      const action = {
        type: '@@router/LOCATION_CHANGE',
        payload: {
          query: {
            'officer-ids': '1',
            crids: 'xyz567,1053673,tyu890',
            'trr-ids': '3,99',
            'invalid-param': '1,2',
          },
          pathname,
        },
      };
      const store = createStore(
        PinboardFactory.build({
          'id': null,
          'saving': false,
        }),
        pathname,
        {
          payload: {
            id: 'abc123',
            'officer_ids': [1],
            crids: ['1053673'],
            'trr_ids': [],
            'not_found_items': {
              'officer_ids': [],
              crids: ['xyz567', 'tyu890'],
              'trr_ids': [3, 99],
            },
          },
        },
      );

      let dispatched;
      restoreCreateOrUpdatePinboard(store)(action => dispatched = action)(action);
      dispatched.should.eql(action);

      store.dispatch.should.be.calledWith(createPinboard({
        officerIds: [1],
        crids: ['xyz567', '1053673', 'tyu890'],
        trrIds: [3, 99],
      }));

      setTimeout(
        () => {
          Toastify.toast.should.be.calledThrice();
          Toastify.toast.should.be.calledWith('invalid-param is not recognized.');
          Toastify.toast.should.be.calledWith(
            '1 out of 3 allegations were added to this pinboard. ' +
            '2 out of 3 allegation IDs could not be recognized (xyz567, tyu890).',
          );
          Toastify.toast.should.be.calledWith('2 out of 2 TRR IDs could not be recognized (3, 99).');

          Toastify.toast.resetHistory();
          done();
        },
        50,
      );
    });

    it('should skip invalid params and show invalid params message', function (done) {
      const pathname = '/pinboard/?officer-ids=1&crids=xyz567,1053673,tyu890&invalid-param-a=1,2&invalid-param-b=2,1';
      const action = {
        type: '@@router/LOCATION_CHANGE',
        payload: {
          query: {
            'officer-ids': '1',
            crids: 'xyz567,1053673,tyu890',
            'invalid-param-a': '1,2',
            'invalid-param-b': '2,1',
          },
          pathname,
        },
      };
      const store = createStore(
        PinboardFactory.build({
          'id': null,
          'saving': false,
        }),
        pathname,
        {
          payload: {
            id: 'abc123',
            'officer_ids': [1],
            crids: ['1053673'],
            'trr_ids': [],
            'not_found_items': {
              'officer_ids': [],
              crids: ['xyz567', 'tyu890'],
            },
          },
        },
      );

      let dispatched;
      restoreCreateOrUpdatePinboard(store)(action => dispatched = action)(action);
      dispatched.should.eql(action);

      store.dispatch.should.be.calledWith(createPinboard({
        officerIds: [1],
        crids: ['xyz567', '1053673', 'tyu890'],
        trrIds: [],
      }));

      setTimeout(
        () => {
          Toastify.toast.should.be.calledTwice();
          Toastify.toast.should.be.calledWith('invalid-param-a, invalid-param-b are not recognized.');
          Toastify.toast.should.be.calledWith(
            '1 out of 3 allegations were added to this pinboard. ' +
            '2 out of 3 allegation IDs could not be recognized (xyz567, tyu890).',
          );
          Toastify.toast.resetHistory();
          done();
        },
        50,
      );
    });

    it('should fetchLatestRetrievedPinboard and show redirect message if no valid params', function (done) {
      const pathname = '/pinboard/?invalid-param-a=1,2&invalid-param-a=2,1';
      const action = {
        type: '@@router/LOCATION_CHANGE',
        payload: {
          query: {
            'invalid-param-a': '1,2',
            'invalid-param-b': '2,1',
          },
          pathname,
        },
      };
      const store = createStore(
        PinboardFactory.build({
          'id': null,
          'saving': false,
        }),
        pathname,
        {
          payload: {
            id: 'abc123',
            'officer_ids': [],
            crids: [],
            'trr_ids': [],
          },
        },
      );

      let dispatched;
      restoreCreateOrUpdatePinboard(store)(action => dispatched = action)(action);
      dispatched.should.eql(action);

      store.dispatch.should.be.calledWith(fetchLatestRetrievedPinboard({ create: true }));

      setTimeout(
        () => {
          Toastify.toast.should.be.calledTwice();
          Toastify.toast.should.be.calledWith('invalid-param-a, invalid-param-b are not recognized.');
          Toastify.toast.should.be.calledWith('Redirected to latest pinboard.');
          Toastify.toast.resetHistory();
          done();
        },
        50,
      );
    });
  });

  describe('Restore pinboard', function () {
    let store;
    const createLocationChangeAction = (pathname) => ({
      type: '@@router/LOCATION_CHANGE',
      payload: {
        pathname: pathname,
        query: extractQuery(pathname),
      },
    });
    const buildStore = () => ({
      _state: {
        pinboardPage: {
          pinboard: {
            id: 'id',
          },
        },
      },
      getState() {
        return this._state;
      },
      dispatch: stub().usingPromise(Promise).resolves('abc'),
    });

    beforeEach(() => {
      store = buildStore();
      store.dispatch.resetHistory();
      Toastify.toast.resetHistory();
    });

    it('should not dispatch if pinboard is restored', () => {
      store.getState().pinboardPage.pinboard.isPinboardRestored = true;
      const action = createLocationChangeAction('');

      let dispatched;
      restoreCreateOrUpdatePinboard(store)(action => dispatched = action)(action);
      dispatched.should.eql(action);

      store.dispatch.called.should.be.false();
    });

    it('should not dispatch if location change is pinboard detail page', () => {
      const action = createLocationChangeAction('/pinboard/5cd06f2b/');

      let dispatched;
      restoreCreateOrUpdatePinboard(store)(action => dispatched = action)(action);
      dispatched.should.eql(action);

      store.dispatch.called.should.be.false();
    });

    it('should dispatch fetchLatestRetrievedPinboard with create is false if not on no id pinboard page', () => {
      const action = createLocationChangeAction('');

      let dispatched;
      restoreCreateOrUpdatePinboard(store)(action => dispatched = action)(action);
      dispatched.should.eql(action);

      store.dispatch.calledWith(fetchLatestRetrievedPinboard({ create: false })).should.be.true();
    });

    it('should dispatch fetchLatestRetrievedPinboard with create is true if on no id pinboard page', () => {
      const action = createLocationChangeAction('/pinboard/');

      let dispatched;
      restoreCreateOrUpdatePinboard(store)(action => dispatched = action)(action);
      dispatched.should.eql(action);

      store.dispatch.calledWith(fetchLatestRetrievedPinboard({ create: true })).should.be.true();
      Toastify.toast.should.not.be.called();
    });

    it('should not dispatch fetchLatestRetrievedPinboard if there is no pinboard id but query exists', () => {
      const action = createLocationChangeAction('/pinboard/?officer-ids=1,3,4,5,0&crids=1053673&trr-ids=,0,1');

      let dispatched;
      restoreCreateOrUpdatePinboard(store)(action => dispatched = action)(action);
      dispatched.should.eql(action);

      store.dispatch.should.not.be.calledWith(fetchLatestRetrievedPinboard({ create: false }));
      store.dispatch.should.not.be.calledWith(fetchLatestRetrievedPinboard({ create: true }));
      store.dispatch.should.not.be.calledWith(fetchLatestRetrievedPinboard());
    });

    it('should fetchLatestRetrievedPinboard if there is query but not on pinboard page', () => {
      const action = createLocationChangeAction('/search/?officer-ids=1,3,4,5,0&crids=1053673&trr-ids=,0,1');

      let dispatched;
      restoreCreateOrUpdatePinboard(store)(action => dispatched = action)(action);
      dispatched.should.eql(action);

      store.dispatch.should.be.calledWith(fetchLatestRetrievedPinboard({ create: false }));
    });
  });
});
