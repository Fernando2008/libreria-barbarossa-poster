const UPDATE_CODE = "UPDATE_CODE";

export const updateCode = (newCode) => ({
  type: UPDATE_CODE,
  payload: newCode,
});

const initialState = {
  code: null,
};

const codeReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_CODE:
      return {
        ...state,
        code: action.payload.code,
      };
    default:
      return state;
  }
};

export default codeReducer;
