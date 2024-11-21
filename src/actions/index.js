import _ from "lodash";
import jsonPlaceholder from "../api/jsonPlaceholder";

/*
export const fetchPosts = async () => {
    // BAD APPROACH !!!!
    // also, 1. Error: Actions must be plain objects. use custom middleware for async actions
    //          when our code is converted to ES2015 by babel,
    //          the asyn await syntax makes it INITIALLY return jsonPlaceholder.get('/posts').
    //          this is a request object, not a plain js object.
    // 2. By the time our action gets to a reducer, we won't have fetched our data
    const response = await jsonPlaceholder.get("/posts");

    return {
        type: "FETCH_POSTS",
        payload: response
    };
};
*/

//redux-thunk allows us to return an action or a function from an action creator. THATS IT. only has 14 lines of source code.
//it will return a function with dispatch and getState as arguments and invoke it.
//after our request is completed, we have to manually call the dispatch function with a new action

/*
export const fetchPosts = () => {
    return async function(dispatch, getState) {
        const response = await jsonPlaceholder.get("/posts");

        dispatch({ type: "FETCH_POSTS", payload: response });
    };
};
*/

// REFACTORED
//1. only returning something in function, so got rid of curly braces and return keyword
//2. not using getState, so not passing it, and we have only one argument so removed paranthesis around it

export const fetchPostsAndUsers = () => async (dispatch, getState) => {
    await dispatch(fetchPosts()); //fetchPosts() will be executed, and returns a function. we will dispatch this returned function, which will go through redux thunk. it will invoke the function and dispatch an action with type 'FETCH_POSTS'
    //now we need to wait for the action to fetch results and dispatch. so add await keyword.
    const userIds = _.uniq(_.map(getState().posts, "userId")); //lodash's map function has some extra properties. this will takeout userId from the array of posts
    userIds.forEach(id => dispatch(fetchUser(id)));

    /* ORRRR for cleaner look,
     _.chain(getState().posts)
        .map('userId')
        .uniq()
        .forEach(id => dispatch(fetchUser(id)))
        .value()
    */
};

export const fetchPosts = () => async dispatch => {
    const response = await jsonPlaceholder.get("/posts");
    dispatch({ type: "FETCH_POSTS", payload: response.data });
};

export const fetchUser = id => async dispatch => {
    //_fetchUser(id, dispatch); for memoized version
    const response = await jsonPlaceholder.get(`/users/${id}`);
    dispatch({ type: "FETCH_USER", payload: response.data });
};

/*
    if we memoize action, we return a function everytime and it gets invoked, so overfetching again.
    if we memoize inner function(the async dispatch function), our action is creating the function everytime it is called.
    so even if it is memoized, it is creating a new one, so it will be executed for first time every time

    so we will fetch in other function, memoize it, and use it in our action creator

// using _ before function says it is a "private" function and other developers should not call it unless they know what theyre doing


        const _fetchUser = _.memoize(async (id, dispatch) => {
            const response = await jsonPlaceholder.get(`/users/${id}`);
            dispatch({ type: "FETCH_USER", payload: response.data });
        });


    we are memoizing as we are fetching same user 10 times from api. 100 posts with 10 users with 10 posts each
    so a memoized function runs the first time, and everytime it receives the same arguments, it does not execute the function.
    it returns again whatever it returned before

// ONE MINOR ISSUE, if user is updated, we will not see that in our app, as memoized function wont execute again, and will keep returning old value
// so only use if fetched data will remain unchanged

*/
