import { createReducer } from 'redux-act';
import {
    ui_showprompt,
    set_promptdata,
    serverpush_alarm_sz_result
} from '../actions';


const initial = {
    alarmpop: {
        //全局提示
        showprompt: false,
        promptdata: [
        ],
    },
};

const alarmpop = createReducer({
    [serverpush_alarm_sz_result]:(state,payload)=>{
      const {list} = payload;
      const promptdata = [...list];
      return {...state, promptdata };
    },
    [set_promptdata]:(state,payload)=>{
        return {...state, promptdata:payload };
    }

}, initial.alarmpop);

export default alarmpop;
