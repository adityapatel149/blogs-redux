import { combineReducers } from "redux";
import usersReducer from "./usersReducer";
import postsReducer from "./postsReducer";

export default combineReducers({
    //dummy: () => 10
    posts: postsReducer,
    users: usersReducer
});
