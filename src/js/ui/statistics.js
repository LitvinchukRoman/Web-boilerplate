import Chart from 'chart.js/auto';
import {
  countBy,
  find,
  mapValues,
  orderBy,
  pick,
  toPairs,
} from 'lodash-es';

const COLORS = [
  '#f99589', '#6fb7e9', '#f7c85c', '#7fcf9b', '#b49ae0', '#f39bc6',
  '#5cc6c0', '#f5a25d', '#9aa9bd', '#d4e06b', '#e07b7b', '#8c9ef0',
];

const AGE_GROUPS = [
  { max: 17, label: 'Under 18' },
  { max: 31, label: '18-31' },
  { max: 45, label: '32-45' },
  { max: Infinity, label: '46+' },
];

const GROUPS = {
  course: ({ course }) => course,
  age: ({ age }) => find(AGE_GROUPS, ({ max }) => age <= max)?.label,
  gender: ({ gender }) => gender,
  country: ({ country }) => country,
};

const COLUMNS = {
  full_name: { type: 'string', caption: 'Name' },
  course: { type: 'string', caption: 'Speciality' },
  age: { type: 'number', caption: 'Age' },
  gender: { type: 'string', caption: 'Gender' },
  country: { type: 'string', caption: 'Nationality' },
  city: { type: 'string', caption: 'City' },
  email: { type: 'string', caption: 'Email' },
  phone: { type: 'string', caption: 'Phone' },
};

const hierarchy = (field) => ({ uniqueName: field, caption: COLUMNS[field].caption });

const REPORTS = {
  countries: {
    slice: {
      rows: [hierarchy('country')],
      columns: [{ uniqueName: '[Measures]' }],
      measures: [
        { uniqueName: 'full_name', aggregation: 'count', caption: 'Teachers' },
        {
          uniqueName: 'age', aggregation: 'average', caption: 'Average age', format: 'age',
        },
      ],
    },
    formats: [{ name: 'age', decimalPlaces: 1 }],
    options: { grid: { type: 'compact', showHeaders: false }, showAggregationLabels: false },
  },
  flat: {
    slice: { rows: Object.keys(COLUMNS).map(hierarchy) },
    options: {
      grid: { type: 'flat', showHeaders: false, showGrandTotals: 'off' },
      showAggregationLabels: false,
    },
  },
};

const tabs = document.querySelectorAll('.stats-tabs__tab');
const chartPanel = document.querySelector('#stats-chart-panel');
const pivotPanel = document.querySelector('#stats-pivot-panel');
const groupSelect = document.querySelector('#stats-group');
const total = document.querySelector('#stats-total');

const chart = new Chart(document.querySelector('#stats-chart'), {
  type: 'pie',
  data: { labels: [], datasets: [{ data: [], backgroundColor: COLORS }] },
  options: {
    maintainAspectRatio: false,
    plugins: { legend: { position: 'right' } },
  },
});

let view = 'chart';
let pivot;
let pivotKey = '';
let data = { visible: [], all: [] };

const renderChart = (teachers) => {
  const counts = orderBy(toPairs(countBy(teachers, GROUPS[groupSelect.value])), [1], ['desc']);
  chart.data.labels = counts.map(([label]) => label);
  chart.data.datasets[0].data = counts.map(([, count]) => count);
  chart.update();
};

const pivotReport = (teachers) => ({
  ...REPORTS[view],
  dataSource: {
    data: [
      mapValues(COLUMNS, ({ type }) => ({ type })),
      ...teachers.map((teacher) => pick(teacher, Object.keys(COLUMNS))),
    ],
  },
});

const renderPivot = (teachers) => {
  const key = [view, ...teachers.map(({ id }) => id)].join();
  if (key === pivotKey) return;
  pivotKey = key;

  const report = pivotReport(teachers);
  if (pivot) {
    pivot.setReport(report);
  } else {
    pivot = new window.WebDataRocks({
      container: '#stats-pivot',
      toolbar: false,
      width: '100%',
      height: 480,
      report,
    });
  }
};

const update = () => {
  const teachers = view === 'flat' ? data.all : data.visible;

  tabs.forEach((tab) => tab.setAttribute('aria-selected', tab.dataset.view === view));
  chartPanel.hidden = view !== 'chart';
  pivotPanel.hidden = view === 'chart';
  total.textContent = `Total: ${teachers.length}`;

  if (view === 'chart') renderChart(teachers);
  else renderPivot(teachers);
};

tabs.forEach((tab) => tab.addEventListener('click', () => {
  view = tab.dataset.view;
  update();
}));

groupSelect.addEventListener('change', update);

export const renderStatistics = (visible, all) => {
  data = { visible, all };
  update();
};
