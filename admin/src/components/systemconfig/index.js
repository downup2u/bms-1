import React from 'react';
import {
    Datagrid,
    DateField,
    Create,
    EditButton,
    Filter,
    FormTab,
    List,
    NumberInput,
    ReferenceInput,
    ReferenceManyField,
    RichTextField,
    SelectInput,
    TabbedForm,
    TextField,
    TextInput,
    SimpleShowLayout,
    SelectArrayInput,
    ChipField,
    Edit as EditPage,
    Show as ShowPage,
    SimpleForm,
} from 'admin-on-rest/lib/mui';
import Chip from 'material-ui/Chip';
import ShowPageOne from '../singledocumentpage/index.js';
import {CfSelectArrayInputDetail,CfSelectArrayInput,CfAlaramRuleInput} from './cf.js';
import "./style.css";


const SystemconfigTitle = ({ record }) => <span>系统设置</span>;


const SystemconfigCreateTitle = ({ record }) => {
   return <span>新建 系统配置</span>;
};
 const SystemconfigCreate = (props) => (
       <Create {...props} title={<SystemconfigCreateTitle />} >
       <TabbedForm>
         <FormTab label="弹框信息">
          <CfSelectArrayInput label="选择弹框的字段列表" source="mappopfields"/>
          <CfSelectArrayInput label="选择聚合点弹框的字段列表" source="mappopclusterfields"/>
          <CfSelectArrayInputDetail label="编辑车辆详情显示字段列表" source="mapdetailfields"/>
       </FormTab>
       <FormTab label="报警规则">
       <CfAlaramRuleInput label="报警规则设置(高)" source="warningrulelevel0" />
       <CfAlaramRuleInput label="报警规则设置(中)" source="warningrulelevel1" />
       <CfAlaramRuleInput label="报警规则设置(低)" source="warningrulelevel2" />
         </FormTab>
       </TabbedForm>
       </Create>
);

 const SystemconfigEdit = (props) => (
    <EditPage {...props} title={<SystemconfigTitle />}>
        <TabbedForm>
        <FormTab label="弹框信息">
          <CfSelectArrayInput label="选择弹框的字段列表" source="mappopfields"/>
          <CfSelectArrayInput label="选择聚合点弹框的字段列表" source="mappopclusterfields"/>
          <CfSelectArrayInputDetail label="编辑车辆详情显示字段列表" source="mapdetailfields"/>
          </FormTab>
          <FormTab label="报警规则">
          <CfAlaramRuleInput label="报警规则设置(高)" source="warningrulelevel0" />
          <CfAlaramRuleInput label="报警规则设置(中)" source="warningrulelevel1" />
          <CfAlaramRuleInput label="报警规则设置(低)" source="warningrulelevel2" />
        </FormTab>
          </TabbedForm>
    </EditPage>
);

export const SystemconfigList = props => (
    <ShowPageOne Create={SystemconfigCreate} Edit={SystemconfigEdit} {...props}/>
);
