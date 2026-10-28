export const COURSES = [
  'Mathematics',
  'Physics',
  'English',
  'Computer Science',
  'Dancing',
  'Chess',
  'Biology',
  'Chemistry',
  'Law',
  'Art',
  'Medicine',
  'Statistics',
];

export const RANDOM_USER_URL = 'https://randomuser.me/api/';
export const TEACHERS_URL = 'http://localhost:3000/teachers';
export const INITIAL_TEACHERS = 50;
export const LOAD_MORE_COUNT = 10;

export const DEFAULT_BG_COLOR = '#ffffff';

export const CAPITALIZED_FIELDS = ['full_name', 'gender', 'note', 'state', 'city', 'country'];

export const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EIGHT_DIGITS = /^\d{8}$/;
const BRACKETS_DASHES = /^\(\d{3}\)-\d{3}-\d{4}$/;

export const PHONE_FORMATS = {
  Australia: /^(0\d-\d{4}-\d{4}|04\d{2}-\d{3}-\d{3})$/,
  Brazil: /^\(\d{2}\) \d{4}-\d{4}$/,
  Canada: /^(\d{3}-\d{3}-\d{4}|[A-Z]\d{2} [A-Z]\d{2}-\d{4})$/,
  Denmark: EIGHT_DIGITS,
  Finland: /^(0\d-\d{3}-\d{3}|0\d{2}-\d{3}-\d{2}-\d{2})$/,
  France: /^0\d(-\d{2}){4}$/,
  Germany: /^0\d{3}-\d{7}$/,
  India: /^\d{10}$/,
  Iran: /^(0\d{2}-\d{8}|0\d{3}-\d{3}-\d{4})$/,
  Ireland: /^0\d{2}-\d{3}-\d{4}$/,
  Mexico: /^\(\d{3}\) \d{3} \d{4}$/,
  Netherlands: /^(\(\d{3}\)-\d{3}-\d{4}|\(\d{3}\) \d{7}|\(\d{4}\) \d{6})$/,
  'New Zealand': BRACKETS_DASHES,
  Norway: EIGHT_DIGITS,
  Serbia: /^0\d{2}-\d{4}-\d{3}$/,
  Spain: /^\d{3}-\d{3}-\d{3}$/,
  Switzerland: /^0\d{2} \d{3} \d{2} \d{2}$/,
  Turkey: BRACKETS_DASHES,
  Ukraine: /^(\+380\d{9}|\(\d{3}\) [A-Z\d]\d{2}-\d{4})$/,
  'United Kingdom': /^0\d{2,6}( \d{3,6}){1,2}$/,
  'United States': /^\(\d{3}\)[- ]\d{3}-\d{4}$/,
};

export const DEFAULT_PHONE_FORMAT = /^[\d\s()+-]{7,}$/;
