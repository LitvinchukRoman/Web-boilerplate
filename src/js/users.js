import dayjs from 'dayjs';
import {
  assign,
  every,
  filter,
  find,
  get,
  includes,
  isFinite,
  isNil,
  isNumber,
  isPlainObject,
  isString,
  omitBy,
  orderBy,
  reduce,
  reject,
  round,
  sample,
  some,
  toLower,
  uniqBy,
  upperFirst,
} from 'lodash-es';
import {
  CAPITALIZED_FIELDS,
  COURSES,
  DEFAULT_BG_COLOR,
  DEFAULT_PHONE_FORMAT,
  EMAIL_FORMAT,
  PHONE_FORMATS,
} from './constants.js';

const getAge = (date) => (date ? dayjs().diff(date, 'year') : null);

export const daysUntilBirthday = (date, today = dayjs()) => {
  const birth = dayjs(String(date ?? '').slice(0, 10));
  if (!birth.isValid()) return null;
  const start = today.startOf('day');
  const birthday = birth.year(start.year());
  const next = birthday.isBefore(start) ? birthday.add(1, 'year') : birthday;
  return next.diff(start, 'day');
};

const fromRandomUser = (user) => ({
  gender: user.gender,
  title: get(user, 'name.title'),
  full_name: `${get(user, 'name.first')} ${get(user, 'name.last')}`,
  city: get(user, 'location.city'),
  state: get(user, 'location.state'),
  country: get(user, 'location.country'),
  postcode: get(user, 'location.postcode'),
  coordinates: get(user, 'location.coordinates'),
  timezone: get(user, 'location.timezone'),
  email: user.email,
  b_date: get(user, 'dob.date'),
  age: get(user, 'dob.age'),
  phone: user.phone,
  picture_large: get(user, 'picture.large'),
  picture_thumbnail: get(user, 'picture.thumbnail'),
  id: get(user, 'id.value') ? `${user.id.name}${user.id.value}` : get(user, 'login.uuid'),
});

const fromAdditionalUser = ({ b_day: birthday, ...user }) => ({
  ...user,
  b_date: user.b_date ?? birthday,
});

const mergeInto = (base, users) => reduce(users, (result, user) => {
  const duplicate = find(result, ({ id, full_name: name }) => (
    id === user.id || name === user.full_name
  ));
  if (duplicate) {
    assign(duplicate, omitBy(user, isNil));
  } else {
    result.push({ ...user });
  }
  return result;
}, base);

const findCourse = (course) => find(COURSES, (item) => toLower(item) === toLower(course));

const normalize = (user) => ({
  ...user,
  gender: upperFirst(user.gender),
  age: user.age ?? getAge(user.b_date),
  favorite: Boolean(user.favorite),
  course: findCourse(user.course) ?? sample(COURSES),
  bg_color: user.bg_color ?? DEFAULT_BG_COLOR,
  note: user.note ?? '',
});

export const formatUsers = (randomUsers, additionalUsers = []) => mergeInto(
  uniqBy(randomUsers.map(fromRandomUser), 'id'),
  additionalUsers.map(fromAdditionalUser),
).map(normalize);

const isCapitalized = (value) => isString(value) && /^(?!\p{Ll})\p{L}/u.test(value);

const isValidPhone = (phone, country) => isString(phone)
  && get(PHONE_FORMATS, country, DEFAULT_PHONE_FORMAT).test(phone);

export const validateUser = (user) => {
  const errors = reject(
    CAPITALIZED_FIELDS,
    (field) => (field === 'note' && user.note === '') || isCapitalized(user[field]),
  );

  if (!isFinite(user.age)) errors.push('age');
  if (!isValidPhone(user.phone, user.country)) errors.push('phone');
  if (!EMAIL_FORMAT.test(user.email ?? '')) errors.push('email');

  return { isValid: errors.length === 0, errors };
};

const matches = (value, expected) => {
  if (isPlainObject(expected)) {
    const { min = -Infinity, max = Infinity } = expected;
    return value >= min && value <= max;
  }
  if (isString(expected)) return toLower(value) === toLower(expected);
  return value === expected;
};

export const filterUsers = (users, params) => {
  const active = omitBy(params, isNil);
  return filter(users, (user) => every(active, (expected, key) => matches(user[key], expected)));
};

const sortValue = (value) => (isString(value) ? toLower(value) : value);

export const sortUsers = (users, key, order = 'asc') => orderBy(
  users,
  [({ [key]: value }) => isNil(value), ({ [key]: value }) => sortValue(value)],
  ['asc', order],
);

const matchesQuery = (query) => {
  if (isNumber(query)) return ({ age }) => age === query;
  const text = toLower(query);
  return ({ full_name: name, note }) => some(
    [name, note],
    (value) => includes(toLower(value), text),
  );
};

export const findUser = (users, query) => find(users, matchesQuery(query));

export const searchUsers = (users, query) => filter(users, matchesQuery(query));

export const percentOf = (users, predicate) => {
  if (!users.length) return 0;
  return round((filter(users, predicate).length / users.length) * 100, 2);
};
