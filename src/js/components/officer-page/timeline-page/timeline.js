import React, { PropTypes, Component } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { map, size } from 'lodash';

import TimelineItem from './timeline-item';
import SmoothScroller from './smooth-scroller';
import { wrapperStyle } from './timeline.style';


export default class Timeline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItemTop: 0,
      flashItemIndex: 0
    };
    this.handleItemSelected = this.handleItemSelected.bind(this);
  }

  getChildContext() {
    const { openBottomSheetWithComplaint } = this.props;
    return { openBottomSheetWithComplaint };
  }

  componentWillReceiveProps(nextProps) {
    const {
      sortParams, fetchTimelineFullItems, selectedItemIndex,
      fetchTimelineItemsWhenIndexOutOfBound, items, officerId,
      fetchMinimap
    } = this.props;
    if (nextProps.sortParams !== sortParams) {
      fetchTimelineFullItems(nextProps.officerId, { ...nextProps.sortParams, ...nextProps.filters });
      fetchMinimap(nextProps.officerId, nextProps.filters);
    }

    if (nextProps.selectedItemIndex !== selectedItemIndex) {
      fetchTimelineItemsWhenIndexOutOfBound(
        size(items), nextProps.selectedItemIndex,
        officerId,
        { ...sortParams, ...nextProps.filters });
      setTimeout(() => this.setState({ flashItemIndex: nextProps.selectedItemIndex }), 500);
    }
  }

  handleItemSelected(itemTop) {
    this.setState({ selectedItemTop: itemTop });
  }

  render() {
    const {
      items, fetchTimelineItems, nextParams, hasMore, sortParams, selectedItemIndex, hoveredItemIndex,
      officerId, hoverTimelineItem, selectTimelineItem, filters
    } = this.props;
    const { selectedItemTop, flashItemIndex } = this.state;
    return (
      <SmoothScroller style={ wrapperStyle } selectedItemTop={ selectedItemTop }>
        <InfiniteScroll
          loadMore={ () => hasMore
            ? fetchTimelineItems(officerId, { ...sortParams, ...nextParams, ...filters }) : null }
          hasMore={ hasMore }
          useWindow={ false }>
          { map(items, (item, ind) => (
            <TimelineItem item={ item } key={ ind } selected={ ind === selectedItemIndex }
              minimapItemHovered={ ind === hoveredItemIndex } officerId={ officerId }
              onSelected={ this.handleItemSelected } flash={ ind === flashItemIndex }
              onHover={ (hovered) => hoverTimelineItem(hovered ? ind : null) }
              onClick={ () => selectTimelineItem(ind) }/>
          )) }
        </InfiniteScroll>
      </SmoothScroller>
    );
  }
}

Timeline.propTypes = {
  items: PropTypes.array,
  fetchTimelineItems: PropTypes.func,
  fetchTimelineFullItems: PropTypes.func,
  nextParams: PropTypes.object,
  sortParams: PropTypes.object,
  hasMore: PropTypes.bool,
  selectedItemIndex: PropTypes.number,
  hoveredItemIndex: PropTypes.number,
  officerId: PropTypes.number,
  fetchTimelineItemsWhenIndexOutOfBound: PropTypes.func,
  openBottomSheetWithComplaint: PropTypes.func,
  hoverTimelineItem: PropTypes.func,
  selectTimelineItem: PropTypes.func,
  urlParams: PropTypes.object,
  filters: PropTypes.object,
  changeTimelineFilters: PropTypes.func,
  fetchMinimap: PropTypes.func
};

Timeline.defaultProps = {
  fetchTimelineItems: () => {},
  fetchTimelineFullItems: () => {},
  fetchMinimap: () => {},
  changeTimelineFilters: () => {}
};

Timeline.childContextTypes = {
  openBottomSheetWithComplaint: PropTypes.func
};
