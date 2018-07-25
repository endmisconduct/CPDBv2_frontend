'use strict';

require('should');

import crPage from './page-objects/cr-page';


describe('Popup', function () {
  beforeEach(function () {
    crPage.open();
  });

  it('should appear when clicking on the button', function () {
    crPage.accusedOfficers.popupButton.click();
    crPage.accusedOfficers.popup.waitForVisible();
    crPage.accusedOfficers.popupTitle.getText().should.equal('Accused Officer');
    crPage.accusedOfficers.popupText.getText().should.equal('Some accused officer explanation');
  });

  it('should close when clicking outside', function () {
    crPage.accusedOfficers.popupButton.click();
    crPage.accusedOfficers.popup.waitForVisible();
    browser.element('body').click();
    crPage.accusedOfficers.popup.waitForVisible(1000, true);
  });

  it('should not close when clicking inside', function () {
    crPage.accusedOfficers.popupButton.click();
    crPage.accusedOfficers.popup.waitForVisible();
    crPage.accusedOfficers.popup.click();
    crPage.accusedOfficers.popup.waitForVisible();
  });

  it('should close itself only when clicking on its close button', function () {
    crPage.policeWitness.popupButton.click();
    crPage.policeWitness.popup.waitForVisible();
    crPage.investigator.popupButton.click();
    crPage.investigator.popup.waitForVisible();
    crPage.policeWitness.popupCloseButton.click();
    crPage.policeWitness.popup.waitForVisible(1000, true);
    crPage.investigator.popup.waitForVisible();
  });
});