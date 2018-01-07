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
import {CreateActions,EditActions} from '../controls/createeditactions';
import {getOptions} from '../controls/getselect.js';
import {CfSelectArrayInput} from '../controls/selectarrayinput.js';


const RoleCreate = (props) => {
  return (
    <Create title="创建角色" {...props}  actions={<CreateActions />}>
      <SimpleForm>
        <TextInput label="角色名称" source="name" validate={required} />
        <TextInput label="备注" source="memo" />
        <CfSelectArrayInput label="权限" source="permissions" loadOptions={getOptions('permission','name','_id')}/>
      </SimpleForm>
    </Create>
  );
};

const RoleEdit = (props) => {
  return (
    <Edit title="编辑角色" {...props}  actions={<EditActions />}>
      <SimpleForm>
        <TextInput label="角色名称" source="name" validate={required} />
        <TextInput label="备注" source="memo" />
        <CfSelectArrayInput label="权限" source="permissions" loadOptions={getOptions('permission','name','_id')}/>
      </SimpleForm>
    </Edit>
  );
};

const RoleTitle = ({record}) => {
  return <span>角色管理</span>
};
const RoleList = (props) => (
  <List title={<RoleTitle />} {...props} >
    <Datagrid  bodyOptions={{ showRowHover: true }}>
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
