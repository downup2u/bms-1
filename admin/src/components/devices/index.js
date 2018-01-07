import React from 'react';
import { List, EmailField,RichTextInput } from 'admin-on-rest/lib/mui';
import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import { NumberInput,
  required,
  NumberField,
  Create,
  Edit,
  SimpleForm,
  DisabledInput,
  TextInput,
  ListButton,
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
import {CreateActions,EditActions} from '../controls/createeditactions';

const deviceDefaultValue = {created_at:new Date(),updated_at:new Date()};

const DeviceCreate = (props) => (
  <Create title="创建设备"  {...props} actions={<CreateActions />}>
    <SimpleForm defaultValue={deviceDefaultValue}>
      <TextInput label="设备" source="DeviceId" validate={required} />
    </SimpleForm>
  </Create>
);

const choices = [
  {_id:'A',status:'定位'},
  {_id:'V',status:'不定位'},
];

const DeviceEdit = (props) => {
  return (<Edit title="设备信息" {...props}  actions={<EditActions />}>
      <TabbedForm>
        <FormTab label="设备基本信息">
          <TextField label="设备ID" source="DeviceId"  validate={required} />
          <DateField label="创建时间" source="created_at" showTime />
          <DateField label="插入数据库时间" source="updated_at" showTime />
        </FormTab>
        <FormTab label="最近实时报警-基本信息">
          <TextField label="数据包序号" source="LastRealtimeAlarm.SN" />
          <DateField label="采集时间" source="LastRealtimeAlarm.DataTime" />
          <DateField label="Gateway接受到数据时间" source="LastRealtimeAlarm.MessageTime" />
          <TextField label="ALARM" source="LastRealtimeAlarm.ALARM" />
          <TextField label="ALARM_H" source="LastRealtimeAlarm.ALARM_H" />
          <TextField label="ALARM_L" source="LastRealtimeAlarm.ALARM_L" />
          <TextField label="报警信息" source="LastRealtimeAlarm.ALARM_Text" />
          <TextField label="辅助诊断代码" source="LastRealtimeAlarm.Diagnostic_Text" />
          <TextField label="生命信号" source="LastRealtimeAlarm.ALIV_ST_SW_HVS" />
        </FormTab>
        <FormTab label="最近实时报警-设备信息">
          <TextField label="KeyOn信号电压" source="LastRealtimeAlarm.KeyOnVoltage" />
          <TextField label="BMU供电电压" source="LastRealtimeAlarm.PowerVoltage" />
          <TextField label="交流充电供电电压" source="LastRealtimeAlarm.ChargeACVoltage" />
          <TextField label="直流充电供电电压" source="LastRealtimeAlarm.ChargeDCVoltage" />
          <TextField label="CC2检测电压" source="LastRealtimeAlarm.CC2Voltage" />
          <TextField label="本次充电容量" source="LastRealtimeAlarm.ChargedCapacity" />
          <TextField label="总充放电循环次数" source="LastRealtimeAlarm.TotalWorkCycle" />
          <TextField label="BMU采的CSC功耗电流" source="LastRealtimeAlarm.CSC_Power_Current" />
          <TextField label="单体最大SOC" source="LastRealtimeAlarm.BAT_MAX_SOC_HVS" />
          <TextField label="单体最小SOC" source="LastRealtimeAlarm.BAT_MIN_SOC_HVS" />
          <TextField label="系统权重SOC" source="LastRealtimeAlarm.BAT_WEI_SOC_HVS" />
          <TextField label="充电需求电流" source="LastRealtimeAlarm.BAT_Chg_AmperReq" />
          <TextField label="BPM24V,Uout电压采样" source="LastRealtimeAlarm.BPM_24V_Uout" />
          <TextField label="CC2检测电压2" source="LastRealtimeAlarm.CC2Voltage_2" />
          <TextField label="允许放电电流" source="LastRealtimeAlarm.BAT_Allow_Discharge_I" />
          <TextField label="允许充电电流" source="LastRealtimeAlarm.BAT_Allow_charge_I" />
          <TextField label="正极绝缘阻抗" source="LastRealtimeAlarm.BAT_ISO_R_Pos" />
          <TextField label="负极绝缘阻抗" source="LastRealtimeAlarm.BAT_ISO_R_Neg" />
        </FormTab>
        <FormTab label="最近实时报警-设备状态">
          <TextField label="箱体测量电压（外侧）（正值为正向电压，负值为反向电压）" source="LastRealtimeAlarm.BAT_U_Out_HVS" />
          <TextField label="箱体累计电压" source="LastRealtimeAlarm.BAT_U_TOT_HVS" />
          <TextField label="箱体电流" source="LastRealtimeAlarm.BAT_I_HVS" />
          <TextField label="真实SOC" source="LastRealtimeAlarm.BAT_SOC_HVS" />
          <TextField label="SOH" source="LastRealtimeAlarm.BAT_SOH_HVS" />
          <TextField label="最高单体电压" source="LastRealtimeAlarm.BAT_Ucell_Max" />
          <TextField label="最低单体电压" source="LastRealtimeAlarm.BAT_Ucell_Min" />
          <TextField label="平均单体电压" source="LastRealtimeAlarm.BAT_Ucell_Avg" />
          <TextField label="最高单体电压所在CSC号" source="LastRealtimeAlarm.BAT_Ucell_Max_CSC" />
          <TextField label="最高单体电压所在电芯位置" source="LastRealtimeAlarm.BAT_Ucell_Max_CELL" />
          <TextField label="最低单体电压所在CSC号" source="LastRealtimeAlarm.BAT_Ucell_Min_CSC" />
          <TextField label="最低单体电压所在电芯位置" source="LastRealtimeAlarm.BAT_Ucell_Min_CELL" />
          <TextField label="最高单体温度" source="LastRealtimeAlarm.BAT_T_Max" />
          <TextField label="最低单体温度" source="LastRealtimeAlarm.BAT_T_Min" />
          <TextField label="平均单体温度" source="LastRealtimeAlarm.BAT_T_Avg" />
          <TextField label="最高单体温度所在CSC号" source="LastRealtimeAlarm.BAT_T_Max_CSC" />
          <TextField label="最低单体温度所在CSC号" source="LastRealtimeAlarm.BAT_T_Min_CSC" />
          <TextField label="显示用SOC" source="LastRealtimeAlarm.BAT_User_SOC_HVS" />
          <TextField label="继电器内侧电压（正值为正向电压，负值为反向电压）" source="LastRealtimeAlarm.BAT_U_HVS" />
          <SelectField label="空调继电器状态" source="LastRealtimeAlarm.ST_AC_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
          <SelectField label="附件继电器状态" source="LastRealtimeAlarm.ST_Aux_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
          <SelectField label="主负继电器状态" source="LastRealtimeAlarm.ST_Main_Neg_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
          <SelectField label="预充电继电器状态" source="LastRealtimeAlarm.ST_Pre_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
          <SelectField label="主正继电器状态" source="LastRealtimeAlarm.ST_Main_Pos_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
          <SelectField label="充电继电器状态" source="LastRealtimeAlarm.ST_Chg_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
          <SelectField label="风扇继电器状态" source="LastRealtimeAlarm.ST_Fan_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
          <SelectField label="加热继电器状态" source="LastRealtimeAlarm.ST_Heater_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
          <TextField label="加热2继电器状态" source="LastRealtimeAlarm.ST_NegHeater_SW_HVS" />
          <TextField label="无线充电继电器状态" source="LastRealtimeAlarm.ST_WirelessChg_SW" />
          <TextField label="双枪充电继电器2" source="LastRealtimeAlarm.ST_SpearChg_SW_2" />
          <TextField label="集电网充电继电器" source="LastRealtimeAlarm.ST_PowerGridChg_SW" />
        </FormTab>
        <FormTab label="最近历史轨迹">
          <TextField label="设备状态" source="LastHistoryTrack.DeviceStatus" />
          <TextField label="主板温度，单位：摄氏度" source="LastHistoryTrack.ADC1" />
          <DateField label="接受数据时间" source="LastHistoryTrack.MessageTime" showTime />
          <TextField label="Position数据包序号" source="LastHistoryTrack.SN" />
          <SelectField label="GPS定位" source="LastHistoryTrack.GPSStatus" choices={choices} optionValue="_id" optionText="status" />
          <DateField label="定位的UTC时间" source="LastHistoryTrack.GPSTime" showTime />
          <TextField label="经度" source="LastHistoryTrack.Longitude" />
          <TextField label="纬度" source="LastHistoryTrack.Latitude" />
          <TextField label="速度" source="LastHistoryTrack.Speed" />
          <TextField label="航向" source="LastHistoryTrack.Course" />
          <TextField label="蜂窝Location Area Code" source="LastHistoryTrack.LAC" />
          <TextField label="蜂窝Cell Id" source="LastHistoryTrack.CellId" />
          <TextField label="海拔,单位：米" source="LastHistoryTrack.Altitude" />
          <TextField label="所在省" source="LastHistoryTrack.Province" />
          <TextField label="所在市" source="LastHistoryTrack.City" />
          <TextField label="所在区县" source="LastHistoryTrack.County" />
        </FormTab>
      </TabbedForm>
    </Edit>
    );
};

const DeviceShowActions = ({basePath,data,refresh}) => (
  <CardActions>
    <ListButton basePath={basePath} />
    <EditButton basePath={basePath} record={data} />
    <FlatButton primary label="Refresh" onClick={refresh} icon={<NavigationRefresh />} />
  </CardActions>
);

const DeviceFilter = (props) => (
  <Filter {...props}>
    <TextInput label="搜索设备" source="DeviceId_q" />
  </Filter>
)

const DeviceList = (props) => (
  <List title="设备管理" filters={<DeviceFilter />} sort={{field:'LastRealtimeAlarm.DataTime',order:'DESC'}} {...props}>
  {permissions =>
    <Datagrid  bodyOptions={{ showRowHover: true }}>
      <TextField label="设备ID" source="DeviceId" />
      <TextField label="设备类型" source="DeviceType"/>
      <TextField label="SN64" source="SN64"/>

      <DateField label="更新时间" source="LastRealtimeAlarm.DataTime" showTime />
      {permissions==='admin'?<EditButton />:null}
    </Datagrid>
  }
  </List>
);

export {DeviceCreate,DeviceList,DeviceEdit}
