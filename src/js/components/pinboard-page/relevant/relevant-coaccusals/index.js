import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { noop } from 'lodash';

import { RelevantCoaccusalCardWithUndo as RelevantCoaccusalCard } from './relevant-coaccusal-card';
import RelevantInfiniteCarousel from 'components/pinboard-page/relevant/common/relevant-infinite-carousel';


export default class RelevantCoaccusals extends Component {
  loadMore = () => {
    const { pinboardId, nextParams, fetchPinboardRelevantCoaccusals } = this.props;
    fetchPinboardRelevantCoaccusals(pinboardId, nextParams);
  };

  render() {
    const { coaccusals, hasMore, addItemInPinboardPage, requesting, focusItem } = this.props;
    return (
      <RelevantInfiniteCarousel
        title='COACCUSALS'
        childWidth={ 148 }
        hasMore={ hasMore }
        loadMore={ this.loadMore }
        className='relevant-coaccusals'
        requesting={ requesting }
      >
        {
          coaccusals.map(coaccusal =>
            <div className='test--coaccusal-card-wrapper' key={ coaccusal.id } style={ { width: '148px' } }>
              <RelevantCoaccusalCard
                { ...coaccusal }
                addItemInPinboardPage={ addItemInPinboardPage }
                focusItem={ focusItem }
              />
            </div>
          )
        }
      </RelevantInfiniteCarousel>
    );
  }
}

RelevantCoaccusals.propTypes = {
  coaccusals: PropTypes.arrayOf(PropTypes.object),
  nextParams: PropTypes.object,
  fetchPinboardRelevantCoaccusals: PropTypes.func,
  addItemInPinboardPage: PropTypes.func,
  hasMore: PropTypes.bool,
  pinboardId: PropTypes.string,
  requesting: PropTypes.bool,
  focusItem: PropTypes.func,
};

RelevantCoaccusals.defaultProps = {
  coaccusals: [],
  focusItem: noop,
};
