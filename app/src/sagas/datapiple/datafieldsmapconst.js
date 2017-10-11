const datafieldsmap = {
  'DeviceId':'设备Id',
  'AL_Over_Ucell':'单体过压报警',
  'AL_Under_Ucell':'单体欠压报警',
  'AL_Over_Tcell':'单体过温报警',
  'AL_Under_Tcell':'单体低温报警',
  'AL_Over_U_HVS':'箱体过压报警',
  'AL_Under_U_HVS':'箱体欠压报警',
  'AL_Over_T_HVS':'极柱过温报警',
  'AL_Under_T_HVS':'极柱低温报警',
  'AL_Over_I_Chg':'充电过流报警',
  'AL_Over_I_Dchg':'放电过流报警',
  'AL_Over_SOC':'SOC过高报警',
  'AL_Under_SOC':'SOC过低报警',
  'AL_Diff_Upack':'Pack组压差过大',
  'AL_Isolation_R':'绝缘阻抗报警',
  'AL_dV_Ucell':'单体压差过大',
  'AL_dSOC':'SOC差异过大',
  'AL_Diff_Tcell':'单体温差过大',
  'AL_Diff_T_Env':'环境温差过大',
  'AL_Cool_Fan':'散热风扇故障',
  'AL_Pre_SW':'预充继电器故障',
  'AL_Main_SW':'主继电器故障',
  'AL_Chg_SW':'充电继电器故障',
  'AL_Fan_SW':'风扇继电器故障',
  'AL_Heater_SW':'加热继电器故障',
  'AL_Err_Mea_Ucell':'单体电压测量故障',
  'AL_Err_Mea_Tcell':'单体温度测量故障',
  'AL_Err_Mea_U_HVS':'箱体电压测量故障',
  'AL_Err_Mea_I_HVS':'箱体电流测量故障',
  'AL_Err_Others':'其他故障',
  'AL_Err_Mea_Isolation':'绝缘电阻测量故障',
  'AL_Err_Mea_T_Env':'环境温度测量故障',
  'AL_Err_FM3164':'铁电存储器故障',
  'AL_Err_EEPROM':'内部EEPROM故障',
  'AL_Err_RTC':'实时时钟故障',
  'AL_Err_LCAN':'内部通信故障',
  'AL_Err_Bal_Circuit':'均衡电路故障',
  'AL_Trouble_Code':'故障代码',
  'BAT_U_Out_HVS':'箱体测量电压(外侧)_(正值为正向电压，负值为反向电压)',
  'BAT_U_TOT_HVS':'箱体累加电压',
  'BAT_I_HVS':'箱体电流',
  'BAT_SOC_HVS':'真实SOC',
  'BAT_SOH_HVS':'SOH',
  'ALIV_ST_SW_HVS':'生命信号，0~15循环',
  'ST_AC_SW_HVS':'空调继电器状态',
  'ST_Aux_SW_HVS':'附件继电器状态',
  'ST_Main_Neg_SW_HVS':'主负继电器状态',
  'ST_Pre_SW_HVS':'预充电继电器状态',
  'ST_Main_Pos_SW_HVS':'主正继电器状态',
  'ST_Chg_SW_HVS':'充电继电器状态',
  'ST_Fan_SW_HVS':'风扇控制继电器状态',
  'ST_Heater_SW_HVS':'加热继电器状态',
  'BAT_U_HVS':'继电器内侧电压_(正值为正向电压，负值为反向电压)',
  'BAT_Allow_Discharge_I':'允许放电电流',
  'BAT_Allow_Charge_I':'允许充电电流',
  'BAT_ISO_R_Pos':'正极绝缘阻抗',
  'BAT_ISO_R_Neg':'负极绝缘阻抗',
  'BAT_Ucell_Max':'最高单体电压',
  'BAT_Ucell_Min':'最低单体电压',
  'BAT_Ucell_Max_CSC':'最高单体电压所在CSC号',
  'BAT_Ucell_Max_CELL':'最高单体电压所在电芯位置',
  'BAT_Ucell_Min_CSC':'最低单体电压所在CSC号',
  'BAT_Ucell_Min_CELL':'最低单体电压所在电芯位置',
  'BAT_T_Max':'最高单体温度',
  'BAT_T_Min':'最低单体温度',
  'BAT_T_Avg':'平均单体温度',
  'BAT_T_Max_CSC':'最高温度所在CSC号',
  'BAT_T_Min_CSC':'最低温度所在CSC号',
  'BAT_User_SOC_HVS':'显示用SOC',
  'BAT_Ucell_Avg':'平均单体电压',
  'KeyOnVoltage':'KeyOn信号电压',
  'PowerVoltage':'BMU供电电压',
  'ChargeACVoltage':'交流充电供电电压',
  'ChargeDCVoltage':'直流充电供电电压',
  'CC2Voltage':'CC2检测电压',
  'ChargedCapacity':'本次充电容量',
  'TotalWorkCycle':'总充放电循环次数',
  'CSC_Power_Current':'BMU采的CSC功耗电流',
  'BAT_MAX_SOC_HVS':'单体最大SOC',
  'BAT_MIN_SOC_HVS':'单体最小SOC',
  'BAT_WEI_SOC_HVS':'系统权重SOC',
  'BAT_Chg_AmperReq':'充电需求电流',
  'BPM_24V_Uout':'BPM24V，Uout电压采样',
  'ST_NegHeater_SW_HVS':'加热2继电器状态',
  'ST_WirelessChg_SW':'无线充电继电器状态',
  'ST_SpearChg_SW_2':'双枪充电继电器2',
  'ST_PowerGridChg_SW':'集电网充电继电器',
  'CC2Voltage_2':'CC2检测电压2',
};

export {
  datafieldsmap
};
