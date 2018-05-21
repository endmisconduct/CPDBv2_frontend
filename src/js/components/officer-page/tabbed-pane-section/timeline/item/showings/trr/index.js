import React, { Component, PropTypes } from 'react';

import { categoryStyle, dateStyle, kindStyle, showingStyle, wrapperShowingStyle, } from './trr.style';
import Hoverable from 'components/common/higher-order/hoverable';


class Trr extends Component {
  render() {
    const { item, hasBorderBottom, baseStyles, hovering } = this.props;
    const {
      baseWrapperShowingStyle,
      baseShowingStyle,
      baseWrapperKindStyle,
      baseKindStyle,
      baseCategoryStyle,
      baseDateStyle,
    } = baseStyles;

    return (
      <span style={ { ...baseWrapperShowingStyle, ...wrapperShowingStyle(hovering) } }>
        <span style={ { ...baseShowingStyle(hasBorderBottom), ...showingStyle } }>
          <div style={ baseWrapperKindStyle }>
            <span style={ { ...baseKindStyle, ...kindStyle } } className='test--trr-item-kind'>Force</span>
          </div>
          <span
            style={ { ...baseCategoryStyle, ...categoryStyle(hovering) } }
            className='test--trr-item-category'
          >
            { item.category }
          </span>
          <span style={ { ...baseDateStyle, ...dateStyle } } className='test--trr-item-date'>{ item.date }</span>
        </span>
      </span>
    );
  }
}

Trr.propTypes = {
  item: PropTypes.object,
  hasBorderBottom: PropTypes.bool,
  baseStyles: PropTypes.object,
  hovering: PropTypes.bool,
};

export default Hoverable(Trr);