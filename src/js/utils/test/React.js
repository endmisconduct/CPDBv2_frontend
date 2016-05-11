import { createElement } from 'react';
import { unmountComponentAtNode, findDOMNode } from 'react-dom';
import { renderIntoDocument } from 'react-addons-test-utils';
import should from 'should';
import _ from 'lodash';


should.Assertion.add('renderable', function (props) {
  let element = renderIntoDocument(createElement(this.obj, props));

  element.should.be.ok();

  unmountComponentAtNode(findDOMNode(element).parentNode);
});


should.Assertion.add('responsiveRenderable', function (props) {
  let devices = ['mobile', 'tablet', 'desktop'];

  _.each(devices, (device) => {
    let element = renderIntoDocument(createElement(this.obj, _.assign({}, props, { device: device })));
    element.should.be.ok();
    unmountComponentAtNode(findDOMNode(element).parentNode);
  });
});

should.Assertion.add('displayNothing', function () {
  should(findDOMNode(this.obj)).be.null();
});

should.Assertion.add('displaySomething', function () {
  should(findDOMNode(this.obj)).not.be.null();
});
