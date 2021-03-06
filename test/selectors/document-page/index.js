import moment from 'moment-timezone';

import {
  getTitleEditModeOn,
  getTagsEditModeOn,
  getTagsErrorMessages,
  documentSelector,
  documentEditableFieldsSelector,
  getDocumentSuggestionTags,
} from 'selectors/document-page';
import { omit } from 'lodash';

describe('Document selectors', function () {
  describe('getTitleEditModeOn', function () {
    it('should return correct result', function () {
      getTitleEditModeOn({
        documentPage: {
          titleEditModeOn: true,
        },
      }).should.eql(true);
    });
  });

  describe('getTagsEditModeOn', function () {
    it('should return correct result', function () {
      getTagsEditModeOn({
        documentPage: {
          tagsEditModeOn: true,
        },
      }).should.eql(true);
    });
  });

  describe('getTagsErrorMessages', function () {
    it('should return correct result', function () {
      getTagsErrorMessages({
        documentPage: {
          tagsErrorMessages: ['This is error message 1.', 'This is error message 2.'],
        },
      }).should.eql(['This is error message 1.', 'This is error message 2.']);
    });
  });

  describe('documentSelector', function () {
    beforeEach(function () {
      moment.tz.setDefault('America/Chicago');
    });

    afterEach(function () {
      moment.tz.setDefault();
    });

    const state = {
      documentPage: {
        isRequesting: false,
        data: {
          'id': 14193,
          'crid': '1083633',
          'title': 'CRID 1083633 CR CRID 1083633 CR Tactical Response Report 2 (Glim)',
          'tags': ['tag1', 'tag2'],
          'next_document_id': 14192,
          'text_content': 'TACTICAL RESPONSE Police Department\n1. DATE OF INCIDENT TIME 2. ADDRESS OF OCCURRENCE',
          'url': 'https://assets.documentcloud.org/documents/5680384/CRID-1083633-CR-CRID-1083633-CR-Tactical.pdf',
          'preview_image_url': 'https://assets.documentcloud.org/documents/5680384/pages/CRID-1083633.gif',
          'original_url': 'https://www.chicagocopa.org/wp-content/uploads/2017/03/TRR-HOSPITAL-REDACTED.pdf',
          'created_at': '2019-01-09T03:11:27.441718-06:00',
          'updated_at': '2019-02-28T20:50:10.161395-06:00',
          'crawler_name': 'Chicago COPA',
          'linked_documents': [{
            'id': 14192,
            'preview_image_url': 'https://assets.documentcloud.org/documents/5680385/pages/CRID-1083633.gif',
          }, {
            'id': 14188,
            'preview_image_url': 'https://assets.documentcloud.org/documents/5680389/pages/CRID-1083633.gif',
          }],
          'pages': 5,
          'last_updated_by': 'John Doe',
          'views_count': 1000,
          'downloads_count': 100,
          'notifications_count': 10,
        },
        titleEditModeOn: false,
      },
    };

    it('should return correct result', function () {
      documentSelector(state).should.eql({
        attachmentId: 14193,
        title: 'CRID 1083633 CR CRID 1083633 CR Tactical Response Report 2 (Glim)',
        tags: ['tag1', 'tag2'],
        nextDocumentId: 14192,
        fullText: 'TACTICAL RESPONSE Police Department\n1. DATE OF INCIDENT TIME 2. ADDRESS OF OCCURRENCE',
        url: 'https://assets.documentcloud.org/documents/5680384/CRID-1083633-CR-CRID-1083633-CR-Tactical.pdf',
        previewImageUrl: 'https://assets.documentcloud.org/documents/5680384/pages/CRID-1083633.gif',
        crid: '1083633',
        pageCount: 5,
        lastUpdatedBy: 'John Doe',
        linkedDocuments: [{
          id: 14192,
          previewImageUrl: 'https://assets.documentcloud.org/documents/5680385/pages/CRID-1083633.gif',
        }, {
          id: 14188,
          previewImageUrl: 'https://assets.documentcloud.org/documents/5680389/pages/CRID-1083633.gif',
        }],
        lastEditedDateTime: 'at 08:50PM on Feb 28, 2019',
        infoItems: [
          { name: 'CRID', value: 'CR 1083633', to: '/complaint/1083633/' },
          {
            name: 'Source',
            value: 'chicagocopa.org',
            tooltip: 'https://www.chicagocopa.org/wp-content/uploads/2017/03/TRR-HOSPITAL-REDACTED.pdf',
            url: 'https://www.chicagocopa.org/wp-content/uploads/2017/03/TRR-HOSPITAL-REDACTED.pdf',
          },
          { name: 'Crawler', value: 'Chicago COPA' },
          { name: 'Date', value: 'Jan 9, 2019' },
          { name: 'Views', value: '1,000' },
          { name: 'Downloads', value: '100' },
          { name: 'Notifications', value: '10' },
        ],
      });
    });

    it('should omit views, downloads, notifications if undefined', function () {
      const newState = omit(state, [
        'documentPage.data.views_count', 'documentPage.data.downloads_count', 'documentPage.data.notifications_count']
      );

      documentSelector(newState).should.eql({
        attachmentId: 14193,
        title: 'CRID 1083633 CR CRID 1083633 CR Tactical Response Report 2 (Glim)',
        tags: ['tag1', 'tag2'],
        nextDocumentId: 14192,
        fullText: 'TACTICAL RESPONSE Police Department\n1. DATE OF INCIDENT TIME 2. ADDRESS OF OCCURRENCE',
        url: 'https://assets.documentcloud.org/documents/5680384/CRID-1083633-CR-CRID-1083633-CR-Tactical.pdf',
        previewImageUrl: 'https://assets.documentcloud.org/documents/5680384/pages/CRID-1083633.gif',
        crid: '1083633',
        pageCount: 5,
        lastUpdatedBy: 'John Doe',
        linkedDocuments: [{
          id: 14192,
          previewImageUrl: 'https://assets.documentcloud.org/documents/5680385/pages/CRID-1083633.gif',
        }, {
          id: 14188,
          previewImageUrl: 'https://assets.documentcloud.org/documents/5680389/pages/CRID-1083633.gif',
        }],
        lastEditedDateTime: 'at 08:50PM on Feb 28, 2019',
        infoItems: [
          { name: 'CRID', value: 'CR 1083633', to: '/complaint/1083633/' },
          {
            name: 'Source',
            value: 'chicagocopa.org',
            tooltip: 'https://www.chicagocopa.org/wp-content/uploads/2017/03/TRR-HOSPITAL-REDACTED.pdf',
            url: 'https://www.chicagocopa.org/wp-content/uploads/2017/03/TRR-HOSPITAL-REDACTED.pdf',
          },
          { name: 'Crawler', value: 'Chicago COPA' },
          { name: 'Date', value: 'Jan 9, 2019' },
        ],
      });
    });
  });

  describe('documentEditableFieldsSelector', function () {
    it('should return correct result', function () {
      documentEditableFieldsSelector({
        documentPage: {
          isRequesting: false,
          data: {
            'id': 14193,
            'title': 'CRID 1083633 CR CRID 1083633 CR Tactical Response Report 2 (Glim)',
            'tags': ['123', '456'],
            'text_content': 'TACTICAL RESPONSE Police Department\n1. DATE OF INCIDENT TIME 2. ADDRESS OF OCCURRENCE',
          },
          titleEditModeOn: false,
        },
      }).should.eql({
        attachmentId: {
          type: 'number',
          key: 'id',
          value: 14193,
        },
        title: {
          type: 'string',
          key: 'title',
          value: 'CRID 1083633 CR CRID 1083633 CR Tactical Response Report 2 (Glim)',
        },
        tags: {
          type: 'array',
          key: 'tags',
          value: ['123', '456'],
        },
      });
    });

    it('should handle undefined cases', function () {
      documentEditableFieldsSelector({
        documentPage: {
          isRequesting: false,
          data: {
            'id': 14193,
          },
          titleEditModeOn: false,
          tagsEditModeOn: false,
        },
      }).should.eql({
        attachmentId: {
          type: 'number',
          key: 'id',
          value: 14193,
        },
        title: {
          type: 'string',
          key: 'title',
          value: '',
        },
        tags: {
          type: 'array',
          key: 'tags',
          value: [],
        },
      });
    });
  });

  describe('getDocumentSuggestionTags', function () {
    it('should return correct result', function () {
      getDocumentSuggestionTags({
        documentPage: {
          suggestionTags: ['tag1', 'tag2'],
        },
      }).should.eql(['tag1', 'tag2']);
    });
  });
});
