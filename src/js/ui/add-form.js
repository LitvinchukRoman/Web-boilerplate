import { formatUsers, validateUser } from '../users.js';

const FIELDS = {
  full_name: { control: 'name', message: 'Name must start with a capital letter' },
  gender: { control: 'sex', message: 'Choose sex' },
  city: { control: 'city', message: 'City must start with a capital letter' },
  country: { control: 'country', message: 'Choose country' },
  age: { control: 'birthday', message: 'Enter date of birth' },
  phone: { control: 'phone', message: 'Phone does not match the country format' },
  email: { control: 'email', message: 'Enter a valid email' },
  note: { control: 'notes', message: 'Notes must start with a capital letter' },
};

const readTeacher = (form) => {
  const data = new FormData(form);
  const text = (field) => String(data.get(field) ?? '').trim();
  const birthday = text('birthday');

  const [teacher] = formatUsers([], [{
    id: crypto.randomUUID(),
    full_name: text('name'),
    course: text('speciality'),
    country: text('country'),
    city: text('city'),
    email: text('email'),
    phone: text('phone'),
    b_date: birthday ? new Date(birthday).toISOString() : null,
    gender: data.get('sex'),
    bg_color: text('color'),
    note: text('notes'),
  }]);
  return teacher;
};

const controlFor = (form, field) => form.querySelector(`[name="${FIELDS[field].control}"]`);

export const initAddForm = (form, onAdd) => {
  form.addEventListener('input', ({ target }) => {
    form.querySelectorAll(`[name="${target.name}"]`).forEach((control) => control.setCustomValidity(''));
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const teacher = readTeacher(form);
    const errors = validateUser(teacher).errors.filter((field) => field in FIELDS);

    if (errors.length) {
      errors.forEach((field) => controlFor(form, field).setCustomValidity(FIELDS[field].message));
      form.reportValidity();
      return;
    }

    onAdd(teacher);
    form.reset();
  });
};
