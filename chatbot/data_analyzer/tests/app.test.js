const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const Papa = require('../vendor/papaparse.min.js');

class FakeElement {
  constructor(isFragment = false) {
    this.isFragment = isFragment;
    this.children = [];
    this.listeners = new Map();
    this.dataset = {};
    this.attributes = {};
    this.value = '';
    this.hidden = false;
    this.disabled = false;
    this.checked = false;
    this._textContent = null;
    this._innerHTML = '';
  }

  addEventListener(type, listener) {
    const listeners = this.listeners.get(type) || [];
    listeners.push(listener);
    this.listeners.set(type, listeners);
  }

  focus() {}

  querySelectorAll() {
    return [];
  }

  setAttribute(name, value) {
    this.attributes[name] = value;
  }

  append(...nodes) {
    this.children.push(...nodes);
  }

  replaceChildren(...nodes) {
    this.children = nodes.flatMap(node => node.isFragment ? node.children : [node]);
    this._textContent = null;
  }

  set textContent(value) {
    this._textContent = String(value);
    this.children = [];
  }

  get textContent() {
    if (this._textContent !== null) return this._textContent;
    return this.children.map(child => child.textContent).join('');
  }

  set innerHTML(value) {
    this._innerHTML = String(value);
    this.children = [];
  }

  get innerHTML() {
    return this._innerHTML;
  }
}

function loadApp() {
  const html = fs.readFileSync(path.join(__dirname, '..', 'Data.html'), 'utf8');
  const scriptStart = html.lastIndexOf('<script>');
  const scriptEnd = html.indexOf('</script>', scriptStart);
  const elements = new Map();
  const listeners = [];
  const storage = new Map();
  const media = {
    matches: false,
    addEventListener(type, listener) {
      if (type === 'change') listeners.push(listener);
    }
  };
  const document = {
    documentElement: { dataset: {} },
    querySelector(selector) {
      if (!elements.has(selector)) elements.set(selector, new FakeElement());
      return elements.get(selector);
    },
    createElement() {
      return new FakeElement();
    },
    createDocumentFragment() {
      return new FakeElement(true);
    }
  };
  class FakeChart {
    constructor(canvas, config) {
      this.canvas = canvas;
      this.config = config;
      this.options = config.options;
      this.width = 640;
      this.height = 420;
    }

    destroy() {}
    zoom() {}
    resetZoom() {}
    update() {}
    toBase64Image() { return 'data:image/png;base64,'; }
  }
  class FakePdf {
    constructor() {
      this.lines = [];
      this.pages = 1;
      this.internal = { pageSize: { getWidth: () => 210, getHeight: () => 297 }, getNumberOfPages: () => this.pages };
    }

    setFont() {}
    setFontSize() {}
    addImage() { this.lines.push('Chart image'); }
    text(value) { this.lines.push(Array.isArray(value) ? value.join(' ') : value); }
    splitTextToSize(value) { return [value]; }
    addPage() { this.pages += 1; }
    setPage() {}
  }
  const context = {
    console,
    document,
    window: { matchMedia: () => media, Chart: FakeChart, Papa, jspdf: { jsPDF: FakePdf } },
    Chart: FakeChart,
    Papa,
    localStorage: {
      getItem(key) { return storage.get(key) ?? null; },
      setItem(key, value) { storage.set(key, value); }
    },
    getComputedStyle: () => ({ getPropertyValue: () => '#000000' }),
    URL: { createObjectURL: () => 'blob:test', revokeObjectURL() {} },
    Blob,
    atob: value => Buffer.from(value, 'base64').toString('binary')
  };
  vm.createContext(context);
  vm.runInContext(html.slice(scriptStart + '<script>'.length, scriptEnd), context);
  return {
    context,
    elements,
    listeners,
    media,
    storage,
    run(code) { return vm.runInContext(code, context); }
  };
}

test('parses CSV headers and values', () => {
  const app = loadApp();
  const rows = app.run("parse('Month,Value\\nJan,12\\nFeb,18')");
  assert.deepEqual(JSON.parse(JSON.stringify(rows)), [
    { Month: 'Jan', Value: '12' },
    { Month: 'Feb', Value: '18' }
  ]);
});

test('provides usable monthly, regional, and product-mix examples', () => {
  const app = loadApp();
  const result = JSON.parse(app.run(`JSON.stringify(Object.entries(SAMPLES).map(([name,text])=>({name,rows:parse(text).length})))`));
  assert.deepEqual(result, [
    { name: 'monthly', rows: 12 },
    { name: 'regional', rows: 4 },
    { name: 'mix', rows: 4 }
  ]);
});

test('loads the analysis tools with a complete dataset preview', () => {
  const app = loadApp();
  app.run('loadRows(parse(SAMPLES.monthly))');
  assert.equal(app.elements.get('#previewTable tbody').children.length, 12);
  assert.match(app.elements.get('#previewPageStatus').textContent, /Showing 1-12 of 12 records/);
  assert.equal(app.elements.get('#runPivot').disabled, false);
  assert.equal(app.elements.get('#runKpi').disabled, false);
  assert.match(app.elements.get('#qualitySummary').textContent, /0 missing cells/);
});

test('reports date-ordered recent changes and largest increases and decreases', () => {
  const app = loadApp();
  app.run(`
    S.rows=[
      {Period:'2025-01',Sales:'10'},
      {Period:'2025-02',Sales:'20'},
      {Period:'2025-03',Sales:'15'},
      {Period:'2025-04',Sales:'30'}
    ];
    S.typeOverrides={};
    inspect();
    S.cfg={x:'Period',ys:['Sales'],type:'line',title:'',xLabel:'Period',yLabel:'',palette:'Studio',legend:true,colors:{series:{},slices:{}}};
    S.filterText='';
    updateReport(null);
  `);
  const summary = app.elements.get('#sum').textContent;
  assert.match(summary, /Recent period-over-period changes for Sales/);
  assert.match(summary, /Largest increase: Sales rose by 15/);
  assert.match(summary, /Largest decrease: Sales fell by 5/);
  assert.match(summary, /Latest period: Sales increased from 2025-03 \(15\) to 2025-04 \(30\)/);
});

test('data-quality warnings include concrete next steps', () => {
  const app = loadApp();
  app.run(`
    S.rows=[{Group:'A',Revenue:'10'},{Group:'B',Revenue:''},{Group:'C',Revenue:'bad'}];
    S.typeOverrides={Revenue:'num'};
    inspect();
    S.cfg={x:'Group',ys:['Revenue'],type:'bar',title:'',xLabel:'Group',yLabel:'',palette:'Studio',legend:true,colors:{series:{},slices:{}}};
    updateReport(null);
  `);
  const checks = app.elements.get('#chk').textContent;
  assert.match(checks, /Revenue: 1 missing value/);
  assert.match(checks, /Inspect affected rows in Data preview/);
  assert.match(checks, /Revenue: 1 non-numeric value/);
  assert.match(checks, /correct the values or change the column type/);
});

test('PDF report includes chart, summaries, quality checks, filter, and date', () => {
  const app = loadApp();
  app.run(`
    S.rows=[{Group:'A',Amount:'10'},{Group:'B',Amount:'15'}];
    S.typeOverrides={};
    inspect();
    S.cfg={x:'Group',ys:['Amount'],type:'bar',title:'Revenue',xLabel:'Group',yLabel:'Amount',palette:'Studio',legend:true,colors:{series:{},slices:{}}};
    S.filterText='North';
    updateReport(null);
  `);
  const pdf = new app.context.window.jspdf.jsPDF();
  app.context.buildPdfReport(pdf, { width: 640, height: 420, toBase64Image: () => 'data:image/png;base64,' });
  const report = pdf.lines.join('\n');
  assert.match(report, /Chart image/);
  assert.match(report, /Generated:/);
  assert.match(report, /Chart filter: "North"/);
  assert.match(report, /Dataset summary/);
  assert.match(report, /Chart and observations/);
  assert.match(report, /Data quality and next steps/);
  assert.match(report, /Page 1 of/);
});

test('searches all preview columns and sorts numeric values', () => {
  const app = loadApp();
  app.run(`
    S.rows=[{Name:'Alpha',Count:'12'},{Name:'Beta',Count:'3'},{Name:'Gamma',Count:'8'}];
    S.cols=[{name:'Name',type:'cat'},{name:'Count',type:'num'}];
    S.preview={query:'',sort:'Count',direction:1,page:0,pageSize:10};
    renderPreview();
  `);
  let rows = app.elements.get('#previewTable tbody').children;
  assert.equal(rows[0].children[0].textContent, 'Beta');
  app.run("S.preview.query='gam'; S.preview.page=0; renderPreview()");
  rows = app.elements.get('#previewTable tbody').children;
  assert.equal(rows.length, 1);
  assert.equal(rows[0].children[0].textContent, 'Gamma');
});

test('evaluates Excel lookup, summary, conditional, text, and dynamic-array functions against dataset ranges', () => {
  const app = loadApp();
  app.run(`
    S.rows=[
      {Region:'North',Amount:'10',Code:'A1'},
      {Region:'South',Amount:'20',Code:'B2'},
      {Region:'North',Amount:'30',Code:'A3'}
    ];
    inspect();
  `);
  const formulas = JSON.parse(app.run(`JSON.stringify([
    calculateFormula('=XLOOKUP("South",A:A,B:B)'),
    calculateFormula('=VLOOKUP("South",A1:C4,2,FALSE)'),
    calculateFormula('=HLOOKUP("Amount",A1:C4,2,FALSE)'),
    calculateFormula('=INDEX(B:B,3)'),
    calculateFormula('=MATCH("South",A:A,0)'),
    calculateFormula('=SUM(B:B)'),
    calculateFormula('=SUMIF(A:A,"North",B:B)'),
    calculateFormula('=SUMIFS(B:B,A:A,"North")'),
    calculateFormula('=COUNT(B:B)'),
    calculateFormula('=COUNTA(A:A)'),
    calculateFormula('=COUNTIF(A:A,"North")'),
    calculateFormula('=COUNTIFS(A:A,"North",B:B,">10")'),
    calculateFormula('=AVERAGE(B:B)'),
    calculateFormula('=AVERAGEIF(A:A,"North",B:B)'),
    calculateFormula('=AVERAGEIFS(B:B,A:A,"North")'),
    calculateFormula('=IF(B2:B4>15,"high","low")'),
    calculateFormula('=IFERROR(1/0,42)'),
    calculateFormula('=TEXTJOIN(", ",TRUE,A2:A4)'),
    calculateFormula('=FILTER(A2:B4,B2:B4>10)'),
    calculateFormula('=UNIQUE(A2:A4)'),
    calculateFormula('=SORT(A2:B4,2,-1)'),
    calculateFormula('=LEFT(C2:C4,1)'),
    calculateFormula('=RIGHT(C2:C4,1)'),
    calculateFormula('=MID(C2:C4,2,1)')
  ])`));
  assert.deepEqual(formulas, [
    '20', '20', '10', '20', 3, 60, 40, 40, 3, 4, 2, 1,
    20, 20, 20, ['low', 'high', 'high'], 42, 'North, South, North',
    [['South', '20'], ['North', '30']], ['North', 'South'],
    [['North', '30'], ['South', '20'], ['North', '10']],
    ['A', 'B', 'A'], ['1', '2', '3'], ['1', '2', '3']
  ]);
});

test('runs formulas from the data preview and renders the result', () => {
  const app = loadApp();
  app.run(`
    S.rows=[{Region:'North',Amount:'12'},{Region:'South',Amount:'18'}];
    inspect();
    updateFormulaColumns();
    $('#formulaInput').value='=SUM(B:B)';
    runFormula();
  `);
  assert.equal(app.elements.get('#formulaColumns').textContent, 'A: Region · B: Amount');
  assert.equal(app.elements.get('#formulaStatus').textContent, 'Result: 30');
  assert.equal(app.elements.get('#formulaOutput').hidden, false);
  assert.equal(app.elements.get('#formulaTable tbody').textContent, '30');
});

test('selects dataset cells as Excel ranges within the current page', () => {
  const app = loadApp();
  app.run(`
    S.rows=Array.from({length:25},(_,index)=>({Region:'Region '+index,Amount:String(index)}));
    inspect();
    renderPreview();
    selectDatasetCell(2,0);
    selectDatasetCell(5,1,true);
  `);
  assert.equal(app.elements.get('#previewTable tbody').children.length, 20);
  assert.equal(app.run('formatCellRange(S.cellSelection)'), 'A4:B7');
  assert.equal(app.elements.get('#cellSelectionHint').textContent, 'Selected A4:B7. Choose an Excel function to use this selection.');
  assert.equal(app.elements.get('#previewTable tbody').children[2].children[0].attributes['data-selected'], 'true');
  assert.equal(app.elements.get('#previewTable tbody').children[5].children[1].attributes['data-selected'], 'true');
});

test('shows 20 records per page and restores pagination after search', () => {
  const app = loadApp();
  app.run(`
    S.rows=Array.from({length:25},(_,index)=>({Region:'Region '+index,Amount:String(index)}));
    S.cols=[{name:'Region',type:'cat'},{name:'Amount',type:'num'}];
    renderPreview();
    S.preview.page=1;
    renderPreview();
    S.preview.query='Region 2';
    $('#previewSearch').value='Region 2';
    S.preview.page=0;
    renderPreview();
  `);
  assert.equal(app.elements.get('#previewTable tbody').children.length, 6);
  assert.equal(app.elements.get('#previewStatus').textContent, 'Showing 6 matching of 25 total records.');
  const showAll = app.elements.get('#showAllRecords');
  assert.equal(showAll.disabled, false);
  showAll.listeners.get('click')[0]();
  assert.equal(app.elements.get('#previewTable tbody').children.length, 20);
  assert.equal(app.elements.get('#previewStatus').textContent, 'Showing 25 total records.');
  assert.equal(app.elements.get('#previewPageStatus').textContent, 'Showing 1-20 of 25 records · Page 1 of 2');
  const next = app.elements.get('#previewNext');
  assert.equal(next.disabled, false);
  next.listeners.get('click')[0]();
  assert.equal(app.elements.get('#previewTable tbody').children.length, 5);
  assert.equal(app.elements.get('#previewTable tbody').children[4].children[0].textContent, 'Region 24');
  assert.equal(app.elements.get('#previewPageStatus').textContent, 'Showing 21-25 of 25 records · Page 2 of 2');
  assert.equal(app.elements.get('#previewPrevious').disabled, false);
  assert.equal(showAll.disabled, true);
});

test('clicking a function asks for a range and writes row-wise results into the dataset preview', () => {
  const app = loadApp();
  app.run(`
    S.rows=[{Region:'North',Amount:'12'},{Region:'South',Amount:'18'}];
    inspect();
    updateFormulaColumns();
  `);
  const clickFunction = name => app.elements.get('#excelFunctionList').listeners.get('click')[0]({
    target: { closest: () => ({ dataset: { excelFunction: name } }) }
  });
  clickFunction('IF');
  assert.equal(app.elements.get('#formulaBuilder').hidden, false);
  assert.equal(app.elements.get('#formulaBuilderTitle').textContent, 'Run IF');
  app.run(`
    $('#formulaRange').value='B2:B3>15';
    $('#formulaArguments').value='"High", "Low"';
    runSelectedFunction();
  `);
  assert.equal(app.elements.get('#formulaStatus').textContent, 'IF result added to the dataset preview.');
  assert.equal(app.elements.get('#previewTable thead').children[0].children[2].textContent, 'IF result');
  assert.deepEqual(
    app.elements.get('#previewTable tbody').children.map(row => row.children[2].textContent),
    ['Low', 'High']
  );
  assert.equal(app.run("Object.hasOwn(S.rows[0],'IF result')"), false);
});

test('builds grouped pivot summaries for multiple grouping columns', () => {
  const app = loadApp();
  app.run(`
    S.rows=[
      {Region:'North',Month:'Jan',Revenue:'10'},
      {Region:'North',Month:'Jan',Revenue:'15'},
      {Region:'South',Month:'Feb',Revenue:'20'}
    ];
    inspect();
    $('#pivotGroup1').value='Region';
    $('#pivotGroup2').value='Month';
    $('#pivotMeasure').value='Revenue';
    $('#pivotAggregate').value='sum';
    buildPivot();
  `);
  assert.deepEqual(JSON.parse(app.run('JSON.stringify(S.pivotResult)')), {
    headers: ['Region', 'Month', 'Sum of Revenue'],
    rows: [['North', 'Jan', 25], ['South', 'Feb', 20]],
    groupColumns: ['Region', 'Month'],
    measure: 'Revenue',
    operation: 'sum'
  });
  assert.equal(app.elements.get('#pivotStatus').textContent, '2 groups summarized from 3 records.');
});

test('previews, applies, and undoes safe data quality fixes', () => {
  const app = loadApp();
  app.run(`
    S.rows=[
      {Region:' North ',Revenue:'10'},
      {Region:'north',Revenue:'20'},
      {Region:'North',Revenue:'20'}
    ];
    inspect();
    $('#fixTrim').checked=true;
    $('#fixCategories').checked=true;
    $('#fixDuplicates').checked=true;
    prepareQualityFixes();
  `);
  assert.equal(app.run('S.fixPreview.rows.length'), 2);
  assert.equal(app.elements.get('#fixPreview').hidden, false);
  app.run('applyQualityFixes()');
  assert.equal(app.run('S.rows.length'), 2);
  assert.deepEqual(JSON.parse(app.run('JSON.stringify(S.rows.map(row=>row.Region))')), ['North', 'North']);
  assert.equal(app.elements.get('#undoFixes').disabled, false);
  app.run('undoQualityFixes()');
  assert.equal(app.run('S.rows.length'), 3);
  assert.equal(app.run("S.rows[0].Region"), ' North ');
});

test('calculates KPI cards and group comparisons', () => {
  const app = loadApp();
  app.run(`
    S.rows=[
      {Region:'North',Revenue:'10'},
      {Region:'North',Revenue:'15'},
      {Region:'South',Revenue:'30'}
    ];
    inspect();
    $('#kpiMeasure').value='Revenue';
    $('#kpiGroup').value='Region';
    updateComparisonOptions();
    $('#kpiCompareA').value='North';
    $('#kpiCompareB').value='South';
    calculateKpis();
  `);
  assert.match(app.elements.get('#kpiCards').textContent, /Total55/);
  assert.match(app.elements.get('#kpiCards').textContent, /Top groupSouth \(30\)/);
  assert.equal(app.elements.get('#kpiStatus').textContent, 'North vs South: 25 vs 30; difference -5 (-16.67% vs baseline).');
});

test('answers guided analysis questions with grouped evidence', () => {
  const app = loadApp();
  app.run(`
    S.rows=[{Region:'North',Revenue:'10'},{Region:'South',Revenue:'25'}];
    inspect();
    $('#guidedQuestion').value='highest';
    $('#guidedMeasure').value='Revenue';
    runGuidedAnalysis();
  `);
  assert.equal(app.elements.get('#guidedAnswer').textContent, 'South has the highest total Revenue: 25.');
  assert.equal(app.elements.get('#guidedTable tbody').children.length, 2);
});

test('saves and reopens a project and exports formula results with the dataset', () => {
  const app = loadApp();
  app.run(`
    S.rows=[{Region:'North',Revenue:'10'},{Region:'South',Revenue:'20'}];
    S.typeOverrides={};
    inspect();
    S.rec=auto();
    S.cfg=makeConfig(S.rec);
    S.formulaColumn={name:'Adjusted',values:[15,25]};
    $('#pivotGroup1').value='Region';
    $('#pivotMeasure').value='Revenue';
    $('#pivotAggregate').value='sum';
    download=(name,content,type)=>{saved={name,content,type}};
    saveAnalysisProject();
  `);
  const project = JSON.parse(app.run('saved.content'));
  assert.equal(project.format, 'plotline-analysis');
  assert.deepEqual(project.formulaColumn.values, [15, 25]);
  app.run('savedProject=JSON.parse(saved.content)');
  app.run("S.rows=[];loadAnalysisProject(savedProject)");
  assert.equal(app.run('S.rows.length'), 2);
  assert.deepEqual(JSON.parse(app.run('JSON.stringify(analyzedRows())')), [
    { Region: 'North', Revenue: '10', Adjusted: 15 },
    { Region: 'South', Revenue: '20', Adjusted: 25 }
  ]);
  app.run(`
    XLSX={utils:{
      book_new:()=>({sheets:[]}),
      json_to_sheet:rows=>({rows}),
      aoa_to_sheet:rows=>({rows}),
      book_append_sheet:(book,sheet,name)=>book.sheets.push({name,sheet})
    },writeFile:(book,name)=>{exportedWorkbook={book,name}}};
    window.XLSX=XLSX;
    exportAnalyzedWorkbook();
  `);
  assert.equal(app.run('exportedWorkbook.name'), 'plotline-analyzed-data.xlsx');
  assert.deepEqual(JSON.parse(app.run('JSON.stringify(exportedWorkbook.book.sheets.map(sheet=>sheet.name))')), ['Analyzed data', 'Pivot summary']);
  assert.deepEqual(JSON.parse(app.run('JSON.stringify(exportedWorkbook.book.sheets[0].sheet.rows)')), [
    { Region: 'North', Revenue: '10', Adjusted: 15 },
    { Region: 'South', Revenue: '20', Adjusted: 25 }
  ]);
});

test('filters chart rows and preserves multi-word input until cleared', () => {
  const app = loadApp();
  app.run(`
    S.rows=[{City:'New York',Amount:'10'},{City:'York',Amount:'15'}];
    S.typeOverrides={};
    inspect();
    S.rec={x:'City',ys:['Amount'],type:'bar',why:'Test recommendation'};
    S.cfg=makeConfig(S.rec);
    $('#chartFilter').value='New York';
    setChartFilter($('#chartFilter').value,false);
  `);
  assert.equal(app.run('S.filterText'), 'New York');
  assert.equal(app.elements.get('#chartFilter').value, 'New York');
  assert.match(app.elements.get('#sum').textContent, /Showing 1 of 2 rows matching "New York"/);
  app.run("setChartFilter('',true)");
  assert.equal(app.run('visibleRows().length'), 2);
  assert.equal(app.elements.get('#clearChartFilter').disabled, true);
});

test('checks chart compatibility and honors manual type overrides', () => {
  const app = loadApp();
  app.run(`
    S.rows=[{Group:'A',Amount:'10',Change:'-2'},{Group:'B',Amount:'15',Change:'3'}];
    S.typeOverrides={};
    inspect();
  `);
  assert.equal(app.run("chartIssue('scatter','Group',['Amount'])"), 'Scatter charts need a numeric X axis.');
  assert.equal(app.run("chartIssue('scatter','Amount',['Change'])"), '');
  assert.match(app.run("chartIssue('pie','Group',['Change'])"), /non-negative/);
  app.run("S.typeOverrides.Amount='cat'; inspect()");
  assert.equal(app.run("S.cols.find(column=>column.name==='Amount').type"), 'cat');
});

test('follows system theme until the user saves a preference', () => {
  const app = loadApp();
  assert.equal(app.context.document.documentElement.dataset.theme, 'light');
  app.listeners[0]({ matches: true });
  assert.equal(app.context.document.documentElement.dataset.theme, 'dark');
  app.elements.get('#themeToggle').listeners.get('click')[0]();
  assert.equal(app.context.document.documentElement.dataset.theme, 'light');
  assert.equal(app.storage.get('plotline-theme'), 'light');
  app.listeners[0]({ matches: true });
  assert.equal(app.context.document.documentElement.dataset.theme, 'light');
});

test('applies compatible chart settings and rejects incompatible settings', () => {
  const app = loadApp();
  app.run(`
    S.rows=[{Group:'A',Amount:'10'},{Group:'B',Amount:'15'}];
    S.typeOverrides={};
    inspect();
    S.rec=auto();
    S.cfg=makeConfig(S.rec);
  `);
  app.run(`
    S.typeOverrides.Group='cat';
    S.cfg.title='Saved chart';
    S.cfg.xLabel='Group name';
    S.cfg.colors.series.Amount='#123456';
    download=(name,content,type)=>{savedSettings={name,content,type}};
    saveChartSettings();
  `);
  const saved = JSON.parse(app.run('savedSettings.content'));
  assert.equal(app.run('savedSettings.name'), 'plotline-settings.json');
  assert.equal(saved.columnTypes.Group, 'cat');
  assert.equal(Object.hasOwn(saved, 'rows'), false);
  const settings = saved;
  app.context.applyChartSettings(settings);
  assert.equal(app.run('S.cfg.title'), 'Saved chart');
  assert.equal(app.run('S.cfg.colors.series.Amount'), '#123456');
  assert.throws(() => app.context.applyChartSettings({
    ...settings,
    config: { ...settings.config, x: 'missing' }
  }), /columns that are not in the current dataset/);
  assert.equal(app.run('S.cfg.title'), 'Saved chart');
});
