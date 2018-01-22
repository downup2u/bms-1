import React from 'react';
import { List, EmailField,RichTextInput } from 'admin-on-rest/lib/mui';
import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import { NumberInput,
  NumberField,
  Edit,
  Show,
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
import ShowButton from '../controls/ShowButton';

const RealtimeAlamTitle = ({record}) => {
   return <span>实时报警明细</span>
};


const bridge_alarmrawinfo = (alarmrawinfo)=>{
  let mapdict = {};
  console.log(`alarminfo===>${JSON.stringify(alarmrawinfo)}`);
  let alarmtxt = '';
  let alarminfonew = {};
  // alarminfonew[`key`] = alarmrawinfo._id;
  // alarminfonew[`车辆ID`] = alarmrawinfo[`DeviceId`];
  // alarminfonew[`报警时间`] = alarmrawinfo[`DataTime`];
  // alarminfonew[`报警等级`] = alarmrawinfo[`warninglevel`];

  let alarminforawtmp = _.clone(alarmrawinfo);
  let rest = _.omit(alarminforawtmp,['_id','CurDay','DeviceId','__v','DataTime','warninglevel','Longitude','Latitude']);
  // console.log(`rest===>${JSON.stringify(rest)}`);
  let warninglevelmap = [
    '无','低','中','高'
  ];
  _.map(rest,(v,alarmfield)=>{
    if(alarmfield === 'AL_Trouble_Code'){
      alarmtxt += `F[${v}]`;
    }
    if(_.startsWith(alarmfield, 'AL_')){
      if(!!mapdict[alarmfield]){
         if(v>= 0 && v<= 3){
           alarmtxt += `${mapdict[alarmfield].showname}[${warninglevelmap[v]}]`;
         }
      }
    }
  });

  alarminfonew[`报警信息`] = alarmtxt;
  console.log(`alarminfonew===>${JSON.stringify(alarminfonew)}`);
  return alarminfonew;
}

const AlarmField = ({ record = {} }) => {
  let alarminfonew = bridge_alarmrawinfo(record);
  let alarmtxt = _.get(alarminfonew,'报警信息','');
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



const RealtimeAlarmRawShow = (props) => {
  return (<Show title={<RealtimeAlamTitle />} {...props} actions={<ShowActions />}>
    <SimpleShowLayout>
     <TextField label="设备ID" source="DeviceId" />
     <TextField label="报警等级" source="warninglevel" />
     <TextField label="报警时间" source="DataTime"  />
     <AlarmField label="报警信息" addLabel={true}/>
    </SimpleShowLayout>
  </Show>
  );
};

const DeviceFilter = (props) => (
  <Filter {...props}>
    <TextInput label="搜索设备" source="DeviceId_q" />
    <SelectInput  label="报警等级"  source="warninglevel" choices={[
        { id: '高', name: '高' },
        { id: '中', name: '中' },
        { id: '低', name: '低' },
    ]} />
  </Filter>
)

const RealtimeAlarmRawList = (props) => (
  <List title={<RealtimeAlamTitle />} filters={<DeviceFilter />} {...props} sort={{field:'MessageTime',order:'DESC'}}>
    <Datagrid  bodyOptions={{ showRowHover: true }}>
      <TextField label="设备" source="DeviceId" />
      <TextField label="报警等级" source="warninglevel" />
      <TextField label="报警时间" source="DataTime"  />
      <AlarmField label="报警信息" />
      <ShowButton />
    </Datagrid>
  </List>
);

export {RealtimeAlarmRawList,RealtimeAlarmRawShow};
