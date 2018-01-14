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
import {ShowActions} from '../controls/createeditactions';
import ShowButton from '../controls/ShowButton';

const HistoryTrackTitle = ({record}) => {
  return <span>历史轨迹管理</span>
};

const choices = [
  {_id:'A',status:'定位'},
  {_id:'V',status:'不定位'},
];

const HistoryTrackShow = (props)=> {
  return (<Show title={<HistoryTrackTitle />} {...props} actions={<ShowActions />}>
   <SimpleShowLayout>
    <TextField label="设备ID" source="DeviceId" />
    <TextField label="设备状态" source="DeviceStatus" />
    <TextField label="主板温度，单位：摄氏度" source="ADC1" />
    <DateField label="接受数据时间" source="MessageTime" showTime />
    <TextField label="Position数据包序号" source="SN" />
    <SelectField label="GPS定位" source="GPSStatus" choices={choices} optionValue="_id" optionText="status" />
    <DateField label="定位的UTC时间" source="GPSTime" showTime />
    <TextField label="经度" source="Longitude" />
    <TextField label="纬度" source="Latitude" />
    <TextField label="速度" source="Speed" />
    <TextField label="航向" source="Course" />
    <TextField label="蜂窝Location Area Code" source="LAC" />
    <TextField label="蜂窝Cell Id" source="CellId" />
    <TextField label="海拔,单位：米" source="Altitude" />
    <TextField label="所在省" source="Province" />
    <TextField label="所在市" source="City" />
    <TextField label="所在区县" source="County" />
   </SimpleShowLayout>
  </Show>
  );
};

const DeviceFilter = (props) => (
  <Filter {...props}>
    <TextInput label="搜索设备" source="DeviceId_q" />
  </Filter>
)

const HistoryTrackList = (props)=> (
  <List title={<HistoryTrackTitle />}  filters={<DeviceFilter />} sort={{field:'created_at',order:'DESC'}} {...props}>
    <Datagrid  bodyOptions={{ showRowHover: true }}>
      <TextField label="设备ID" source="DeviceId" />
      <TextField label="CellId" source="CellId" />
      <DateField label="定位时间" source="GPSTime" showTime />
      <NumberField label="经度" source="Longitude" />
      <NumberField label="纬度" source="Latitude" />
      <NumberField label="速度" source="Speed" />
      <NumberField label="航向" source="Course" />
      <ShowButton />
    </Datagrid>
  </List>
);

export {HistoryTrackList,HistoryTrackShow};
