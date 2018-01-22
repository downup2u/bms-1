import React from 'react';
import { List, EmailField } from 'admin-on-rest/lib/mui';
import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import {
  CreateButton,
  RichTextField,
  NumberInput,
  Create,
  Edit,
  SimpleForm,
  DisabledInput,
  TextInput,
  Show,
  SimpleShowLayout,
  ShowButton,
  DateInput,
  LongTextInput,
  ReferenceManyField,
  Datagrid,
  TextField,
  DateField,
  EditButton,
  SelectInput,
  BooleanInput,
  BooleanField,
  ImageField,
  ReferenceField,
  ReferenceInput,
  Filter
} from 'admin-on-rest/lib/mui';

import { Field,FieldArray } from 'redux-form';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ContentAdd from 'material-ui/svg-icons/content/add';
import TimePicker from 'material-ui/TimePicker';
import moment from 'moment';

const UserFilter = (props) => (
    <Filter {...props}>
       <ReferenceInput label="用户" source="creator" reference="user" addLabel={false}>
            <SelectInput optionText="username" />
       </ReferenceInput>
    </Filter>
);

const UserlogList = (props) => (
     <List title="用户登录信息列表" filters={<UserFilter />}  {...props} >
        <Datagrid  bodyOptions={{ showRowHover: true }}>
          <TextField label="用户名" source="username" />
          <TextField label="登录时间" source="created_at"  />
          <ReferenceField label="用户" source="creator" reference="user" allowEmpty>
            <TextField source="username" />
          </ReferenceField>
          <TextField label="类型" source="type" />
        </Datagrid>
    </List>
);


export  {UserlogList};
