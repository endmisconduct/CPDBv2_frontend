import React, { PropTypes, Component } from 'react';
import { noop } from 'lodash';

import styles from './relevant-complaint-card.sass';
import BaseComplaintCard from 'components/pinboard-page/relevant/common/base-complaint-card';
import withUndoCard from 'components/pinboard-page/cards/with-undo-card';
import { getComplaintMapUrl } from 'utils/mapbox';
import { UNDO_CARD_THEMES } from 'utils/constants';


export default class RelevantComplaintCard extends Component {
  render() {
    const {
      crid,
      incidentDate,
      category,
      officers,
      point,
      addItemInPinboardPage,
      focusItem,
    } = this.props;

    const leftChild = (
      <div
        className={ styles.relevantComplaintMap }
        style={ point ? {
          background: `url("${getComplaintMapUrl(point.lat, point.lon, 130, 176)}") no-repeat center/cover`
        }: null }
      />
    );

    return (
      <BaseComplaintCard
        crid={ crid }
        incidentDate={ incidentDate }
        category={ category }
        point={ point }
        officers={ officers }
        leftChild={ leftChild }
        addItemInPinboardPage={ addItemInPinboardPage }
        focusItem={ focusItem }
      />
    );
  }
}

RelevantComplaintCard.propTypes = {
  crid: PropTypes.string,
  incidentDate: PropTypes.string,
  category: PropTypes.string,
  officers: PropTypes.arrayOf(PropTypes.object),
  point: PropTypes.shape({
    lat: PropTypes.number,
    lon: PropTypes.number
  }),
  addItemInPinboardPage: PropTypes.func,
  focusItem: PropTypes.func,
};

RelevantComplaintCard.defaultProps = {
  focusItem: noop,
};

export const RelevantComplaintCardWithUndo = withUndoCard(
  RelevantComplaintCard,
  () => 'Complaint added.',
  'addItemInPinboardPage',
  {
    theme: UNDO_CARD_THEMES.DARK,
    keepVisible: false,
    hasWrapper: true,
  }
);