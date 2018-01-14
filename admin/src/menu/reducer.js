import {
    SEL_MENU,
} from './action';

export default (previousState = {
  curmenu:'systemconfig'
}, { type, payload }) => {
    if (type === SEL_MENU) {
        return {...previousState,curmenu:payload};
    }
    return previousState;
}
