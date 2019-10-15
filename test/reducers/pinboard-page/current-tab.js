import should from 'should';

import currentTab from 'reducers/pinboard-page/current-tab';
import { CHANGE_PINBOARD_TAB } from 'utils/constants';


describe('currentTab reducer', function () {
  it('should have initial state', function () {
    should(currentTab(undefined, {})).be.null();
  });

  it('should handle CHANGE_PINBOARD_TAB', function () {
    currentTab(undefined, {
      type: CHANGE_PINBOARD_TAB,
      payload: 'GEOGRAPHIC',
    }).should.eql('GEOGRAPHIC');
  });
});