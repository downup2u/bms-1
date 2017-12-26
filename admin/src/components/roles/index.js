import React from 'react';
import { List, EmailField,RichTextInput } from 'admin-on-rest/lib/mui';
import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import { required,NumberInput,NumberField,Create, Edit, SimpleForm, DisabledInput, TextInput,  Show,SimpleShowLayout,ShowButton,
   DateInput, LongTextInput, ReferenceManyField, Datagrid, TextField, DateField, EditButton,BooleanInput,ReferenceField,
 Filter,Filters, ReferenceInput,SelectInput,ReferenceArrayField,SingleFieldList,ChipField  } from 'admin-on-rest/lib/mui';
import { ReferenceArrayInput, SelectArrayInput } from 'admin-on-rest';

import { Field,FieldArray } from 'redux-form';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ContentAdd from 'material-ui/svg-icons/content/add';
import TimePicker from 'material-ui/TimePicker';
import moment from 'moment';
import _ from 'lodash';
//<----打了个补丁----
const SelectArrayInputEx = (props)=>{
  console.log(props);
  let {choices,input,...rest} = props;
  let newchoices=[];
  let mapoptions = {

  };
  _.map(choices,(v)=>{
    newchoices.push({
      id:v.id,
      name:v.name
    });
    mapoptions[v.name] = v.id;
  });
  let onChangeNew = (vz)=>{
    let nw = [];
    _.map(vz,(v)=>{
      if(!!mapoptions[v]){
        nw.push(mapoptions[v]);
      }
      else{
        nw.push(v);
      }

    });
    input.onChange(nw);
  };
  console.log(newchoices);
  let {value,onChange,...restinput} = input;
  let newinput = {
    value:input.value,
    onChange:onChangeNew,
    ...restinput
  };
  return <SelectArrayInput choices={newchoices} input={newinput} {...rest} />
}
//<----打了个补丁----


const RoleCreate = (props) => {
  return (
    <Create title="创建角色" {...props} >
      <SimpleForm>
        <TextInput label="角色名称" source="name" validate={required} />
        <TextInput label="备注" source="memo" />
        <ReferenceArrayInput label="权限" reference="permission" source="permissions"
            options={{ fullWidth: true }}
            filterToQuery={searchText => ({ name_q: searchText })}
          allowEmpty>
              <SelectArrayInputEx />
        </ReferenceArrayInput>
      </SimpleForm>
    </Create>
  );
};

const RoleEdit = (props) => {
  return (
    <Edit title="编辑角色" {...props} >
      <SimpleForm>
        <TextInput label="角色名称" source="name" validate={required} />
        <TextInput label="备注" source="memo" />
        <ReferenceArrayInput label="权限" reference="permission" source="permissions"
            filterToQuery={searchText => ({ name_q: searchText })}
            options={{ fullWidth: true }}
          allowEmpty>
              <SelectArrayInputEx  />
        </ReferenceArrayInput>
      </SimpleForm>
    </Edit>
  );
};

const RoleTitle = ({record}) => {
  return <span>角色列表</span>
};
const RoleList = (props) => (
  <List title={<RoleTitle />} {...props} >
    <Datagrid >
      <TextField label="角色名称" source="name" />
      <ReferenceArrayField label="权限" reference="permission" source="permissions" >
              <SingleFieldList>
                  <ChipField source="name" />
              </SingleFieldList>
      </ReferenceArrayField>
      <EditButton />
    </Datagrid>
  </List>
);


export {RoleCreate,RoleList,RoleEdit};
