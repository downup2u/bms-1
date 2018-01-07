import React from 'react';
import { List, EmailField,RichTextInput } from 'admin-on-rest/lib/mui';
import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import { NumberInput,
  NumberField,
  Edit,
  Show,
  ShowButton,
  SimpleForm,
  DisabledInput,
  TextInput,
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
import _ from 'lodash';
import {ShowActions} from '../controls/createeditactions';

const RealtimeAlamTitle = ({record}) => {
   return <span>每日报警统计</span>
};

const bridge_deviceinfo = (deviceinfo)=>{
  const {LastRealtimeAlarm,...rest} = deviceinfo;
  let deviceinfonew = {...rest,...LastRealtimeAlarm};
  return deviceinfonew;
}
 const getalarmfieldtotxt = (alarmfield)=>{
    let mapdict = {};
    if(_.startsWith(alarmfield, 'AL_') || _.startsWith(alarmfield, 'F[')){
      if(_.startsWith(alarmfield, 'AL_')){
        if(!!mapdict[alarmfield]){
          return mapdict[alarmfield].showname;
        }
      }
      return alarmfield;
    }
    return undefined;
};


const AlarmField = ({ record = {} }) => {
  let alarmtxt = '';
  let deviceinfo = bridge_deviceinfo(record);
  let {_id,CurDay,DeviceId,__v,DataTime,warninglevel,Longitude,Latitude,...rest} = deviceinfo;
  _.map(rest,(v,key)=>{
    let keytxt = getalarmfieldtotxt(key);
    if(!!keytxt){
      alarmtxt += `${keytxt} ${v}次|`
    }
  });
  return (<span>{alarmtxt}</span>);
}

// const AlarmFieldShow = (props) => {
//   let {source,label} = props;
//   return(
//     <span>
//       <Field name={source} component={renderDatePicker} label={label}/>
//     </span>
//   )
// }



const RealtimeAlarmShow = (props) => {
  return (<Show title={<RealtimeAlamTitle />} {...props}  actions={<ShowActions />}>
    <SimpleShowLayout>
     <TextField label="设备ID" source="DeviceId" />
     <TextField label="日期" source="CurDay" />
     <DateField label="采集时间" source="DataTime" showTime />
     <AlarmField label="报警信息" addLabel={true}/>
    </SimpleShowLayout>
  </Show>
  );
};

const DeviceFilter = (props) => (
  <Filter {...props}>
    <TextInput label="搜索设备" source="DeviceId_q" />
  </Filter>
)

const RealtimeAlarmList = (props) => (
  <List title={<RealtimeAlamTitle />} filters={<DeviceFilter />} {...props} sort={{field:'MessageTime',order:'DESC'}}>
    <Datagrid  bodyOptions={{ showRowHover: true }}>
      <TextField label="设备" source="DeviceId" />
      <TextField label="日期" source="CurDay" />
      <DateField label="采集时间" source="DataTime" showTime />
      <AlarmField label="报警信息" />
      <ShowButton />
    </Datagrid>
  </List>
);

export {RealtimeAlarmList,RealtimeAlarmShow};
