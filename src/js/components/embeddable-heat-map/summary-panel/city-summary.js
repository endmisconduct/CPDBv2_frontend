import PropTypes from 'prop-types';
import React from 'react';
import { map } from 'lodash';

import config from 'config';
import { categoryUrl } from 'utils/v1-url';
import {
  wrapperStyle,
  headerStyle,
  allegationDisciplineLinkStyle,
  allegationDisciplineStyle,
  allegationTextStyle,
  disciplineTextStyle,
  mostCommonComplaintStyle,
  categoryStyle,
  categoryNameStyle,
  rightArrowStyle,
  categoryTextWrapper,
  clickReceiver,
  allegationDisciplineCountStyle,
} from './city-summary.style';
import OutboundLink from 'components/common/outbound-link';


export default function CitySummary(props) {
  const { citySummary, isActive, onClick } = props;
  const { startYear, endYear, allegationCount, disciplinePercentage, mostCommonComplaints } = citySummary;

  return (
    <div style={ wrapperStyle(isActive) } className='link--transition test--city-summary'>
      {
        isActive ?
          null :
          <div style={ clickReceiver } onClick={ onClick } />
      }
      <div style={ headerStyle } className='test--city-summary-header'>
        CHICAGO{ startYear ? ` ${startYear} - ${endYear}` : '' }
      </div>
      <OutboundLink href={ config.v1Url } style={ allegationDisciplineLinkStyle }>
        <div style={ allegationDisciplineStyle } className='test--allegation-discipline-count'>
          <div style={ allegationDisciplineCountStyle }>
            <div style={ allegationTextStyle }>
              {
                allegationCount ?
                  `${allegationCount.toLocaleString()} allegations` :
                  null
              }
            </div>
            <div style={ disciplineTextStyle }>
              {
                disciplinePercentage ?
                  `${ disciplinePercentage }% disciplined` :
                  null
              }
            </div>
          </div>
          <div style={ rightArrowStyle } />
        </div>
      </OutboundLink>
      <div>
        <div style={ mostCommonComplaintStyle }>MOST COMMON COMPLAINTS</div>
        <div className='test--most-common-complaints'>
          {
            map(mostCommonComplaints, ({ name, count }, index) => (
              <OutboundLink
                className='test--complaint-category'
                href={ isActive ? categoryUrl(name) : null }
                key={ index }
                style={ categoryStyle(index === mostCommonComplaints.length - 1) }>
                <div style={ categoryTextWrapper }>
                  <div style={ categoryNameStyle }>{ name }</div>
                  <div>{ count.toLocaleString() } allegations</div>
                </div>
                <div style={ rightArrowStyle } />
              </OutboundLink>
            ))
          }
        </div>
      </div>
    </div>
  );
}

CitySummary.propTypes = {
  citySummary: PropTypes.object,
  onClick: PropTypes.func,
  isActive: PropTypes.bool,
};

CitySummary.defaultProps = {
  citySummary: {},
};
