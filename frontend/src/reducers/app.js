const TOGGLE_HAS_ERROR = "TOGGLE_HAS_ERROR";
const SET_ERROR_MESSAGE = "SET_ERROR_MESSAGE";

export const appReducerInitialState = {
  hasError: false,
  errorMessage: null,
};

const appReducer = (state, action) => {
  switch (action.type) {
    case TOGGLE_HAS_ERROR:
      return { ...state, hasError: action.payload };
    case SET_ERROR_MESSAGE:
      return { ...state, errorMessage: action.payload };
    default:
      return state;
  }
};

export default appReducer;
