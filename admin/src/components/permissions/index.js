import React from 'react';
import { List, EmailField,RichTextInput } from 'admin-on-rest/lib/mui';
import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import { required,NumberInput,NumberField,Create, Edit, SimpleForm, DisabledInput, TextInput,  Show,SimpleShowLayout,ShowButton,
   DateInput, LongTextInput, ReferenceManyField, Datagrid, TextField, DateField, EditButton,BooleanInput,ReferenceField,
 Filter,Filters,SelectInput,ChipField,SelectField } from 'admin-on-rest/lib/mui';

import _ from 'lodash';
import { Field,FieldArray } from 'redux-form';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ContentAdd from 'material-ui/svg-icons/content/add';
import TimePicker from 'material-ui/TimePicker';
import moment from 'moment';
import {CreateActions,EditActions} from '../controls/createeditactions';

  // { id: 'operator', name: '操作权限' },
const PermissionCreate = (props) => (
  <Create title="新建权限" {...props}  actions={<CreateActions />}>
    <SimpleForm>
      <TextInput label="名称" source="name" validate={required} />
      <TextInput label="备注" source="memo" />
    </SimpleForm>
  </Create>
);

const PermissionTitle = ({record}) => {
  return <span>用户权限</span>;
}


const PermissionEdit = (props) => {
  return (
    <Edit title="编辑权限" {...props}  actions={<EditActions />}>
      <SimpleForm>
        <DisabledInput label="ID" source="id" />
        <TextInput label="名称" source="name" validate={required} />
        <TextInput label="备注" source="memo" />
      </SimpleForm>
    </Edit>
  );
};

const EditBtnif = (props)=>{
  const {record} = props;
  return _.get(record,'systemflag',0) === 0?<EditButton {...props}/>:null;
}
const PermissionList = (props) => (
  <List title="权限管理" {...props}>
    <Datagrid  bodyOptions={{ showRowHover: true }}>
      <TextField label="名称" source="name" />
      <TextField label="备注" source="memo" />
      <EditBtnif />
    </Datagrid>
  </List>
);
export {PermissionCreate,PermissionList,PermissionEdit};
