import { connect } from 'react-redux';

import BottomSheet from 'components/bottom-sheet';
import { closeBottomSheet } from 'actions/bottom-sheet';
import { contentSelector } from 'selectors/bottom-sheet';


function mapStateToProps(state, props) {
  const content = contentSelector(state, props);
  return {
    content,
    open: content !== null
  };
}

const mapDispatchToProps = {
  onClose: closeBottomSheet
};

export default connect(mapStateToProps, mapDispatchToProps)(
  BottomSheet
);
