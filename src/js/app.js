/* eslint-disable no-console */
import { randomUserMock, additionalUsers } from './data/mock.js';
import {
  filterUsers,
  findUser,
  formatUsers,
  percentOf,
  sortUsers,
  validateUser,
} from './users.js';

const short = ({
  full_name: name, age, country, gender, favorite,
}) => ({
  name, age, country, gender, favorite,
});

const teachers = formatUsers(randomUserMock, additionalUsers);
console.log('1. Formatted users:', teachers.length, teachers);

const invalid = teachers
  .map((teacher) => ({ name: teacher.full_name, ...validateUser(teacher) }))
  .filter(({ isValid }) => !isValid);
console.log('2. Invalid users:', invalid);

console.log('3. Filter:', filterUsers(teachers, {
  country: 'Germany', gender: 'male', favorite: true,
}).map(short));
console.log('3. Filter by age range:', filterUsers(teachers, { age: { min: 18, max: 31 } }).map(short));

console.log('4. Sort by age desc:', sortUsers(teachers, 'age', 'desc').slice(0, 5).map(short));
console.log('4. Sort by name asc:', sortUsers(teachers, 'full_name').slice(0, 5).map(short));

console.log('5. Find "storm":', findUser(teachers, 'storm'));
console.log('5. Find age 46:', findUser(teachers, 46));

console.log('6. Older than 30, %:', percentOf(teachers, ({ age }) => age > 30));
