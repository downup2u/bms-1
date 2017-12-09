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

const RealtimeAlamTitle = ({record}) => {
   return <span>实时报警</span>
};

const choices = [
  {_id:0,status:'OFF'},
  {_id:1,status:'ON'},
];

const RealtimeAlarmShow = (props) => {
  return (<Show title={<RealtimeAlamTitle />} {...props}>
    <TabbedForm>
      <FormTab label="基本信息">
        <TextField label="设备ID" source="DeviceId" />
        <NumberField label="数据包序号" source="SN" />
        <DateField label="采集时间" source="DataTime" />
        <DateField label="Gateway接受到数据时间" source="MessageTime" />
        <TextField label="ALARM" source="ALARM" />
        <NumberField label="ALARM_H" source="ALARM_H" />
        <NumberField label="ALARM_L" source="ALARM_L" />
        <TextField label="报警信息" source="ALARM_Text" />
        <TextField label="辅助诊断代码" source="Diagnostic_Text" />
        <NumberField label="生命信号" source="ALIV_ST_SW_HVS" />
      </FormTab>
      <FormTab title="设备信息">
        <NumberField label="KeyOn信号电压" source="KeyOnVoltage" />
        <NumberField label="BMU供电电压" source="PowerVoltage" />
        <NumberField label="交流充电供电电压" source="ChargeACVoltage" />
        <NumberField label="直流充电供电电压" source="ChargeDCVoltage" />
        <NumberField label="CC2检测电压" source="CC2Voltage" />
        <NumberField label="本次充电容量" source="ChargedCapacity" />
        <NumberField label="总充放电循环次数" source="TotalWorkCycle" />
        <NumberField label="BMU采的CSC功耗电流" source="CSC_Power_Current" />
        <NumberField label="单体最大SOC" source="BAT_MAX_SOC_HVS" />
        <NumberField label="单体最小SOC" source="BAT_MIN_SOC_HVS" />
        <NumberField label="系统权重SOC" source="BAT_WEI_SOC_HVS" />
        <NumberField label="充电需求电流" source="BAT_Chg_AmperReq" />
        <NumberField label="BPM24V,Uout电压采样" source="BPM_24V_Uout" />
        <NumberField label="CC2检测电压2" source="CC2Voltage_2" />
        <NumberField label="允许放电电流" source="BAT_Allow_Discharge_I" />
        <NumberField label="允许充电电流" source="BAT_Allow_charge_I" />
        <NumberField label="正极绝缘阻抗" source="BAT_ISO_R_Pos" />
        <NumberField label="负极绝缘阻抗" source="BAT_ISO_R_Neg" />
      </FormTab>
      <FormTab title="设备状态">
        <NumberField label="箱体测量电压（外侧）（正值为正向电压，负值为反向电压）" source="BAT_U_Out_HVS" />
        <NumberField label="箱体累计电压" source="BAT_U_TOT_HVS" />
        <NumberField label="箱体电流" source="BAT_I_HVS" />
        <NumberField label="真实SOC" source="BAT_SOC_HVS" />
        <NumberField label="SOH" source="BAT_SOH_HVS" />
        <NumberField label="最高单体电压" source="BAT_Ucell_Max" />
        <NumberField label="最低单体电压" source="BAT_Ucell_Min" />
        <NumberField label="平均单体电压" source="BAT_Ucell_Avg" />
        <NumberField label="最高单体电压所在CSC号" source="BAT_Ucell_Max_CSC" />
        <NumberField label="最高单体电压所在电芯位置" source="BAT_Ucell_Max_CELL" />
        <NumberField label="最低单体电压所在CSC号" source="BAT_Ucell_Min_CSC" />
        <NumberField label="最低单体电压所在电芯位置" source="BAT_Ucell_Min_CELL" />
        <NumberField label="最高单体温度" source="BAT_T_Max" />
        <NumberField label="最低单体温度" source="BAT_T_Min" />
        <NumberField label="平均单体温度" source="BAT_T_Avg" />
        <NumberField label="最高单体温度所在CSC号" source="BAT_T_Max_CSC" />
        <NumberField label="最低单体温度所在CSC号" source="BAT_T_Min_CSC" />
        <NumberField label="显示用SOC" source="BAT_User_SOC_HVS" />
        <NumberField label="继电器内侧电压（正值为正向电压，负值为反向电压）" source="BAT_U_HVS" />
        <SelectField label="空调继电器状态" source="ST_AC_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
        <SelectField label="附件继电器状态" source="ST_Aux_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
        <SelectField label="主负继电器状态" source="ST_Main_Neg_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
        <SelectField label="预充电继电器状态" source="ST_Pre_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
        <SelectField label="主正继电器状态" source="ST_Main_Pos_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
        <SelectField label="充电继电器状态" source="ST_Chg_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
        <SelectField label="风扇继电器状态" source="ST_Fan_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
        <SelectField label="加热继电器状态" source="ST_Heater_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
        <NumberField label="加热2继电器状态" source="ST_NegHeater_SW_HVS" />
        <NumberField label="无线充电继电器状态" source="ST_WirelessChg_SW" />
        <NumberField label="双枪充电继电器2" source="ST_SpearChg_SW_2" />
        <NumberField label="集电网充电继电器" source="ST_PowerGridChg_SW" />
      </FormTab>
    </TabbedForm>
  </Show>
  );
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

const RealtimeAlarmList = (props) => (
  <List title={<RealtimeAlamTitle />} {...props} sort={{field:'MessageTime',order:'DESC'}}>
    <Datagrid>
      <TextField label="设备" source="DeviceId" />
      <DateField label="采集时间" source="DataTime" showTime />
      <AlarmField label="报警信息" />
      <ShowButton />
    </Datagrid>
  </List>
);

export {RealtimeAlarmList,RealtimeAlarmShow};