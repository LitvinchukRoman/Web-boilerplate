import { escapeHtml, setHtml } from './dom.js';

export const PAGE_SIZE = 10;
const VISIBLE_PAGES = 3;

const tbody = document.querySelector('#stats-body');
const pagination = document.querySelector('#stats-pagination');
const total = document.querySelector('#stats-total');
const headers = document.querySelectorAll('.stats th[data-sort]');

const row = (teacher) => {
  const cells = [teacher.full_name, teacher.course, teacher.age, teacher.gender, teacher.country];
  return `<tr>${cells.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`;
};

const pageLink = (page, label = page) => `<a class="pagination__item" href="#statistics" data-page="${page}">${label}</a>`;

const pageItems = (page, pages) => {
  const first = Math.max(1, Math.min(page - 1, pages - VISIBLE_PAGES + 1));
  const last = Math.min(pages, first + VISIBLE_PAGES - 1);
  const items = [];

  if (first > 1) items.push(pageLink(1, 'First'), '<span class="pagination__item pagination__item--dots">...</span>');
  for (let item = first; item <= last; item += 1) {
    items.push(item === page
      ? `<span class="pagination__item pagination__item--current">${item}</span>`
      : pageLink(item));
  }
  if (last < pages) items.push('<span class="pagination__item pagination__item--dots">...</span>', pageLink(pages, 'Last'));

  return items;
};

export const renderStatistics = (teachers, { page: requestedPage, sort }) => {
  const pages = Math.max(1, Math.ceil(teachers.length / PAGE_SIZE));
  const page = Math.min(requestedPage, pages);
  const start = (page - 1) * PAGE_SIZE;

  total.textContent = `Total: ${teachers.length}`;
  setHtml(tbody, teachers.slice(start, start + PAGE_SIZE).map(row).join(''));
  setHtml(pagination, pages > 1 ? pageItems(page, pages).join('') : '');

  headers.forEach((header) => {
    if (header.dataset.sort === sort.key) {
      header.setAttribute('aria-sort', sort.order === 'asc' ? 'ascending' : 'descending');
    } else {
      header.removeAttribute('aria-sort');
    }
  });
};
