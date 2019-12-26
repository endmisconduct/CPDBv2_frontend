import React from 'react';
import { shallow, mount } from 'enzyme';
import { browserHistory, Router, Route, createMemoryHistory } from 'react-router';
import MockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { Promise } from 'es6-promise';
import { spy, stub } from 'sinon';

import PinboardItem from 'components/pinboard-page/pinboards/pinboard-item';


describe('PinboardItem component', function () {
  const pinboard = {
    id: '1',
    title: 'Pinboard Title',
    createdAt: 'Sep 12, 2019',
    url: '/pinboard/1/pinboard-title/',
  };

  beforeEach(function () {
    this.browserHistoryPush = stub(browserHistory, 'push');
  });

  afterEach(function () {
    this.browserHistoryPush.restore();
  });

  it('should render correctly', function () {
    const wrapper = shallow(
      <PinboardItem pinboard={ pinboard } />
    );

    wrapper.find('.pinboard-title').text().should.equal('Pinboard Title');
    wrapper.find('.pinboard-created-at').text().should.equal('Created Sep 12, 2019');
  });

  it('should render duplicate-pinboard-btn', function (done) {
    const duplicatePinboardStub = stub().usingPromise(Promise).resolves({
      payload: {
        id: '5cd06f2b',
        title: 'Pinboard title',
      },
    });
    const handleCloseSpy = spy();
    const store = MockStore()({
      pinboardPage: {
        pinboard: {
          saving: false,
        },
      },
    });
    const pinboardItem = () => (
      <Provider store={ store }>
        <PinboardItem
          isShown={ true }
          pinboard={ pinboard }
          duplicatePinboard={ duplicatePinboardStub }
          handleClose={ handleCloseSpy }
        />
      </Provider>
    );

    const wrapper = mount(
      <Router history={ createMemoryHistory() }>
        <Route path='/' component={ pinboardItem } />
      </Router>
    );

    const duplicatePinboardBtn = wrapper.find('.duplicate-pinboard-btn');
    duplicatePinboardBtn.simulate('click');
    duplicatePinboardStub.should.be.called();

    setTimeout(() => {
      handleCloseSpy.should.be.called();
      this.browserHistoryPush.should.be.calledWith('/pinboard/5cd06f2b/pinboard-title/');
      done();
    }, 50);
  });

  it('should show pinboard detail page when clicking on pinboard item', function () {
    const handleCloseSpy = spy();
    const wrapper = shallow(
      <PinboardItem
        pinboard={ pinboard }
        handleClose={ handleCloseSpy }
      />,
    );

    wrapper.simulate('click');
    handleCloseSpy.should.be.called();

    this.browserHistoryPush.should.be.calledWith('/pinboard/1/pinboard-title/');
  });
});