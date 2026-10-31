import { map as createMap, marker as createMarker, tileLayer } from 'leaflet';
import { daysUntilBirthday } from '../users.js';

const MAP_ZOOM = 5;
const TILES_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILES_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const popup = document.querySelector('#teacher-info');
const photo = popup.querySelector('.teacher-info__photo');
const star = popup.querySelector('.teacher-info__star');
const name = popup.querySelector('.teacher-info__name');
const subject = popup.querySelector('.teacher-info__subject');
const [place, person, birthday, contact, phone] = popup.querySelectorAll('.teacher-info__line');
const email = popup.querySelector('.teacher-info__email');
const about = popup.querySelector('.teacher-info__about');
const mapToggle = popup.querySelector('.teacher-info__map');
const mapView = popup.querySelector('.teacher-info__location');

let map;
let pin;
let shownPoint = null;

const setText = (element, text) => Object.assign(element, { textContent: text, hidden: !text });

const pointOf = ({ coordinates }) => {
  const { latitude, longitude } = coordinates ?? {};
  const point = [Number(latitude), Number(longitude)];
  return point.every(Number.isFinite) ? point : null;
};

const birthdayText = (date) => {
  const days = daysUntilBirthday(date);
  if (days === null) return '';
  if (days === 0) return 'Birthday is today!';
  return `${days} ${days === 1 ? 'day' : 'days'} until birthday`;
};

const showMap = (point) => {
  if (!map) {
    map = createMap(mapView);
    tileLayer(TILES_URL, { maxZoom: 19, attribution: TILES_ATTRIBUTION }).addTo(map);
    pin = createMarker(point).addTo(map);
  }
  map.invalidateSize();
  map.setView(point, MAP_ZOOM);
  pin.setLatLng(point);
};

const setMapOpen = (open) => {
  mapView.hidden = !open;
  mapToggle.setAttribute('aria-expanded', open);
  if (open) showMap(shownPoint);
};

mapToggle.addEventListener('click', () => setMapOpen(mapView.hidden));

export const getShownTeacherId = () => popup.dataset.teacherId;

export const showTeacherInfo = (teacher) => {
  const sameTeacher = popup.dataset.teacherId === teacher.id;
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
  setText(birthday, birthdayText(teacher.b_date));
  setText(phone, teacher.phone ?? '');
  setText(about, teacher.note);

  email.textContent = teacher.email ?? '';
  email.href = teacher.email ? `mailto:${teacher.email}` : '';
  contact.hidden = !teacher.email;

  shownPoint = pointOf(teacher);
  mapToggle.hidden = !shownPoint;
  setMapOpen(Boolean(sameTeacher && shownPoint && !mapView.hidden));
};
