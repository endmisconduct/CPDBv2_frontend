import React from 'react';
import {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  scryRenderedDOMComponentsWithClass,
} from 'react-addons-test-utils';

import HistoricBadges from 'components/officer-page/summary-section/historic-badges';
import { unmountComponentSuppressError } from 'utils/test';


describe('YearOld', function () {
  let instance;

  afterEach(function () {
    unmountComponentSuppressError(instance);
  });

  it('should not render if data is empty', function () {
    instance = renderIntoDocument(<HistoricBadges historicBadges={ [] }/>);
    scryRenderedDOMComponentsWithClass(instance, 'test--historic-badges').should.have.length(0);
  });

  it('should be renderable with correct information', function () {
    instance = renderIntoDocument(<HistoricBadges historicBadges={ ['1', '2'] }/>);
    const dom = findRenderedDOMComponentWithClass(instance, 'test--historic-badges');
    dom.textContent.should.eql('Historic: 1, 2');
  });
});