import PropTypes from 'prop-types';
import React from 'react';
import { get } from 'lodash';

import MetricPane from 'components/officer-page/metrics-section/metric-pane';
import styles from './metrics-column.sass';


export default function MetricsColumn(props) {
  const { metrics, dashedSeparator, pathName } = props;
  return (
    <div className={ styles.metricsColumn }>
      {
        metrics.map((metric, index) => (
          <MetricPane
            key={ index }
            value={ metric.value }
            name={ metric.name }
            description={ metric.description }
            highlightValue={ get(metric, 'highlightValue', false) }
            dashedBorder={ dashedSeparator }
            popup={ metric.popup }
            pathName={ pathName }
          />
        ))
      }
    </div>
  );
}

MetricsColumn.propTypes = {
  metrics: PropTypes.array,
  dashedSeparator: PropTypes.bool,
  pathName: PropTypes.string,
};

MetricsColumn.defaultProps = {
  dashedSeparator: false,
};
