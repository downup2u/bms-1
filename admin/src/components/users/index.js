import React from 'react';
import { List, EmailField,RichTextInput } from 'admin-on-rest/lib/mui';
import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import { required,NumberInput,Create, Edit, SimpleForm, DisabledInput, TextInput,  Show,SimpleShowLayout,ShowButton,
   DateInput, LongTextInput, ReferenceManyField, Datagrid, TextField, DateField, EditButton,BooleanInput,ReferenceField,
 Filter,Filters, ReferenceInput,SelectInput } from 'admin-on-rest/lib/mui';


import { Field,FieldArray } from 'redux-form';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ContentAdd from 'material-ui/svg-icons/content/add';
import TimePicker from 'material-ui/TimePicker';
import moment from 'moment';
import ResestPassword from './resetpassword';

const UserListTitle = ({ record }) => {
  return <span>显示 用户</span>;
};
const userDefaultValue = {created_at:new Date()};

const UserCreate = (props) => (
  <Create title="新建用户" {...props}>
    <SimpleForm defaultValue={userDefaultValue}>
      <TextInput label="用户名" source="username" validate={required} />
      <TextInput label="密码" source="password" validate={required} />
      <TextInput label="真实姓名" source="truename"/>
      <TextInput label="备注" source="demo" />
      <ReferenceInput label="用户角色" source="roleid" reference="role" allowEmpty>
        <SelectInput optionText="name" />
      </ReferenceInput>
    </SimpleForm>
  </Create>
);


const UserEdit = (props) => {
  return (
    <Edit title="编辑用户信息" {...props} >
      <SimpleForm>
        <TextField source="id" />
        <TextField label="用户名" source="username" validate={required} />
        <TextInput label="真实姓名" source="truename"/>
        <TextInput label="备注" source="demo" />
        <ReferenceInput label="用户角色" source="roleid" reference="role" allowEmpty>
          <SelectInput optionText="name" />
        </ReferenceInput>
      </SimpleForm>
    </Edit>
  );
};

const UserFilter = (props) => (
  <Filter {...props}>
    <TextInput label="搜索用户" source="username_q" />
  </Filter>
);

const UserList = (props) => (
  <List title="用户列表" filters={<UserFilter />} {...props} sort={{ field: 'created_at', order: 'DESC'}} >
    <Datagrid>
        <TextField label="用户名" source="username" />
        <TextField label="真实姓名" source="truename" />
        <DateField label="注册时间" source="created_at" showTime />
        <DateField label="上次登录时间" source="updated_at" showTime />
        <ReferenceField label="用户角色" source="roleid" reference="role" >
          <TextField source="name" />
        </ReferenceField>
        <ResestPassword />
        <EditButton />
    </Datagrid>
  </List>
);

export {UserCreate,UserList,UserEdit};
