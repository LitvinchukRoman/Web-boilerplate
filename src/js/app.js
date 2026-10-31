import { COURSES, INITIAL_TEACHERS, LOAD_MORE_COUNT } from './constants.js';
import { fetchTeachers, saveTeacher } from './api.js';
import { filterUsers, searchUsers } from './users.js';
import { renderOptions } from './ui/dom.js';
import { renderCards } from './ui/cards.js';
import { getShownTeacherId, showTeacherInfo } from './ui/teacher-info.js';
import { renderStatistics } from './ui/statistics.js';
import { readFilters } from './ui/filters.js';
import { initAddForm } from './ui/add-form.js';

const state = {
  teachers: [],
  loaded: 0,
  seed: undefined,
  loading: false,
  query: '',
};

const filtersForm = document.querySelector('.filters');
const searchForm = document.querySelector('.search');
const teacherCards = document.querySelector('#teacher-cards');
const favoriteCards = document.querySelector('#favorite-cards');
const addForm = document.querySelector('#add-teacher-form');
const loadMore = document.querySelector('#load-more');
const statusLine = document.querySelector('#load-status');

const findTeacher = (id) => state.teachers.find((teacher) => teacher.id === id);

const showStatus = (message = '') => {
  statusLine.textContent = message;
  statusLine.hidden = !message;
};

const countries = () => [...new Set(['Ukraine', ...state.teachers.map(({ country }) => country)])]
  .filter(Boolean)
  .sort((a, b) => a.localeCompare(b));

const visibleTeachers = () => {
  const { params, withPhoto } = readFilters(filtersForm);
  return filterUsers(searchUsers(state.teachers, state.query), params)
    .filter((teacher) => !withPhoto || teacher.picture_large);
};

const render = () => {
  const teachers = visibleTeachers();

  renderOptions(filtersForm.elements.country, countries(), 'All');
  renderOptions(addForm.elements.country, countries());
  renderCards(teacherCards, teachers, {
    emptyText: state.loading && !state.teachers.length ? 'Loading teachers...' : 'No teachers found',
  });
  renderCards(favoriteCards, state.teachers.filter(({ favorite }) => favorite), {
    withSubject: false,
    emptyText: 'No favorites yet',
  });
  renderStatistics(teachers, state.teachers);

  loadMore.disabled = state.loading;
  loadMore.textContent = state.loading ? 'Loading...' : 'Show more';
};

const loadTeachers = async () => {
  if (state.loading) return;

  const count = state.loaded ? LOAD_MORE_COUNT : INITIAL_TEACHERS;
  state.loading = true;
  showStatus();
  render();

  try {
    const { teachers, skipped, seed } = await fetchTeachers({
      count,
      page: Math.floor(state.loaded / count) + 1,
      seed: state.seed,
    });
    const known = new Set(state.teachers.map(({ id }) => id));

    state.seed = seed;
    state.loaded += count;
    state.teachers.push(...teachers.filter(({ id }) => !known.has(id)));
    if (skipped) showStatus(`${skipped} invalid ${skipped === 1 ? 'user was' : 'users were'} skipped`);
  } catch (error) {
    showStatus('Could not load teachers. Check your connection and try again.');
  } finally {
    state.loading = false;
    render();
  }
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

document.querySelectorAll('.carousel__arrow').forEach((arrow) => {
  arrow.addEventListener('click', () => {
    const direction = arrow.classList.contains('carousel__arrow--prev') ? -1 : 1;
    const step = favoriteCards.firstElementChild?.offsetWidth ?? 0;
    favoriteCards.scrollBy({ left: direction * step, behavior: 'smooth' });
  });
});

loadMore.addEventListener('click', loadTeachers);

renderOptions(addForm.elements.speciality, COURSES);
initAddForm(addForm, async (teacher) => {
  try {
    await saveTeacher(teacher);
    showStatus();
  } catch (error) {
    showStatus('Teacher added locally: json-server is not running (npm run server).');
  }
  state.teachers.unshift(teacher);
  render();
  window.location.hash = 'close';
});

loadTeachers();
