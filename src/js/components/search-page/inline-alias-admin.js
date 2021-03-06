import 'react-tagsinput/react-tagsinput.css';
import 'tagsinput.css';

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TagsInput from 'react-tagsinput';
import AutosizeInput from 'react-input-autosize';
import { Link } from 'react-router-dom';

import { SEARCH_ALIAS_EDIT_PATH } from 'utils/constants';
import { imgUrl } from 'utils/static-assets';
import {
  inlineAliasAdminStyle,
  centerContentStyle,
  titleStyle,
  textStyle,
  descriptionStyle,
  hintStyle,
  errorStyle,
  actionButtonStyle,
  removeTagButtonStyle,
  reactTagsinputInputStyle,
} from './inline-alias-admin.style';

const backLink = `/edit${SEARCH_ALIAS_EDIT_PATH}`;

export default class InlineAliasAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aliases: props.existingAliases || [],
    };
  }

  handleAliasesChange = newAliases => {
    this.setState({
      aliases: newAliases,
    });
  };

  renderAlias = props => {
    // eslint-disable-next-line no-unused-vars
    let { tag, key, onRemove, getTagDisplayValue, classNameRemove, ...other } = props;

    return (
      <span key={ key } { ...other }>
        { getTagDisplayValue(tag) }
        <img onClick={ onRemove.bind(this, key) } src={ imgUrl('remove-x.svg') } style={ removeTagButtonStyle }/>
      </span>
    );
  };

  renderInput = ({ addTag, ...props }) => {
    let { onChange, value, ...other } = props;
    return (
      <AutosizeInput
        inputStyle={ reactTagsinputInputStyle }
        type='text'
        onChange={ onChange }
        value={ value }
        { ...other }
      />
    );
  };

  saveAliases = () => {
    const { aliases } = this.state;
    const { id, type, updateAliases } = this.props;
    updateAliases(id, type, aliases);
  };

  render() {
    const { text, description, errorMessage } = this.props;

    return (
      <div style={ inlineAliasAdminStyle }>
        <div style={ centerContentStyle }>
          <h3 style={ titleStyle }>Create new alias</h3>
          <p style={ textStyle }>{ text }</p>
          <p style={ descriptionStyle }>{ description }</p>

          <TagsInput
            value={ this.state.aliases }
            onChange={ this.handleAliasesChange }
            inputProps={ { className: 'react-tagsinput-input', placeholder: 'Enter alias' } }
            renderTag={ this.renderAlias }
            renderInput={ this.renderInput }
            onlyUnique={ true }
            addKeys={ [13, 188] } // Enter & Comma
            addOnBlur={ true }
          />

          <p style={ hintStyle }>
            Insert commas to create multiple aliases.<br />
            Your update may take some time to be processed.
          </p>
          <p style={ errorStyle }>{ errorMessage }</p>
          <Link to={ backLink } style={ actionButtonStyle }>Cancel</Link>
          <span
            className='test--save-button'
            style={ actionButtonStyle }
            onClick={ this.saveAliases }
          >
            Save
          </span>
        </div>
      </div>
    );
  }
}

InlineAliasAdmin.propTypes = {
  id: PropTypes.string,
  text: PropTypes.string,
  description: PropTypes.string,
  existingAliases: PropTypes.array,
  type: PropTypes.string,
  updateAliases: PropTypes.func,
  errorMessage: PropTypes.string,
};
