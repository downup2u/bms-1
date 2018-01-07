import React from 'react';
import { List, EmailField,RichTextInput } from 'admin-on-rest/lib/mui';
import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import { required,NumberInput,Create, Edit, SimpleForm, DisabledInput, TextInput,  Show,SimpleShowLayout,ShowButton,
   DateInput, LongTextInput, ReferenceManyField, Datagrid, TextField, DateField, EditButton,BooleanInput,ReferenceField,
 Filter,Filters } from 'admin-on-rest/lib/mui';


import { Field,FieldArray } from 'redux-form';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ContentAdd from 'material-ui/svg-icons/content/add';
import TimePicker from 'material-ui/TimePicker';
import moment from 'moment';

const UserAdminTitle = ({record}) => {
  return <span>管理员</span>
};

const useradminDefaultValue = {created_at:new Date()};

const UserAdminCreate = (props) => (
  <Create title="创建管理员" {...props}>
    <SimpleForm defaultValue={useradminDefaultValue}>
      <TextInput lable="管理员名" source="username" validate={required} />
    </SimpleForm>
  </Create>
);

const UserAdminList = (props) => (
  <List title={<UserAdminTitle />} {...props}>
    <Datagrid  bodyOptions={{ showRowHover: true }}>
      <TextField lable="管理员" source="username" />
      <DateField lable="注册时间" source="created_at" showTime />
      <DateField lable="上次登录时间" source="updated_at" showTime />
      <EditButton />
    </Datagrid>
  </List>
);

const UserAdminEdit = (props) =>{
  return (<Edit title={<UserAdminTitle />} {...props}>
    <SimpleForm>
      <TextInput lable="管理员名" source="username" validate={required} />
    </SimpleForm>
  </Edit>
  );
};

export {UserAdminCreate,UserAdminList,UserAdminEdit};
