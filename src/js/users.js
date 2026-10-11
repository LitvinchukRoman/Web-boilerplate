import {
  CAPITALIZED_FIELDS,
  COURSES,
  DEFAULT_BG_COLOR,
  DEFAULT_PHONE_FORMAT,
  EMAIL_FORMAT,
  PHONE_FORMATS,
} from './constants.js';

const capitalize = (value) => (value ? value[0].toUpperCase() + value.slice(1) : value);

const randomItem = (items) => items[Math.floor(Math.random() * items.length)];

const getAge = (date) => {
  if (!date) return null;
  const birth = new Date(date);
  const now = new Date();
  const age = now.getFullYear() - birth.getFullYear();
  const hadBirthday = now >= new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
  return hadBirthday ? age : age - 1;
};

const withoutEmpty = (user) => Object.fromEntries(
  Object.entries(user).filter(([, value]) => value !== null && value !== undefined),
);

const fromRandomUser = (user) => ({
  gender: user.gender,
  title: user.name.title,
  full_name: `${user.name.first} ${user.name.last}`,
  city: user.location.city,
  state: user.location.state,
  country: user.location.country,
  postcode: user.location.postcode,
  coordinates: user.location.coordinates,
  timezone: user.location.timezone,
  email: user.email,
  b_date: user.dob.date,
  age: user.dob.age,
  phone: user.phone,
  picture_large: user.picture.large,
  picture_thumbnail: user.picture.thumbnail,
  id: user.id.value ? `${user.id.name}${user.id.value}` : user.login.uuid,
});

const fromAdditionalUser = ({ b_day: birthday, ...user }) => ({
  ...user,
  b_date: user.b_date ?? birthday,
});

const mergeDuplicates = (users) => users.reduce((result, user) => {
  const duplicate = result.find(({ id, full_name: name }) => (
    id === user.id || name === user.full_name
  ));
  if (duplicate) {
    Object.assign(duplicate, withoutEmpty(user));
  } else {
    result.push({ ...user });
  }
  return result;
}, []);

const findCourse = (course) => COURSES.find((item) => item.toLowerCase() === course?.toLowerCase());

const normalize = (user) => ({
  ...user,
  gender: capitalize(user.gender),
  age: user.age ?? getAge(user.b_date),
  favorite: Boolean(user.favorite),
  course: findCourse(user.course) ?? randomItem(COURSES),
  bg_color: user.bg_color ?? DEFAULT_BG_COLOR,
  note: user.note ?? '',
});

export const formatUsers = (randomUsers, additionalUsers = []) => mergeDuplicates([
  ...randomUsers.map(fromRandomUser),
  ...additionalUsers.map(fromAdditionalUser),
]).map(normalize);

const isCapitalized = (value) => typeof value === 'string' && /^(?!\p{Ll})\p{L}/u.test(value);

const isValidPhone = (phone, country) => typeof phone === 'string'
  && (PHONE_FORMATS[country] ?? DEFAULT_PHONE_FORMAT).test(phone);

export const validateUser = (user) => {
  const errors = CAPITALIZED_FIELDS
    .filter((field) => !(field === 'note' && user.note === ''))
    .filter((field) => !isCapitalized(user[field]));

  if (!Number.isFinite(user.age)) errors.push('age');
  if (!isValidPhone(user.phone, user.country)) errors.push('phone');
  if (!EMAIL_FORMAT.test(user.email ?? '')) errors.push('email');

  return { isValid: errors.length === 0, errors };
};

const matches = (value, expected) => {
  if (typeof expected === 'object') {
    const { min = -Infinity, max = Infinity } = expected;
    return value >= min && value <= max;
  }
  if (typeof expected === 'string') {
    return String(value).toLowerCase() === expected.toLowerCase();
  }
  return value === expected;
};

export const filterUsers = (users, params) => users.filter((user) => Object.entries(params)
  .filter(([, expected]) => expected !== undefined && expected !== null)
  .every(([key, expected]) => matches(user[key], expected)));

const compare = (a, b) => {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a ?? '').localeCompare(String(b ?? ''));
};

export const sortUsers = (users, key, order = 'asc') => {
  const direction = order === 'desc' ? -1 : 1;
  return [...users].sort((a, b) => direction * compare(a[key], b[key]));
};

export const findUser = (users, query) => {
  if (typeof query === 'number') return users.find(({ age }) => age === query);
  const text = query.toLowerCase();
  return users.find(({ full_name: name, note }) => [name, note]
    .some((value) => value?.toLowerCase().includes(text)));
};

export const percentOf = (users, predicate) => {
  if (!users.length) return 0;
  return Math.round((users.filter(predicate).length / users.length) * 10000) / 100;
};
