/*
 * HomeConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const CHANGE_USERNAME = 'boilerplate/Home/CHANGE_USERNAME';
export const LOAD_MEMES = 'boilerplate/Home/LOAD_MEMES';
export const LOAD_MEMES_SUCCESS = 'boilerplate/Home/LOAD_MEMES_SUCCESS';
export const LIKE_DISLIKE = 'boilerplate/Home/LIKE_DISLIKE';
export const UPDATE_MEME_AFTER_LIKE = 'boilerplate/Home/UPDATE_MEME_AFTER_LIKE';
export const REMOVE_POST = 'boilerplate/Home/REMOVE_POST';
export const REMOVE_POST_CDN_FAIL = 'boilerplate/Home/REMOVE_POST_CDN_FAIL';
export const REMOVE_POST_DB = 'boilerplate/Home/REMOVE_POST_DB';
export const REMOVE_POST_DB_FAIL = 'boilerplate/Home/REMOVE_POST_DB_FAIL';
export const REMOVE_POST_SUCCESS = 'boilerplate/Home/REMOVE_POST_SUCCESS';
export const REPORT_MEME_SLIDE = 'boilerplate/Home/REPORT_MEME_SLIDE';
export const REPORT_MEME_SLIDE_SUCCESS =
  'boilerplate/Home/REPORT_MEME_SLIDE_SUCCESS';
