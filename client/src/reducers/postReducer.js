import {
  ADD_POST,
  GET_POSTS,
  GET_POST,
  DELETE_POST,
  POST_LOADING,
  GET_POST_LOADING
} from "../actions/types";

const initialState = {
  posts: [],
  post: {},
  loading: false,
  loadingPost: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case POST_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_POST_LOADING:
      return {
        ...state,
        loadingPost: true
      };
    case GET_POSTS:
      return {
        ...state,
        posts: action.payload,
        loading: false
      };
    case GET_POST:
      return {
        ...state,
        post: action.payload,
        loadingPost: false
      };
    case ADD_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts]
      };
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== action.payload)
      };
    default:
      return state;
  }
}
