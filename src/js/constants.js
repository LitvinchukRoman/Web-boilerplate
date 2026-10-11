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

export const DEFAULT_BG_COLOR = '#ffffff';

export const CAPITALIZED_FIELDS = ['full_name', 'gender', 'note', 'state', 'city', 'country'];

export const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PARENTHESIZED = /^\(\d{3}\)-\d{3}-\d{4}$/;
const EIGHT_DIGITS = /^\d{8}$/;

export const PHONE_FORMATS = {
  Australia: /^(0\d-\d{4}-\d{4}|04\d{2}-\d{3}-\d{3})$/,
  Canada: /^\d{3}-\d{3}-\d{4}$/,
  Denmark: EIGHT_DIGITS,
  Finland: /^(0\d-\d{3}-\d{3}|0\d{2}-\d{3}-\d{2}-\d{2})$/,
  France: /^0\d(-\d{2}){4}$/,
  Germany: /^0\d{3}-\d{7}$/,
  Iran: /^(0\d{2}-\d{8}|0\d{3}-\d{3}-\d{4})$/,
  Ireland: /^0\d{2}-\d{3}-\d{4}$/,
  Netherlands: PARENTHESIZED,
  'New Zealand': PARENTHESIZED,
  Norway: EIGHT_DIGITS,
  Spain: /^\d{3}-\d{3}-\d{3}$/,
  Switzerland: /^0\d{2} \d{3} \d{2} \d{2}$/,
  Turkey: PARENTHESIZED,
  'United States': PARENTHESIZED,
};

export const DEFAULT_PHONE_FORMAT = /^[\d\s()+-]{7,}$/;
