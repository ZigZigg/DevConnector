import isEmpty from "../validation/is-empty";

import {
  SET_CURRENT_USER,
  USER_LOADING,
  GET_CURRENT_USER
} from "../actions/types";

const initialState = {
  isAuthenticated: false,
  user: {},
  userData: {},
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_CURRENT_USER:
      return {
        ...state,
        userData: action.payload
      };
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    default:
      return state;
  }
}
