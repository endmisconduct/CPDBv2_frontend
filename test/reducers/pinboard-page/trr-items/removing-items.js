import should from 'should';

import removingItemsReducer from 'reducers/pinboard-page/trr-items/removing-items';
import * as constants from 'utils/constants';


describe('trrItems > removingItemsReducer', function () {
  it('should have initial state', function () {
    should(removingItemsReducer(undefined, {})).eql([]);
  });

  it('should handle REMOVE_ITEM_FROM_PINBOARD_STATE', function () {
    removingItemsReducer(
      ['001'],
      {
        type: constants.REMOVE_ITEM_FROM_PINBOARD_STATE,
        payload: {
          type: 'TRR',
          id: '002',
        },
      }
    ).should.deepEqual(['001', '002']);

    removingItemsReducer(
      ['001'],
      {
        type: constants.REMOVE_ITEM_FROM_PINBOARD_STATE,
        payload: {
          type: 'ANOTHER',
          id: '002',
        },
      }
    ).should.deepEqual(['001']);
  });

  it('should handle COMPLETE_REMOVE_ITEM_FROM_PINBOARD', function () {
    removingItemsReducer(
      ['001'],
      {
        type: constants.COMPLETE_REMOVE_ITEM_FROM_PINBOARD,
        payload: {
          type: 'TRR',
          id: '001',
        },
      }
    ).should.deepEqual([]);

    removingItemsReducer(
      ['001'],
      {
        type: constants.COMPLETE_REMOVE_ITEM_FROM_PINBOARD,
        payload: {
          type: 'ANOTHER',
          id: '001',
        },
      }
    ).should.deepEqual(['001']);
  });

  it('should handle ADD_ITEM_TO_PINBOARD_STATE', function () {
    removingItemsReducer(
      ['001'],
      {
        type: constants.ADD_ITEM_TO_PINBOARD_STATE,
        payload: {
          type: 'TRR',
          id: '001',
        },
      }
    ).should.deepEqual([]);

    removingItemsReducer(
      ['001'],
      {
        type: constants.ADD_ITEM_TO_PINBOARD_STATE,
        payload: {
          type: 'ANOTHER',
          id: '001',
        },
      }
    ).should.deepEqual(['001']);
  });

  it('should handle LOCATION_CHANGE', function () {
    removingItemsReducer(
      ['001, 002'],
      {
        type: constants.LOCATION_CHANGE,
      }
    ).should.eql([]);
  });
});
