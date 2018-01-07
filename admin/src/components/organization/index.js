import React from 'react';
import { List, EmailField,RichTextInput } from 'admin-on-rest/lib/mui';
import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import { required,NumberInput,NumberField,Create, Edit, SimpleForm, DisabledInput, TextInput,  Show,SimpleShowLayout,ShowButton,
   DateInput, LongTextInput, ReferenceManyField, Datagrid, TextField, DateField, EditButton,BooleanInput,ReferenceField,
 Filter,Filters } from 'admin-on-rest/lib/mui';


import { Field,FieldArray } from 'redux-form';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ContentAdd from 'material-ui/svg-icons/content/add';
import TimePicker from 'material-ui/TimePicker';
import moment from 'moment';

const OrganizationCreate = (props) => {
  return (
    <Create title="创建组织" {...props} >
      <SimpleForm>
        <TextInput label="组织名称" source="name" validate={required} />
        <TextInput label="备注" source="memo" />
        <TextInput label="联系人" source="contact" />
      </SimpleForm>
    </Create>
  );
};

const OrganizationEdit = (props) => {
  return (
    <Edit title="编辑组织" {...props} >
      <SimpleForm>
        <TextInput label="组织名称" source="name" validate={required} />
        <TextInput label="备注" source="memo" />
        <TextInput label="联系人" source="contact" />
      </SimpleForm>
    </Edit>
  );
};

const OrganizationList = (props) => (
  <List title="组织列表" {...props} >
    <Datagrid  bodyOptions={{ showRowHover: true }}>
      <TextField label="组织名称" source="name" />
      <TextField label="备注" source="memo" />
      <TextField label="联系人" source="contact" />
      <EditButton />
    </Datagrid>
  </List>
);


export {OrganizationCreate,OrganizationEdit,OrganizationList};
