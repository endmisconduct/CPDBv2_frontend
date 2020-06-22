import React from 'react';
import { mount } from 'enzyme';

import Widget from 'components/common/pinboard/widgets/widget';


describe('Widget component', function () {
  context('isVisualization is true', function () {
    it('should render correctly', function () {
      const wrapper = mount(
        <Widget isVisualization={ true } widgetTitle='SOCIAL GRAPH'>
          <div className='children' />
        </Widget>
      );
      const widgetTitle = wrapper.find('.widget-title');

      widgetTitle.text().should.equal('SOCIAL GRAPH');
      widgetTitle.prop('className').should.containEql('visualization-title');
      wrapper.find('.children').exists().should.be.true();
    });
  });

  context('isVisualization is false', function () {
    it('should render correctly', function () {
      const wrapper = mount(
        <Widget isVisualization={ false } widgetTitle='GEOGRAPHIC MAP'>
          <div className='children' />
        </Widget>
      );
      const widgetTitle = wrapper.find('.widget-title');

      widgetTitle.text().should.equal('GEOGRAPHIC MAP');
      widgetTitle.prop('className').should.not.containEql('visualization-title');
      wrapper.find('.children').exists().should.be.true();
    });
  });
});
