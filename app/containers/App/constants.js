/*
 * AppConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const LOAD_REPOS = 'boilerplate/App/LOAD_REPOS';
export const LOAD_REPOS_SUCCESS = 'boilerplate/App/LOAD_REPOS_SUCCESS';
export const LOAD_REPOS_ERROR = 'boilerplate/App/LOAD_REPOS_ERROR';
export const SET_USER_PROFILE = 'boilerplate/App/SET_USER_PROFILE';
export const CHANGE_DRAWER_OPEN = 'boilerplate/App/CHANGE_DRAWER_OPEN';
export const USER_LOGIN = 'boilerplate/Home/USER_LOGIN';
export const USER_LOGIN_SUCCESS = 'boilerplate/Home/USER_LOGIN_SUCCESS';
export const USER_DB_ERROR = 'boilerplate/Home/USER_DB_ERROR';
export const USER_DB_FOUND = 'boilerplate/Home/USER_DB_FOUND';
export const USER_DB_NOT_FOUND = 'boilerplate/Home/USER_DB_NOT_FOUND';
