const popup = document.querySelector('#teacher-info');
const photo = popup.querySelector('.teacher-info__photo');
const star = popup.querySelector('.teacher-info__star');
const name = popup.querySelector('.teacher-info__name');
const subject = popup.querySelector('.teacher-info__subject');
const [place, person, contact, phone] = popup.querySelectorAll('.teacher-info__line');
const email = popup.querySelector('.teacher-info__email');
const about = popup.querySelector('.teacher-info__about');

const setText = (element, text) => Object.assign(element, { textContent: text, hidden: !text });

export const getShownTeacherId = () => popup.dataset.teacherId;

export const showTeacherInfo = (teacher) => {
  popup.dataset.teacherId = teacher.id;

  photo.hidden = !teacher.picture_large;
  photo.alt = teacher.full_name;
  if (teacher.picture_large) photo.src = teacher.picture_large;
  else photo.removeAttribute('src');

  star.classList.toggle('teacher-info__star--active', teacher.favorite);
  star.setAttribute('aria-pressed', teacher.favorite);

  setText(name, teacher.full_name);
  setText(subject, teacher.course);
  setText(place, [teacher.city, teacher.country].filter(Boolean).join(', '));
  setText(person, [teacher.age, teacher.gender].filter(Boolean).join(', '));
  setText(phone, teacher.phone ?? '');
  setText(about, teacher.note);

  email.textContent = teacher.email ?? '';
  email.href = teacher.email ? `mailto:${teacher.email}` : '';
  contact.hidden = !teacher.email;
};
