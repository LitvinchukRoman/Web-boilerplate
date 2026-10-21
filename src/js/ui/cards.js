import { escapeHtml, setHtml } from './dom.js';

const initials = (name) => name.split(' ').map((part) => part[0]).join('.');

const avatar = ({ full_name: name, picture_large: picture }) => (picture
  ? `<img src="${escapeHtml(picture)}" alt="${escapeHtml(name)}">`
  : escapeHtml(initials(name)));

const card = (teacher, withSubject) => {
  const [firstName, ...lastName] = teacher.full_name.split(' ');
  const cardClass = teacher.favorite ? 'card card--favorite' : 'card';
  const avatarClass = teacher.picture_large ? 'card__avatar' : 'card__avatar card__avatar--initials';
  const subject = withSubject ? `<p class="card__subject">${escapeHtml(teacher.course)}</p>` : '';

  return `
    <li class="${cardClass}">
      <a class="${avatarClass}" href="#teacher-info" data-teacher-id="${escapeHtml(teacher.id)}">${avatar(teacher)}</a>
      <h3 class="card__name">${escapeHtml(firstName)}<br>${escapeHtml(lastName.join(' '))}</h3>
      ${subject}
      <p class="card__country">${escapeHtml(teacher.country)}</p>
    </li>`;
};

export const renderCards = (list, teachers, { withSubject = true, emptyText = 'No teachers found' } = {}) => {
  const html = teachers.length
    ? teachers.map((teacher) => card(teacher, withSubject)).join('')
    : `<li class="cards__empty">${emptyText}</li>`;
  setHtml(list, html);
};
