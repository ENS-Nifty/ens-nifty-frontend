// -- Constants ------------------------------------------------------------- //
const REGISTER_UPDATE_INPUT = 'notification/REGISTER_UPDATE_INPUT';

// -- Actions --------------------------------------------------------------- //
export const registerUpdateInput = (input = '') => dispatch => {
  dispatch({ type: REGISTER_UPDATE_INPUT, payload: input });
};

export const registerSubmitTransactions = () => dispatch => {};

// -- Reducer --------------------------------------------------------------- //
const INITIAL_STATE = {
  input: ''
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REGISTER_UPDATE_INPUT:
      return {
        ...state,
        input: action.payload
      };
    default:
      return state;
  }
};
