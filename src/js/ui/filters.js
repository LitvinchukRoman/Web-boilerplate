const parseRange = (value) => {
  if (!value) return undefined;
  const [min, max] = value.split('-');
  return { min: Number(min), max: max ? Number(max) : Infinity };
};

export const readFilters = (form) => {
  const data = new FormData(form);
  return {
    params: {
      age: parseRange(data.get('age')),
      country: data.get('country') || undefined,
      gender: data.get('gender') || undefined,
      favorite: data.has('favorite') || undefined,
    },
    withPhoto: data.has('photo'),
  };
};
