import { kebabCase, map } from 'lodash';

import { getDemographicString } from 'utils/victims';
import { extractPercentile } from './percentile';


const accusedTransform = coaccused => {
  const percentile = extractPercentile(coaccused.percentile);
  return {
    id: coaccused.id,
    name: coaccused['full_name'],
    url: `/officer/${coaccused.id}/${kebabCase(coaccused['full_name'])}/`,
    count: coaccused['allegation_count'],
    radarAxes: percentile.items,
    radarColor: percentile.visualTokenBackground,
  };
};

export const geographicAllegationTransform = geographicCRDatum => ({
  category: geographicCRDatum.category,
  subCategory: geographicCRDatum.subcategory,
  incidentDate: geographicCRDatum.date,
  address: geographicCRDatum.address,
  victims: map(geographicCRDatum.victims, victim => getDemographicString(victim)),
  coaccused: map(geographicCRDatum['coaccused'], coaccused => accusedTransform(coaccused)),
  to: geographicCRDatum.to,
});

export const geographicTRRTransform = geographicTRRDatum => {
  const officer = geographicTRRDatum['officer'];
  const firearmUsed = geographicTRRDatum['firearm_used'];
  const taser = geographicTRRDatum['taser'];
  return {
    to: geographicTRRDatum.to,
    category: firearmUsed ? 'Firearm' : taser ? 'Taser' : 'Use of Force Report',
    incidentDate: geographicTRRDatum.date,
    address: geographicTRRDatum.address,
    officer: officer ? accusedTransform(officer) : null,
  };
};
