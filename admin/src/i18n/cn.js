export default {
  pos:{
    configuration: '偏好',
    language:'语言',
    theme: {
        name: '皮肤',
        light: 'Clair',
        dark: 'Obscur',
    },
  },
  resources: {
    systemconfig:{
      name: '系统设置 |||| 系统设置',
      notification:{
        'save_success':'保存成功',
        'save_error':'保存失败'
      }
    },
    organization:{
      name: '组织 |||| 组织',
    },
    device:{
      name: '设备管理 |||| 设备管理',
    },
    devicegroup:{
      name: '设备分组管理 |||| 设备分组管理',
      fields:{
        deviceids:'设备列表',
      }
    },
    user:{
      name: '用户管理 |||| 用户管理',
      notification:{
        resetuserpassword_success:'重置密码成功',
        resetuserpassword_failed:'重置密码失败',
      }
    },
    role:{
      name: '角色管理 |||| 角色管理',
      fields:{
        organizationid:'所在组织',
      }
    },
    usergroup:{
      name: '用户分组管理 |||| 用户分组管理',
      fields:{
        organizationid:'所在组织',
      }
    },
    permission:{
      name: '权限管理 |||| 权限管理',
    },
    realtimealarm:{
      name:'实时报警管理 |||| 实时报警管理',
    },
    historytrack:{
      name: '历史轨迹管理 |||| 历史轨迹管理',
    },
    historydevice:{
      name: '设备历史数据管理 |||| 设备历史数据管理',
    },
    canrowdata:{
      name: '原始数据管理 |||| 原始数据管理',
    },
    userlog:{
      name: '用户日志管理 |||| 用户日志管理',
    },
    datadict:{
      name: '数据字典维护 |||| 数据字典维护',
    }
  }

};
