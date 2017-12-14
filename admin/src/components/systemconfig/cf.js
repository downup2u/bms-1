import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import renderGroupEdit from './devicegroupedit';
import renderSelect from './asyncselect';

const CfSelectArrayInputDetail = ({source,label}) => {
  return(
      <span>
      <Field
          name={source}
          component={renderGroupEdit}
          label={label}
      />
    </span>
  )
}

CfSelectArrayInputDetail.defaultProps = {
    addLabel: true,
};

const CfSelectArrayInput = ({source,label}) => {
  return(
      <span>
        <Field
            name={source}
            component={renderSelect}
            label={label}
        />
    </span>
  )
}

CfSelectArrayInput.defaultProps = {
    addLabel: true,
};
export  {CfSelectArrayInput,CfSelectArrayInputDetail};
