import React, { Component, PropTypes } from 'react';

import ResponsiveFluidWidthComponent from 'components/responsive/responsive-fluid-width-component';
import CoaccusedList from './coaccused-list';
import ExpandMotion from 'components/animation/expand-motion';
import CoaccusedDropdownButton from './coaccused-dropdown-button';
import { boxShadowStyle, headerStyle, titleStyle } from './header.style';


export default class Header extends Component {
  render() {
    const {
      crid, officerId, coaccused, openComplaintPage, displayCoaccusedDropdown, onDropDownButtonClick
    } = this.props;

    return (
      <div style={ boxShadowStyle }>
        <ResponsiveFluidWidthComponent>
          <div style={ headerStyle }>
            <span className='test--header-title' style={ titleStyle(displayCoaccusedDropdown) }>{ `CR ${crid}` }</span>
            <CoaccusedDropdownButton
              coaccused={ coaccused } officerId={ officerId }
              displayCoaccusedDropdown={ displayCoaccusedDropdown }
              onClick={ onDropDownButtonClick } />
          </div>
        </ResponsiveFluidWidthComponent>
        {
          <ExpandMotion show={ displayCoaccusedDropdown }>
            <CoaccusedList currentOfficerId={ officerId } coaccused={ coaccused }
              openComplaintPage={ openComplaintPage } crid={ crid }/>
          </ExpandMotion>
        }
      </div>
    );
  }
}

Header.propTypes = {
  crid: PropTypes.string,
  openComplaintPage: PropTypes.func,
  officerId: PropTypes.number,
  coaccused: PropTypes.array,
  displayCoaccusedDropdown: PropTypes.bool,
  onDropDownButtonClick: PropTypes.func
};
