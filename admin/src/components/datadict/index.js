import React from 'react';
import { List, EmailField,RichTextInput } from 'admin-on-rest/lib/mui';
import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import { required,NumberInput,Create, Edit, SimpleForm, DisabledInput, TextInput,Show,SimpleShowLayout,ShowButton,
   DateInput, LongTextInput, ReferenceManyField, Datagrid, TextField, DateField, EditButton,BooleanInput,ReferenceField,
 Filter,Filters,ReferenceInput,SelectInput } from 'admin-on-rest/lib/mui';

 import { ReferenceArrayInput, SelectArrayInput } from 'admin-on-rest';

import ActionDelete from 'material-ui/svg-icons/action/delete';
import ContentAdd from 'material-ui/svg-icons/content/add';
import TimePicker from 'material-ui/TimePicker';
import moment from 'moment';
import {CreateActions,EditActions} from '../controls/createeditactions';

const DataDictTitle = ({record}) => {
  return <span>数据字典维护</span>
};

export const DDFilter = props => (
    <Filter {...props}>
        <TextInput label="搜索字典" source="name_q" />
    </Filter>
);


const DataDictCreate = (props) => (
  <Create title="创建数据字典字段" {...props}  actions={<CreateActions />}>
    <SimpleForm>
      <TextInput label="字段名" source="name" validate={required} />
      <TextInput label="字段全名" source="fullname" />
      <TextInput label="字段显示名" source="showname" validate={required} />
      <TextInput label="字段类型" source="type" />
      <TextInput label="字段描述" source="desc" />
      <TextInput label="字段单位" source="unit" />
    </SimpleForm>
  </Create>
);

const DataDictEdit = (props) => {
  return (<Edit title="编辑数据字典字段" {...props}  actions={<EditActions />}>
    <SimpleForm>
      <TextInput label="字段名" source="name" validate={required} />
      <TextInput label="字段全名" source="fullname" />
      <TextInput label="字段显示名" source="showname" validate={required} />
      <TextInput label="字段类型" source="type" />
      <TextInput label="字段描述" source="desc" />
      <TextInput label="字段单位" source="unit" />
    </SimpleForm>
  </Edit>
  );
};

const DataDictList = (props) => (
  <List title={<DataDictTitle />} {...props} filters={<DDFilter/>}>
    <Datagrid  bodyOptions={{ showRowHover: true }}>
      <TextField label="字段名" source="name" />
      <TextField label="字段显示名" source="showname" />
      <TextField label="字段类型" source="type" />
      <TextField label="字段单位" source="unit" />
      <EditButton />
    </Datagrid>
  </List>
);




export {DataDictCreate,DataDictList,DataDictEdit};
