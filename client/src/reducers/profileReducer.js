import {
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_LOADING,
  GET_PROFILE_LOADING,
  CLEAR_CURRENT_PROFILE,
  GET_PROFILE_REPORT
} from "../actions/types";

const initialState = {
  profile: null,
  profiles: null,
  profileReport: null,
  loading: false,
  loadingProfile: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case PROFILE_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_PROFILE_LOADING:
      return {
        ...state,
        loadingProfile: true
      };
    case GET_PROFILE:
      return {
        ...state,
        profile: action.payload,
        loadingProfile: false
      };
    case GET_PROFILES:
      return {
        ...state,
        profiles: action.payload,
        loading: false
      };
    case GET_PROFILE_REPORT:
      return {
        ...state,
        profileReport: action.payload,
        loading: false
      };
    case CLEAR_CURRENT_PROFILE:
      return {
        ...state,
        profile: null
      };
    default:
      return state;
  }
}
