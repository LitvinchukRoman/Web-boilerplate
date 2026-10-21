const ENTITIES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ENTITIES[char]);

export const setHtml = (element, html) => {
  const range = document.createRange();
  range.selectNodeContents(element);
  element.replaceChildren(range.createContextualFragment(html));
};

export const renderOptions = (select, values, emptyLabel) => {
  const { value } = select;
  const option = (item, label) => `<option value="${escapeHtml(item)}">${escapeHtml(label)}</option>`;
  const options = values.map((item) => option(item, item));
  if (emptyLabel) options.unshift(option('', emptyLabel));
  setHtml(select, options.join(''));
  if (values.includes(value)) Object.assign(select, { value });
};
