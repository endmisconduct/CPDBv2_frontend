import {
  officerDetailTransform,
  sortedNetworkOfficersSelector,
  getNetworkOfficersRequesting,
} from 'selectors/social-graph-page/network-officers';


describe('Social Graph page selectors', function () {
  describe('officerDetailTransform', function () {
    it('should return detail officer correctly', function () {
      const officer = {
        'id': 123,
        'full_name': 'Jerome Finnigan',
        'appointed_date': '2001-07-08',
        'resignation_date': '2005-10-10',
        'badge': '123456',
        'gender': 'Male',
        'birth_year': 1970,
        'race': 'White',
        'rank': 'Police Officer',
        'unit': {
          'id': 456,
          'unit_name': 'Unit 715',
          'description': 'This is unit description',
        },
        'allegation_count': 10,
        'sustained_count': 5,
        'civilian_compliment_count': 20,
        'discipline_count': 3,
        'trr_count': 7,
        'major_award_count': 15,
        'honorable_mention_count': 12,
        'percentile_allegation': '95.0000',
        'percentile_trr': '90.0000',
        'percentile_allegation_civilian': '97.0000',
        'percentile_allegation_internal': '82.0000',
        'honorable_mention_percentile': '70.0000',
      };

      officerDetailTransform(officer).should.eql({
        id: 123,
        fullName: 'Jerome Finnigan',
        percentile: {
          items: [
            { axis: 'Use of Force Reports', value: 90 },
            { axis: 'Officer Allegations', value: 82 },
            { axis: 'Civilian Allegations', value: 97 },

          ],
          visualTokenBackground: '#F52524',
          textColor: '#DFDFDF',
        },
      });
    });
  });

  describe('sortedNetworkOfficersSelector', function () {
    it('should return network officers correctly', function () {
      const state = {
        socialGraphPage: {
          networkData: {
            networkOfficers: [
              {
                'id': 123,
                'full_name': 'Gilbert Cobb',
                'percentile_allegation': '95.0000',
                'percentile_trr': '90.0000',
                'percentile_allegation_civilian': '97.0000',
                'percentile_allegation_internal': '82.0000',
              },
              {
                'id': 456,
                'full_name': 'Tracy Hughes',
                'percentile_allegation': '70',
                'percentile_trr': '90',
                'percentile_allegation_civilian': '90.0',
                'percentile_allegation_internal': '30.0',
              },
              {
                'id': 789,
                'full_name': 'Jerome Finnigan',
                'percentile_allegation': '80',
                'percentile_trr': '82',
                'percentile_allegation_civilian': '74.0',
                'percentile_allegation_internal': '32.0',
              },
            ],
          },
        },
      };
      const expectedSortedNetworkOfficers = [
        {
          id: 123,
          fullName: 'Gilbert Cobb',
          percentile: {
            items: [
              { axis: 'Use of Force Reports', value: 90 },
              { axis: 'Officer Allegations', value: 82 },
              { axis: 'Civilian Allegations', value: 97 },

            ],
            visualTokenBackground: '#F52524',
            textColor: '#DFDFDF',
          },
        },
        {
          id: 456,
          fullName: 'Tracy Hughes',
          percentile: {
            items: [
              { axis: 'Use of Force Reports', value: 90 },
              { axis: 'Officer Allegations', value: 30 },
              { axis: 'Civilian Allegations', value: 90 },

            ],
            visualTokenBackground: '#FF412C',
            textColor: '#231F20',
          },
        },
        {
          id: 789,
          fullName: 'Jerome Finnigan',
          percentile: {
            items: [
              { axis: 'Use of Force Reports', value: 82 },
              { axis: 'Officer Allegations', value: 32 },
              { axis: 'Civilian Allegations', value: 74 },

            ],
            visualTokenBackground: '#FF412C',
            textColor: '#231F20',
          },
        },
      ];
      sortedNetworkOfficersSelector(state, {}).should.eql(expectedSortedNetworkOfficers);
    });

    it('should return network officers with order', function () {
      const state = {
        socialGraphPage: {
          networkData: {
            networkOfficers: [
              {
                'id': 123,
                'full_name': 'Gilbert Cobb',
                'percentile_allegation': '95',
                'percentile_trr': '90',
                'percentile_allegation_civilian': '97.0',
                'percentile_allegation_internal': '82.0',
              },
              {
                'id': 456,
                'full_name': 'Tracy Hughes',
                'percentile_allegation': '70',
                'percentile_trr': '90',
                'percentile_allegation_civilian': '90.0',
                'percentile_allegation_internal': '30.0',
              },
              {
                'id': 789,
                'full_name': 'Jerome Finnigan',
                'percentile_allegation': '80',
                'percentile_trr': '82',
                'percentile_allegation_civilian': '74.0',
                'percentile_allegation_internal': '32.0',
              },
            ],
          },
        },
      };
      const expectedSortedNetworkOfficers = [
        {
          id: 456,
          fullName: 'Tracy Hughes',
          percentile: {
            items: [
              { axis: 'Use of Force Reports', value: 90 },
              { axis: 'Officer Allegations', value: 30 },
              { axis: 'Civilian Allegations', value: 90 },

            ],
            visualTokenBackground: '#FF412C',
            textColor: '#231F20',
          },
        },
        {
          id: 123,
          fullName: 'Gilbert Cobb',
          percentile: {
            items: [
              { axis: 'Use of Force Reports', value: 90 },
              { axis: 'Officer Allegations', value: 82 },
              { axis: 'Civilian Allegations', value: 97 },

            ],
            visualTokenBackground: '#F52524',
            textColor: '#DFDFDF',
          },
        },
        {
          id: 789,
          fullName: 'Jerome Finnigan',
          percentile: {
            items: [
              { axis: 'Use of Force Reports', value: 82 },
              { axis: 'Officer Allegations', value: 32 },
              { axis: 'Civilian Allegations', value: 74 },

            ],
            visualTokenBackground: '#FF412C',
            textColor: '#231F20',
          },
        },
      ];
      const props = { sortedOfficerIds: [456, 123, 789] };
      sortedNetworkOfficersSelector(state, props).should.eql(expectedSortedNetworkOfficers);
    });
  });

  describe('getNetworkOfficersRequesting', function () {
    it('should return requesting status', function () {
      getNetworkOfficersRequesting({
        socialGraphPage: {
          networkData: { networkOfficersRequesting: false },
        },
      }).should.be.false();

      getNetworkOfficersRequesting({
        socialGraphPage: {
          networkData: { networkOfficersRequesting: true },
        },
      }).should.be.true();
    });
  });
});
