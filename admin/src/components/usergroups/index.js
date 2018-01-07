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

const UserGroupCreate = (props) => {
  return (
    <Create title="创建用户组" {...props} >
      <SimpleForm>
        <TextInput label="分组名称" source="name" validate={required} />
        <TextInput label="备注" source="memo" />
        <TextInput label="联系人" source="contact" />
        <ReferenceArrayInput label="权限" reference="permission" source="permissions" allowEmpty>
              <SelectArrayInput optionText="name" />
        </ReferenceArrayInput>
      </SimpleForm>
    </Create>
  );
};

const UserGroupEdit = (props) => {
  return (
    <Edit title="编辑用户组" {...props} >
      <SimpleForm>
        <TextInput label="分组名称" source="name" validate={required} />
        <TextInput label="备注" source="memo" />
        <TextInput label="联系人" source="contact" />
        <ReferenceArrayInput label="权限" reference="permission" source="permissions" allowEmpty>
              <SelectArrayInput optionText="name" />
        </ReferenceArrayInput>
      </SimpleForm>
    </Edit>
  );
};

const UserGroupTitle = ({record}) => {
  return <span>用户分组列表</span>
};
const UserGroupList = (props) => (
  <List title={<UserGroupTitle />} {...props} >
    <Datagrid  bodyOptions={{ showRowHover: true }}>
      <TextField label="分组名称" source="name" />
      <TextField label="备注" source="memo" />
      <TextField label="联系人" source="contact" />
      <ReferenceArrayField label="权限" reference="permission" source="permissions" >
              <SingleFieldList>
                  <ChipField source="name" />
              </SingleFieldList>
      </ReferenceArrayField>
      <EditButton />
    </Datagrid>
  </List>
);


export {UserGroupCreate,UserGroupList,UserGroupEdit};
