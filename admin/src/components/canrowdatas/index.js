import React from 'react';
import { List, EmailField,RichTextInput } from 'admin-on-rest/lib/mui';
import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import { NumberInput,
  NumberField,
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
  BooleanInput,
  TabbedForm,
  FormTab,
  Filter,
  SelectInput,
  SelectField,
  ImageField,
  ReferenceInput,
  ReferenceField } from 'admin-on-rest/lib/mui';

import { Field,FieldArray } from 'redux-form';
import TimePicker from 'material-ui/TimePicker';
import moment from 'moment';

const CanRawDataShow = (props) => {
  return (<Show title="设备历史数据" {...props}>
      <SimpleShowLayout>
        <TextField label="设备ID" source="DeviceId" />
        <TextField label="采集时间" source="DataTime"  />
        <TextField label="Gateway接受到数据时间" source="MessageTime" showTime />
        <TextField label="数据序号" source="SN" />
        <TextField label="数据" source="Data" />
        <TextField label="插入数据库时间" source="created_at" showTime />
      </SimpleShowLayout>
    </Show>
    );
};

const CanRawDataList = (props) => (
  <List title="设备历史数据" sort={{field:'created_at',order:'DESC'}} {...props}>
    <Datagrid  bodyOptions={{ showRowHover: true }}>
      <TextField label="设备ID" source="DeviceId" />
      <TextField label="采集时间" source="DataTime"  />
      <TextField label="Gateway接受到数据时间" source="MessageTime"  />
      <TextField label="数据序号" source="SN" />
      <TextField label="数据" source="Data" />
      <TextField label="插入数据库时间" source="created_at"  />
      <ShowButton />
    </Datagrid>
  </List>
);

export {CanRawDataList,CanRawDataShow};
