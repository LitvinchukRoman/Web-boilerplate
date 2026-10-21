import { randomUserMock, additionalUsers } from './data/mock.js';
import { COURSES } from './constants.js';
import {
  filterUsers,
  formatUsers,
  searchUsers,
  sortUsers,
} from './users.js';
import { renderOptions } from './ui/dom.js';
import { renderCards } from './ui/cards.js';
import { getShownTeacherId, showTeacherInfo } from './ui/teacher-info.js';
import { renderStatistics } from './ui/statistics.js';
import { readFilters } from './ui/filters.js';
import { initAddForm } from './ui/add-form.js';

const state = {
  teachers: formatUsers(randomUserMock, additionalUsers),
  query: '',
  sort: { key: 'full_name', order: 'asc' },
  page: 1,
};

const filtersForm = document.querySelector('.filters');
const searchForm = document.querySelector('.search');
const teacherCards = document.querySelector('#teacher-cards');
const favoriteCards = document.querySelector('#favorite-cards');
const addForm = document.querySelector('#add-teacher-form');

const findTeacher = (id) => state.teachers.find((teacher) => teacher.id === id);

const countries = () => [...new Set(['Ukraine', ...state.teachers.map(({ country }) => country)])]
  .filter(Boolean)
  .sort((a, b) => a.localeCompare(b));

const visibleTeachers = () => {
  const { params, withPhoto } = readFilters(filtersForm);
  return filterUsers(searchUsers(state.teachers, state.query), params)
    .filter((teacher) => !withPhoto || teacher.picture_large);
};

const render = () => {
  renderOptions(filtersForm.elements.country, countries(), 'All');
  renderOptions(addForm.elements.country, countries());
  renderCards(teacherCards, visibleTeachers());
  renderCards(favoriteCards, state.teachers.filter(({ favorite }) => favorite), {
    withSubject: false,
    emptyText: 'No favorites yet',
  });
  renderStatistics(sortUsers(state.teachers, state.sort.key, state.sort.order), state);
};

document.addEventListener('click', (event) => {
  const link = event.target.closest('[data-teacher-id]');
  if (link) showTeacherInfo(findTeacher(link.dataset.teacherId));
});

document.querySelector('.teacher-info__star').addEventListener('click', () => {
  const teacher = findTeacher(getShownTeacherId());
  if (!teacher) return;
  teacher.favorite = !teacher.favorite;
  showTeacherInfo(teacher);
  render();
});

filtersForm.addEventListener('change', render);

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = searchForm.elements.q.value.trim();
  state.query = /^\d+$/.test(value) ? Number(value) : value;
  render();
  document.querySelector('#teachers').scrollIntoView();
});

searchForm.elements.q.addEventListener('input', ({ target }) => {
  if (target.value || !state.query) return;
  state.query = '';
  render();
});

document.querySelector('.stats thead').addEventListener('click', (event) => {
  const header = event.target.closest('[data-sort]');
  if (!header) return;
  const { sort } = header.dataset;
  const order = state.sort.key === sort && state.sort.order === 'asc' ? 'desc' : 'asc';
  state.sort = { key: sort, order };
  state.page = 1;
  render();
});

document.querySelector('#stats-pagination').addEventListener('click', (event) => {
  const link = event.target.closest('[data-page]');
  if (!link) return;
  state.page = Number(link.dataset.page);
  render();
});

document.querySelectorAll('.carousel__arrow').forEach((arrow) => {
  arrow.addEventListener('click', () => {
    const direction = arrow.classList.contains('carousel__arrow--prev') ? -1 : 1;
    const step = favoriteCards.firstElementChild?.offsetWidth ?? 0;
    favoriteCards.scrollBy({ left: direction * step, behavior: 'smooth' });
  });
});

renderOptions(addForm.elements.speciality, COURSES);
initAddForm(addForm, (teacher) => {
  state.teachers.push(teacher);
  render();
  window.location.hash = 'close';
});

render();
