import {
  RANDOM_USER_URL,
  TEACHERS_URL,
} from './constants.js';
import { formatUsers, validateUser } from './users.js';

export const fetchTeachers = async ({ count, page, seed }) => {
  const params = new URLSearchParams({ results: count, page });
  if (seed) params.set('seed', seed);

  const response = await fetch(`${RANDOM_USER_URL}?${params}`);
  if (!response.ok) throw new Error(`randomuser.me responded with ${response.status}`);

  const { results, info, error } = await response.json();
  if (!results) throw new Error(error ?? 'randomuser.me returned no users');

  const teachers = formatUsers(results);
  const valid = teachers.filter((teacher) => validateUser(teacher).isValid);

  return { teachers: valid, skipped: teachers.length - valid.length, seed: info.seed };
};

export const saveTeacher = async (teacher) => {
  const response = await fetch(TEACHERS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(teacher),
  });
  if (!response.ok) throw new Error(`json-server responded with ${response.status}`);
  return response.json();
};
