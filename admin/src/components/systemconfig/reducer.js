export default (previousState = {
  warningrulelevel0:'',
  warningrulelevel1:'',
  warningrulelevel2:'',
  mappopfields:[],
  mapdetailfields:[]
}, { type, payload }) => {
    if (type === 'SYSTEM_SAVE_SUCCESS') {
        return {...previousState,...payload};
    }
    else if (type === 'SYSTEM_LOAD_SUCCESS') {
        return {...previousState,...payload};
    }
    return previousState;
}
