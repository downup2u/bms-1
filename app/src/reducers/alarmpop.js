import { createReducer } from 'redux-act';
import {
    ui_showprompt,
    set_promptdata,
    serverpush_alarm,
    serverpush_alarm_sz_result,
    logout_result
} from '../actions';


const initial = {
    alarmpop: {
        //全局提示
        showprompt: false,
        promptdata: [
        ],
        alaramraws:{

        }
    },
};

const alarmpop = createReducer({
    [serverpush_alarm]:(state,payload)=>{
      const promptdata = [payload];
      let alaramraws = {...state.alaramraws};
      alaramraws[payload.key] = payload;
      return {...state, promptdata ,alaramraws};
    },
    [serverpush_alarm_sz_result]:(state,payload)=>{
      const {list} = payload;
      const promptdata = [...list];
      return {...state, promptdata };
    },
    [set_promptdata]:(state,payload)=>{
        return {...state, promptdata:payload };
    },
    [logout_result]:(state,payload)=>{
      return {...initial.alarmpop};
    }
}, initial.alarmpop);

export default alarmpop;
