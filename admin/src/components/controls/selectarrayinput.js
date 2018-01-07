import React, { Component } from 'react';
import { Async } from 'react-select';
import { Field } from 'redux-form';
import 'react-select/dist/react-select.css';


const renderSelect = ({ meta: { touched, error } = {}, input: { ...inputProps }, ...props }) =>{
  console.log(`renderSelect form ==>inputProps:${JSON.stringify(inputProps)},props:${JSON.stringify(props)}`)
  let onChange = (values)=>{
    let sz = values.split(',');
    inputProps.onChange(sz);
  }

  return (<Async
        multi
        matchProp={"label"}
        onChange={onChange}
        value={inputProps.value}
        {...props}
        backspaceToRemoveMessage={'按退格键删除'}
        clearAllText={'删除所有'}
        clearValueText={'删除'}
        noResultsText={'找不到记录'}
        placeholder={'请选择'}
        searchPromptText={'输入查询'}
        loadingPlaceholder={'加载中...'}
        simpleValue
    />);
}

const CfSelectArrayInput = ({source,label,loadOptions}) => {
  return(
      <span>
        <Field
            name={source}
            component={renderSelect}
            label={label}
            loadOptions={loadOptions}
        />
    </span>
  )
}

CfSelectArrayInput.defaultProps = {
    addLabel: true,
};


export  {CfSelectArrayInput};
