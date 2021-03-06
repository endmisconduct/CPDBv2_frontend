import docOverviewPageReducer from 'reducers/documents-overview-page';


describe('DocumentsOverviewPage reducer', function () {
  it('should have initial state', function () {
    docOverviewPageReducer(undefined, {}).should.deepEqual({
      documents: {
        data: {},
        match: '',
      },
      isRequesting: false,
      pagination: {},
      documentsOrder: {
        data: [],
        match: '',
      },
    });
  });
});
