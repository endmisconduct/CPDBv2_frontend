import 'polyfill';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import Mousetrap from 'mousetrap';
import React from 'react';
import { spy, stub } from 'sinon';
import { ToastContainer } from 'react-toastify';
import { MemoryRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { createMemoryHistory } from 'history';

import config from 'config';
import App from 'components/app';
import RootReducer from 'reducers/root-reducer';
import OfficerPageContainer from 'containers/officer-page';


describe('App component', function () {
  const history = createMemoryHistory();
  const store = createStore(RootReducer(history));
  const location = { pathname: '/', search: '/', action: 'POP' };

  function ChildComponent(props) {
    return <div/>;
  }

  it('should toggle edit mode when hit esc', function () {
    const toggleEditMode = spy();

    mount(
      <Provider store={ store }>
        <MemoryRouter>
          <App
            toggleEditMode={ toggleEditMode }
            location={ location }
          >
            <ChildComponent/>
          </App>
        </MemoryRouter>
      </Provider>
    );

    Mousetrap.trigger('esc');

    toggleEditMode.should.be.calledWith('/');
  });

  context('press any key and not in search page', function () {
    beforeEach(function () {
      this.oldTrigger = Mousetrap.prototype.trigger;
      // Override Mousetrap.trigger to call callback with custom event object
      Mousetrap.prototype.trigger = function (keys, action, event) {
        var self = this;
        if (self._directMap[keys + ':' + action]) {
          self._directMap[keys + ':' + action](event || {}, keys);
        }
        return self;
      };
    });

    afterEach(function () {
      Mousetrap.prototype.trigger = this.oldTrigger;
    });

    it('should toggle search mode and change search query when ', function () {
      const toggleSearchMode = spy();
      const changeSearchQuery = spy();
      const preventDefault = spy();
      mount(
        <Provider store={ store }>
          <MemoryRouter>
            <App
              toggleSearchMode={ toggleSearchMode }
              changeSearchQuery={ changeSearchQuery }
              location={ location }
            >
              <ChildComponent/>
            </App>
          </MemoryRouter>
        </Provider>
      );

      Mousetrap.trigger('a', undefined, { preventDefault });

      toggleSearchMode.calledOnce.should.be.true();
      changeSearchQuery.calledOnce.should.be.true();
      // preventDefault.should.be.calledOnce();
      changeSearchQuery.should.be.calledWith('a');
    });
  });

  it('should not toggle search mode and change search query when press any key and be in search page', function () {
    const toggleSearchMode = spy();
    const changeSearchQuery = spy();
    const location = { pathname: '/search/', search: '/', action: 'POP' };

    mount(
      <Provider store={ store }>
        <MemoryRouter>
          <App
            toggleSearchMode={ toggleSearchMode }
            changeSearchQuery={ changeSearchQuery }
            location={ location }
          >
            <ChildComponent/>
          </App>
        </MemoryRouter>
      </Provider>
    );

    Mousetrap.trigger('a');
    toggleSearchMode.called.should.be.false();
    changeSearchQuery.called.should.be.false();
  });

  it('should render ToastContainer', function () {
    const wrapper = mount(
      <Provider store={ store }>
        <MemoryRouter>
          <App location={ location }>
            <ChildComponent/>
          </App>
        </MemoryRouter>
      </Provider>
    );

    const toastContainer = wrapper.find(ToastContainer);
    toastContainer.prop('pauseOnFocusLoss').should.be.false();
    toastContainer.prop('closeButton').should.be.false();
    toastContainer.prop('hideProgressBar').should.be.true();
    toastContainer.prop('autoClose').should.equal(3000);
    toastContainer.prop('className').should.equal('landing');
  });

  context('enablePinboardFeature is false', function () {
    beforeEach(function () {
      stub(config.enableFeatures, 'pinboard').value(false);
    });

    it('should add pinboard-disabled class name', function () {
      const wrapper = mount(
        <Provider store={ store }>
          <MemoryRouter>
            <App location={ location }>
              <OfficerPageContainer />
            </App>
          </MemoryRouter>
        </Provider>
      );

      const app = wrapper.find(App);
      app.getDOMNode().className.should.containEql('pinboard-disabled');
    });
  });

  context('enablePinboardFeature is true', function () {
    beforeEach(function () {
      stub(config.enableFeatures, 'pinboard').value(true);
    });

    it('should add pinboard-disabled class name', function () {
      const wrapper = mount(
        <Provider store={ store }>
          <MemoryRouter>
            <App location={ location }>
              <ChildComponent/>
            </App>
          </MemoryRouter>
        </Provider>
      );

      const app = wrapper.find(App);
      app.getDOMNode().className.should.not.containEql('pinboard-disabled');
    });
  });
});
