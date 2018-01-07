import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import renderGroupEdit from './devicegroupedit';
import renderAlaramRuleEdit from './alarmrule';

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


const CfAlaramRuleInput = ({source,label}) => {
  return(
      <span>
        <Field
            name={source}
            component={renderAlaramRuleEdit}
            label={label}
        />
    </span>
  )
}

CfAlaramRuleInput.defaultProps = {
    addLabel: true,
};
export  {CfSelectArrayInputDetail,CfAlaramRuleInput};
