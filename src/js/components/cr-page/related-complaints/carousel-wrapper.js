import PropTypes from 'prop-types';
import React, { Component } from 'react';
import cx from 'classnames';

import Carousel from 'components/common/carousel';
import ComplaintCard, { itemWidth } from './complaint-card';

import styles from './carousel-wrapper.sass';


export default class CarouselWrapper extends Component {
  componentDidMount() {
    const { crid, distance, match, fetchRelatedComplaints } = this.props;

    fetchRelatedComplaints(crid, { match, distance });
  }

  componentDidUpdate(prevProps) {
    const { crid, distance, match, fetchRelatedComplaints } = this.props;

    if (prevProps.distance !== distance) {
      fetchRelatedComplaints(crid, { match, distance });
      this.carousel && this.carousel.slideTo(0);
    }
  }

  loadMore = () => {
    const { crid, nextParams, fetchRelatedComplaints } = this.props;
    fetchRelatedComplaints(crid, nextParams);
  };

  render() {
    const { count, cards, title, hasMore, match, crid, addOrRemoveItemInPinboard } = this.props;

    return (
      <div className={ cx(styles.carouselWrapper, `test--related-by-${match}-carousel`) }>
        <div className='carousel-wrapper-header'>
          <span className='carousel-wrapper-count'>{ count } </span>
          <span className='carousel-wrapper-title'>{ title }</span>
        </div>
        <Carousel
          ref={ carousel => this.carousel = carousel }
          loadMore={ this.loadMore }
          hasMore={ hasMore }
          childWidth={ itemWidth }
          arrowClassName={ styles.carouselArrow }
        >
          {
            cards.map(card => (
              <ComplaintCard
                key={ card.crid }
                match={ match }
                sourceCRID={ crid }
                addOrRemoveItemInPinboard={ addOrRemoveItemInPinboard }
                { ...card }
              />
            ))
          }
        </Carousel>
      </div>
    );
  }
}

CarouselWrapper.propTypes = {
  cards: PropTypes.array,
  count: PropTypes.number,
  hasMore: PropTypes.bool,
  nextParams: PropTypes.object,
  title: PropTypes.string,
  crid: PropTypes.string,
  distance: PropTypes.string,
  match: PropTypes.string,
  fetchRelatedComplaints: PropTypes.func,
  addOrRemoveItemInPinboard: PropTypes.func,
};

CarouselWrapper.defaultProps = {
  cards: [],
  fetchRelatedComplaints: () => {},
};
