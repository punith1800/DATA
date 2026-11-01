<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, viewport-fit=cover"
    />
    <title> Plotline: chart bot</title>
    <link rel="icon" type="image/svg+xml" href="./favicon.svg" />    <link rel="apple-touch-icon" href="./favicon.svg" />
    <style>
      :root {
        --bg: #0b1118;
        --panel: #131d28;
        --ink: #e8edf4;
        --mute: #a1adbc;
        --line: #2a3747;
        --acc: #6c8cff;
        --on: #0f1620;
        --warn: #ffad78;
        --grid: #314052;
        color-scheme: dark;
        box-sizing: border-box;
        padding-top: env(safe-area-inset-top, 0px);
        padding-bottom: env(safe-area-inset-bottom, 0px);
      }

      @media (prefers-color-scheme: dark) {
        :root:not([data-theme="light"]) {
          --bg: #0f1620;
          --panel: #171f2b;
          --ink: #e8edf4;
          --mute: #93a0b2;
          --line: #2a3444;
          --acc: #6c8cff;
          --on: #0f1620;
          --warn: #f0a263;
          --grid: #263041;
        }
      }

      :root[data-theme="dark"] {
        --bg: #0f1620;
        --panel: #171f2b;
        --ink: #e8edf4;
        --mute: #93a0b2;
        --line: #2a3444;
        --acc: #6c8cff;
        --on: #0f1620;
        --warn: #f0a263;
        --grid: #263041;
      }

      :root[data-theme="light"] {
        --bg: #f3f6f8;
        --panel: #ffffff;
        --ink: #1b2633;
        --mute: #586879;
        --line: #c9d2dc;
        --acc: #315bd6;
        --on: #ffffff;
        --warn: #a64418;
        --grid: #d9e0e7;
        color-scheme: light;
      }

      html {
        scroll-padding-top: env(safe-area-inset-top, 0px);
      }

      *,
      *::before,
      *::after {
        box-sizing: inherit;
      }

      body {
        margin: 0;
        background: var(--bg);
        color: var(--ink);
        font: 15px/1.5 "Schibsted Grotesk", system-ui, sans-serif;
      }

      .app {
        max-width: 1520px;
        margin: 0 auto;
        padding: 20px 16px 40px;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .brand-mark {
        width: 42px;
        height: 42px;
        display: block;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(93, 122, 255, 0.24);
        background: rgba(255, 255, 255, 0.03);
      }

      header h1 {
        font-size: 26px;
        margin: 0;
        letter-spacing: -0.02em;
      }

      header p {
        margin: 4px 0 20px;
        color: var(--mute);
        max-width: 60ch;
      }

      .header-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      .theme-toggle {
        flex: 0 0 auto;
      }

      main {
        display: grid;
        grid-template-columns: minmax(0, 280px) minmax(0, 1fr);
        gap: 20px;
        align-items: start;
      }

      @media (max-width: 900px) {
        main {
          grid-template-columns: minmax(0, 1fr);
        }
      }

      .card {
        background: var(--panel);
        border: 1px solid var(--line);
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 16px;
      }

      h2 {
        font-size: 15px;
        margin: 0 0 10px;
      }

      textarea,
      input:not([type="checkbox"]):not([type="color"]),
      select {
        width: 100%;
        font: inherit;
        color: var(--ink);
        background: var(--bg);
        border: 1px solid var(--line);
        border-radius: 8px;
        padding: 8px 10px;
      }

      textarea {
        resize: vertical;
        font-family: ui-monospace, Menlo, monospace;
        font-size: 13px;
      }

      button {
        font: inherit;
        cursor: pointer;
        border: 1px solid var(--line);
        background: var(--panel);
        color: var(--ink);
        border-radius: 8px;
        padding: 7px 12px;
      }

      button.pri {
        background: var(--acc);
        color: var(--on);
        border-color: var(--acc);
        font-weight: 600;
      }

      button:disabled {
        cursor: not-allowed;
        opacity: 0.55;
      }

      :focus-visible {
        outline: 2px solid var(--acc);
        outline-offset: 2px;
      }

      .row {
        display: flex;  
        gap: 8px;
        flex-wrap: wrap;
        margin-top: 10px;
        align-items: center;
      }

      .row > input:not([type="checkbox"]):not([type="color"]) {
        flex: 1;
        min-width: 0;
        width: auto;
      }

      .sample-controls label {
        flex: 1;
        min-width: 180px;
        margin-top: 0;
      }

      .sample-controls button {
        flex: 0 0 auto;
      }

      .privacy-note {
        border-top: 1px solid var(--line);
        padding-top: 10px;
        margin-top: 14px;
      }

      label {
        display: block;
        font-size: 13px;
        color: var(--mute);
        margin-top: 10px;
      }

      label input:not([type="checkbox"]):not([type="color"]),
      label select {
        margin-top: 4px;
      }

      .two {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }

      .seg {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 6px;
        margin-bottom: 4px;
      }

      .seg button[aria-pressed="true"] {
        background: var(--acc);
        color: var(--on);
        border-color: var(--acc);
      }

      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 4px;
      }

      .chips label {
        display: flex;
        align-items: center;
        gap: 6px;
        margin: 0;
        padding: 4px 8px;
        border: 1px solid var(--line);
        border-radius: 999px;
        color: var(--ink);
      }

      .chips input[type="color"] {
        width: 20px;
        height: 20px;
        padding: 0;
        border: 0;
        background: none;
      }

      .color-choices {
        max-height: 150px;
        overflow-y: auto;
      }

      .type-overrides {
        max-height: 180px;
        overflow-y: auto;
      }

      .type-overrides label {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 120px;
        align-items: center;
        gap: 8px;
        margin: 0;
        padding: 4px 0;
      }

      .type-overrides select {
        margin: 0;
        padding: 5px 7px;
      }

      .chk {
        display: flex;
        align-items: center;
        gap: 6px;
        align-self: end;
      }

      .preview-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }

      .preview-toolbar label {
        flex: 1;
        min-width: 180px;
      }

      .preview-table-wrap {
        max-height: none;
        overflow-x: auto;
        overflow-y: visible;
        border: 1px solid var(--line);
        border-radius: 8px;
      }

      .preview-table {
        width: 100%;
        min-width: 520px;
        border-collapse: collapse;
        text-align: left;
      }

      .preview-table th,
      .preview-table td {
        padding: 8px 10px;
        border-bottom: 1px solid var(--line);
        max-width: 280px;
        overflow-wrap: anywhere;
      }

      .preview-table th {
        position: sticky;
        top: 0;
        z-index: 1;
        background: var(--panel);
        white-space: nowrap;
      }

      .preview-table th button {
        border: 0;
        background: transparent;
        padding: 2px 0;
        font-weight: 600;
      }

      .preview-table tbody tr:last-child td {
        border-bottom: 0;
      }

      #previewTable tbody td {
        cursor: crosshair;
        user-select: none;
      }

      #previewTable tbody td[data-selected="true"] {
        background: color-mix(in srgb, var(--acc) 24%, var(--panel));
        box-shadow: inset 0 0 0 1px var(--acc);
      }

      .cv {
        position: relative;
        height: 680px;
        margin-top: 8px;
      }

      .chart-card {
        padding: 28px;
      }

      .chart-workspace {
        display: grid;
        grid-template-columns: minmax(0, 1.9fr) minmax(260px, 340px);
        gap: 18px;
        align-items: start;
      }

      .chart-workspace #ctl {
        margin-bottom: 16px;
      }

      .chart-heading {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 16px;
      }

      .chart-heading h2 {
        font-size: 18px;
        margin: 0;
      }

      .chart-heading p {
        margin: 0 0 0 auto;
        text-align: right;
      }

      .chart-filter label {
        flex: 1;
        min-width: 180px;
        margin-top: 0;
      }

      .chart-filter button {
        flex: 0 0 auto;
      }

      @media (max-width: 600px) {
        .sample-controls button {
          width: 100%;
        }

        .chart-card {
          padding: 16px;
        }

        .cv {
          height: 420px;
        }

        .chart-heading {
          display: block;
        }

        .chart-heading p {
          margin-top: 4px;
          text-align: left;
        }
      }

      @media (max-width: 760px) {
        .chart-workspace {
          grid-template-columns: minmax(0, 1fr);
        }
      }

      #zoomControls,
      #exp {
        padding-top: 12px;
        border-top: 1px solid var(--line);
      }

      #exp > span {
        font-weight: 600;
      }

      .excel-function-list {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 6px;
        padding: 0;
        list-style: none;
      }

      .excel-function-list li {
        margin: 0;
      }

      .excel-function-list button {
        width: 100%;
        padding: 5px 7px;
        font-size: 12px;
      }

      .kpi-value {
        display: grid;
        gap: 4px;
        min-width: 120px;
        padding: 10px;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: var(--bg);
      }

      .kpi-value span {
        color: var(--ink);
      }

      ul {
        margin: 0 0 14px;
        padding-left: 18px;
      }

      li {
        margin: 4px 0;
      }

      .mute {
        color: var(--mute);
        font-size: 13px;
        margin: 0;
      }

      .err {
        color: var(--warn);
        margin: 8px 0 0;
        font-size: 13px;
      }

      .tg {
        position: fixed;
        left: 50%;
        bottom: calc(16px + env(safe-area-inset-bottom, 0px));
        transform: translateX(-50%);
        background: var(--ink);
        color: var(--bg);
        padding: 8px 14px;
        border-radius: 8px;
        font-size: 13px;
        max-width: 90%;
      }

      [hidden] {
        display: none !important;
      }
    </style>
  </head>
  <body >
    <div class="app">
      <header>
        <div class="header-top">
          <div class="brand">
            <img class="brand-mark" src="./favicon.svg" alt="Plotline analytics logo" />
            <h1>Plotline</h1>
          </div>
          <button type="button" id="themeToggle" class="theme-toggle">Light mode</button>
        </div>
        <p>
          Paste, upload or describe your data. Plotline picks a chart that
          fits, says what it sees, and never fills in gaps. Everything runs
          in your browser.
        </p>
      </header>

      <main>
        <aside>
          <section class="card">
            <h2>Your data</h2>
            <textarea
              id="src"
              rows="7"
              aria-label="Data"
              placeholder="Paste a table, CSV or JSON, or type numbers like: Jan 120, Feb 135, Mar 98"
            ></textarea>  
            <div class="row">
              <button class="pri" id="go">Build chart</button>
              <button id="up">Upload file</button>
              <input
                type="file"
                id="file"
                hidden
                accept=".csv,.tsv,.txt,.json,.xlsx,.xls"
              />
            </div>
            <div class="row sample-controls">
              <label for="sampleChoice">Example dataset
                <select id="sampleChoice">
                  <option value="monthly">Monthly sales and orders</option>
                  <option value="regional">Regional performance</option>
                  <option value="mix">Product mix</option>
                </select>
              </label>
              <button type="button" id="smp">Load example</button>
            </div>
            <div class="row">
              <button type="button" id="saveProject">Save analysis project</button>
              <button type="button" id="openProject">Open analysis project</button>
              <input type="file" id="projectFile" accept=".json,application/json" hidden />
            </div>
            <p id="projectStatus" class="mute" aria-live="polite"></p>
            <p id="err" class="err" role="alert"></p>
            <p class="mute privacy-note">Your data stays in this browser. It is not uploaded.</p>
          </section>

          <section class="card" aria-live="polite">
            <h2>Excel functions</h2>
            <p class="mute">Select a function, enter a dataset range and its other arguments, and run it on your data.</p>
            <p class="mute"><strong id="excelFunctionCount">0</strong> functions listed</p>
            <ul id="excelFunctionList" class="excel-function-list"></ul>
          </section>

        </aside>

        <section>
          <div class="card" id="empty">
            <h2>Start with your data</h2>
            <p class="mute">
              Paste a table, CSV or JSON, upload a CSV, Excel or JSON file,
              or type numbers in plain language. Plotline finds the columns,
              picks a chart, and points out trends and outliers. Missing values
              stay missing.
            </p>
          </div>

          <section class="card" id="preview" hidden>
            <div class="chart-heading">
              <h2>Data preview</h2>
              <p id="previewStatus" class="mute" aria-live="polite"></p>
            </div>
            <div class="preview-toolbar row">
              <label>
                Search rows
                <input id="previewSearch" type="search" placeholder="Search any column" />
              </label>
              <button type="button" id="showAllRecords" disabled>Show all records</button>
            </div>
            <div class="preview-pagination row" aria-label="Dataset pages">
              <button type="button" id="previewPrevious" aria-label="Previous page" disabled>Previous</button>
              <span id="previewPageStatus" class="mute" aria-live="polite"></span>
              <button type="button" id="previewNext" aria-label="Next page" disabled>Next</button>
            </div>
            <p id="cellSelectionHint" class="mute">Click a cell or drag across cells to select a range for the active Excel function. Use Shift-click to extend the range.</p>
            <div class="card">
              <h2>Excel formula</h2>
              <p class="mute">Use a formula against this dataset, for example <code>=SUM(B:B)</code> or <code>=XLOOKUP("North",A:A,B:B)</code>. Column letters match the preview headers; row 2 is the first data row.</p>
              <div id="formulaBuilder" hidden>
                <h3 id="formulaBuilderTitle">Function</h3>
                <label>
                  Dataset range
                  <input id="formulaRange" aria-label="Dataset range" placeholder="A2:A20, B:B, or [Column name]" />
                </label>
                <label>
                  Other arguments
                  <input id="formulaArguments" aria-label="Other function arguments" />
                </label>
                <p id="formulaArgumentHint" class="mute"></p>
                <div class="row">
                  <button type="button" class="pri" id="runSelectedFunction">Run function</button>
                  <button type="button" id="cancelSelectedFunction">Cancel</button>
                </div>
              </div>
              <div class="row">
                <input id="formulaInput" aria-label="Excel formula" placeholder='=COUNTIF(B:B,">100")' />
                <button type="button" class="pri" id="runFormula">Run formula</button>
                <button type="button" id="clearFormula">Clear</button>
              </div>
              <p id="formulaColumns" class="mute"></p>
              <p id="formulaStatus" class="mute" aria-live="polite"></p>
              <div id="formulaOutput" class="preview-table-wrap" hidden>
                <table class="preview-table" id="formulaTable">
                  <caption hidden>Excel formula result</caption>
                  <thead></thead>
                  <tbody></tbody>
                </table>
              </div>
            </div>
            <div class="preview-table-wrap">
              <table class="preview-table" id="previewTable">
                <caption hidden>Uploaded dataset preview. Activate a column heading to sort, or select cells to use an Excel function range.</caption>
                <thead></thead>
                <tbody></tbody>
              </table>
            </div>
          </section>

          <div id="res" hidden>
            <div class="chart-workspace">
              <div class="card chart-card">
                <div class="chart-heading">
                  <h2>Chart</h2>
                  <p id="why" class="mute"></p>
                </div>
                <div class="row chart-filter">
                  <label for="chartFilter">Filter chart rows
                    <input id="chartFilter" type="search" placeholder="Search any column" />
                  </label>
                  <button type="button" id="clearChartFilter" disabled>Clear filter</button>
                </div>
                <div class="cv">
                  <canvas id="cv" role="img" aria-label="Chart"></canvas>
                </div>
                <div class="row" id="zoomControls" aria-label="Chart zoom controls">
                  <button type="button" id="zoomIn" aria-label="Zoom in">Zoom in</button>
                  <button type="button" id="zoomOut" aria-label="Zoom out">Zoom out</button>
                  <button type="button" id="zoomReset">Reset view</button>
                  <span class="mute" id="zoomHint">Scroll or drag on the chart to inspect a range.</span>
                </div>
                <div class="row" id="exp">
                  <span class="mute">Export</span>
                  <button data-k="png">PNG</button>
                  <button data-k="svg">SVG</button>
                  <button data-k="pdf">PDF</button>
                  <button data-k="csv">CSV</button>
                  <button data-k="data-csv">Analyzed dataset CSV</button>
                  <button data-k="xlsx">Excel workbook</button>
                </div>
              </div>

              <section class="card" id="ctl" hidden>
                <h2>Ask for a change</h2>
                <div class="row" style="margin-top: 0">
                  <input
                    id="cmd"
                    aria-label="Instruction"
                    placeholder='"make this a bar chart", "show only 2025"'
                  />
                  <button id="ask">Apply</button>
                </div>
                <p id="reply" class="mute" aria-live="polite" style="margin: 8px 0 16px"></p>

                <h2>Customize</h2>
                <div id="types" class="seg"></div>
                <p id="typeHint" class="mute"></p>
                <p id="chartIssue" class="err" role="alert" hidden></p>
                <label>
                  X axis
                  <select id="xs"></select>
                </label>
                <div style="margin-top: 10px">
                  <span class="mute">Y values</span>
                  <div id="ys" class="chips"></div>
                </div>
                <div style="margin-top: 10px">
                  <span class="mute">Column types</span>
                  <div id="columnTypes" class="type-overrides"></div>
                </div>
                <label>
                  Title
                  <input id="ttl" />
                </label>
                <div class="two">
                  <label>
                    X label
                    <input id="xl" />
                  </label>
                  <label>
                    Y label
                    <input id="yl" />
                  </label>
                </div>
                <div class="two">
                  <label>
                    Palette
                    <select id="pal"></select>
                  </label>
                  <label class="chk">
                    <input type="checkbox" id="lg" checked /> Show legend
                  </label>
                </div>
                <div style="margin-top: 10px">
                  <span class="mute" id="colorLabel">Series colors</span>
                  <div id="colorChoices" class="chips color-choices"></div>
                </div>
                <div class="row">
                  <button type="button" id="saveSettings">Save chart settings</button>
                  <button type="button" id="loadSettings">Load chart settings</button>
                  <input type="file" id="settingsFile" accept=".json,application/json" hidden />
                </div>
                <p id="settingsStatus" class="mute" aria-live="polite"></p>
              </section>
            </div>

            <div class="card">
              <h2>Chart details</h2>
              <ul id="sum"></ul>
              <h2>Dataset overview</h2>
              <ul id="dataset"></ul>
              <h2>Data checks</h2>
              <ul id="chk"></ul>
            </div>

            <section class="card" id="kpiCard">
              <h2>KPI comparison</h2>
              <div class="two">
                <label>Measure
                  <select id="kpiMeasure"></select>
                </label>
                <label>Group by
                  <select id="kpiGroup"></select>
                </label>
              </div>
              <div class="two">
                <label>Compare
                  <select id="kpiCompareA"></select>
                </label>
                <label>Against
                  <select id="kpiCompareB"></select>
                </label>
              </div>
              <div class="row"><button type="button" class="pri" id="runKpi">Update KPIs</button></div>
              <div id="kpiCards" class="chips"></div>
              <p id="kpiStatus" class="mute" aria-live="polite"></p>
            </section>

            <section class="card" id="pivotCard">
              <h2>Pivot table</h2>
              <p class="mute">Group by up to two columns and summarize a numeric measure.</p>
              <div class="two">
                <label>Group by
                  <select id="pivotGroup1"></select>
                </label>
                <label>Then by (optional)
                  <select id="pivotGroup2"></select>
                </label>
              </div>
              <div class="two">
                <label>Measure
                  <select id="pivotMeasure"></select>
                </label>
                <label>Calculation
                  <select id="pivotAggregate">
                    <option value="sum">Sum</option>
                    <option value="average">Average</option>
                    <option value="count">Count</option>
                    <option value="min">Minimum</option>
                    <option value="max">Maximum</option>
                  </select>
                </label>
              </div>
              <div class="row">
                <button type="button" class="pri" id="runPivot">Build pivot table</button>
                <button type="button" id="exportPivot" disabled>Export pivot CSV</button>
              </div>
              <p id="pivotStatus" class="mute" aria-live="polite"></p>
              <div class="preview-table-wrap" id="pivotOutput" hidden>
                <table class="preview-table" id="pivotTable"><thead></thead><tbody></tbody></table>
              </div>
            </section>

            <section class="card" id="qualityCard">
              <h2>Data quality and safe fixes</h2>
              <p id="qualitySummary" class="mute"></p>
              <div class="chips">
                <label><input type="checkbox" id="fixTrim" checked /> Trim surrounding spaces</label>
                <label><input type="checkbox" id="fixCategories" /> Match category casing</label>
                <label><input type="checkbox" id="fixDuplicates" /> Remove exact duplicate rows</label>
              </div>
              <div class="row">
                <button type="button" id="previewFixes">Preview fixes</button>
                <button type="button" class="pri" id="applyFixes" disabled>Apply fixes</button>
                <button type="button" id="undoFixes" disabled>Undo last fix</button>
              </div>
              <p id="qualityStatus" class="mute" aria-live="polite"></p>
              <ul id="qualityDetails"></ul>
              <div class="preview-table-wrap" id="fixPreview" hidden>
                <table class="preview-table" id="fixPreviewTable"><thead></thead><tbody></tbody></table>
              </div>
            </section>

            <section class="card" id="guidedCard">
              <h2>Guided analysis</h2>
              <div class="row">
                <select id="guidedQuestion" aria-label="Analysis question">
                  <option value="highest">Which group has the highest value?</option>
                  <option value="lowest">Which group has the lowest value?</option>
                  <option value="trend">How did this measure change over time?</option>
                  <option value="outliers">Are there unusual values?</option>
                  <option value="missing">Where are values missing?</option>
                  <option value="duplicates">Are there duplicate records?</option>
                </select>
                <select id="guidedMeasure" aria-label="Measure for analysis"></select>
                <button type="button" class="pri" id="runGuided">Analyze</button>
              </div>
              <p id="guidedAnswer" class="mute" aria-live="polite"></p>
              <div class="preview-table-wrap" id="guidedOutput" hidden>
                <table class="preview-table" id="guidedTable"><thead></thead><tbody></tbody></table>
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>

    <div class="tg" id="tg" hidden role="status"></div>


<script src="vendor/chart.umd.min.js"></script>
<script src="vendor/hammer.min.js"></script>
<script src="vendor/chartjs-plugin-zoom.min.js"></script>
<script src="vendor/papaparse.min.js"></script>
<script src="vendor/xlsx.full.min.js"></script>
<script src="vendor/jspdf.umd.min.js"></script>


<script>
const P={Studio:["#2F5BEA","#E8833A","#1E9E8A","#8B5CF6","#D6455D","#6B7A8F","#C9A227","#3B9AE1"],Cool:["#1D4E89","#00B2CA","#7DCFB6","#5E60CE","#4EA8DE","#2A9D8F","#3A0CA3","#48BFE3"],Warm:["#C8553D","#F28F3B","#F5CB5C","#8C2F39","#B08968","#E76F51","#6D597A","#E9C46A"],Mono:["#1B2A41","#324A5F","#546A7B","#7C8FA0","#A5B4C2","#C5D0DA","#0C1821","#8D99AE"]};
const T=[['bar','Bar'],['stacked','Stacked'],['line','Line'],['area','Area'],['pie','Pie'],['scatter','Scatter']];
const SETTINGS_VERSION=1;
const SAMPLES={
 monthly:'Month,Revenue,Orders\n2025-01,12400,410\n2025-02,13850,448\n2025-03,13100,432\n2025-04,15200,493\n2025-05,16800,526\n2025-06,16150,518\n2025-07,18700,574\n2025-08,19350,602\n2025-09,18100,581\n2025-10,21600,648\n2025-11,23800,705\n2025-12,26100,764',
 regional:'Region,Revenue,Orders\nNorth,48200,1840\nSouth,39600,1510\nEast,52700,1975\nWest,44100,1692',
 mix:'Product,Share\nHardware,42\nSoftware,28\nServices,19\nSupport,11'
};
const EXCEL_FUNCTIONS=['XLOOKUP','VLOOKUP','HLOOKUP','INDEX','MATCH','SUM','SUMIF','SUMIFS','COUNT','COUNTA','COUNTIF','COUNTIFS','AVERAGE','AVERAGEIF','AVERAGEIFS','IF','IFERROR','TEXTJOIN','FILTER','UNIQUE','SORT','LEFT','RIGHT','MID'];
const PREVIEW_PAGE_SIZE=20;
const EXCEL_FUNCTION_SPECS={
 XLOOKUP:{rangeIndex:1,hint:'Enter lookup_value, return_array, and optionally if_not_found, match_mode, search_mode.',placeholder:'"North", B:B, "Not found"'},
 VLOOKUP:{rangeIndex:1,hint:'Enter lookup_value, col_index_num, and optionally FALSE for an exact match.',placeholder:'"North", 2, FALSE'},
 HLOOKUP:{rangeIndex:1,hint:'Enter lookup_value, row_index_num, and optionally FALSE for an exact match.',placeholder:'"Revenue", 2, FALSE'},
 INDEX:{rangeIndex:0,hint:'Enter row_num and optionally column_num.',placeholder:'2, 1'},
 MATCH:{rangeIndex:1,hint:'Enter lookup_value and optionally match_type (0 for exact match).',placeholder:'"North", 0'},
 SUM:{rangeIndex:0,hint:'No other arguments are needed.',placeholder:''},
 SUMIF:{rangeIndex:0,hint:'Enter criteria and optionally a sum_range.',placeholder:'">100", C:C'},
 SUMIFS:{rangeIndex:0,hint:'Enter criteria_range1, criteria1, then optional additional range/criteria pairs.',placeholder:'A:A, "North", C:C, ">100"'},
 COUNT:{rangeIndex:0,hint:'No other arguments are needed.',placeholder:''},
 COUNTA:{rangeIndex:0,hint:'No other arguments are needed.',placeholder:''},
 COUNTIF:{rangeIndex:0,hint:'Enter the criteria to count.',placeholder:'"North"'},
 COUNTIFS:{rangeIndex:0,hint:'Enter criteria1, then optional additional criteria_range, criteria pairs.',placeholder:'"North", C:C, ">100"'},
 AVERAGE:{rangeIndex:0,hint:'No other arguments are needed.',placeholder:''},
 AVERAGEIF:{rangeIndex:0,hint:'Enter criteria and optionally an average_range.',placeholder:'"North", C:C'},
 AVERAGEIFS:{rangeIndex:0,hint:'Enter criteria_range1, criteria1, then optional additional range/criteria pairs.',placeholder:'A:A, "North"'},
 IF:{rangeIndex:0,hint:'Enter value_if_true and optionally value_if_false.',placeholder:'"Yes", "No"'},
 IFERROR:{rangeIndex:0,hint:'Enter the value to use if the range result is an error.',placeholder:'"Not found"'},
 TEXTJOIN:{rangeIndex:2,hint:'Enter delimiter and ignore_empty (TRUE or FALSE).',placeholder:'", ", TRUE'},
 FILTER:{rangeIndex:0,hint:'Enter an include range and optionally an if_empty value.',placeholder:'B2:B20>100, "No matches"'},
 UNIQUE:{rangeIndex:0,hint:'Optionally enter exactly_once as TRUE or FALSE.',placeholder:'FALSE, FALSE'},
 SORT:{rangeIndex:0,hint:'Optionally enter sort_index, sort_order (1 or -1), and by_col.',placeholder:'1, 1, FALSE'},
 LEFT:{rangeIndex:0,hint:'Optionally enter the number of characters to return.',placeholder:'3'},
 RIGHT:{rangeIndex:0,hint:'Optionally enter the number of characters to return.',placeholder:'3'},
 MID:{rangeIndex:0,hint:'Enter start_num and num_chars.',placeholder:'2, 3'}
};
const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fm=n=>new Intl.NumberFormat('en',{maximumFractionDigits:2}).format(n);
let selectedExcelFunction='';
function renderExcelFunctions(){
 const list=$('#excelFunctionList');
 const count=$('#excelFunctionCount');
 if(list){
  list.innerHTML=EXCEL_FUNCTIONS.map(fn=>`<li><button type="button" data-excel-function="${fn}" aria-label="Run ${fn}">${fn}</button></li>`).join('');
  list.addEventListener('click',event=>{
   const button=event.target.closest('button[data-excel-function]');
   if(!button)return;
   selectedExcelFunction=button.dataset.excelFunction;
   const spec=EXCEL_FUNCTION_SPECS[selectedExcelFunction];
   $('#formulaBuilderTitle').textContent=`Run ${selectedExcelFunction}`;
   $('#formulaArguments').placeholder=spec.placeholder;
   $('#formulaArgumentHint').textContent=spec.hint;
   $('#formulaRange').value=S.cellSelection?formatCellRange(S.cellSelection):'';
   $('#formulaArguments').value='';
   $('#formulaBuilder').hidden=false;
   $('#formulaRange').focus();
  });
 }
 if(count){count.textContent=String(EXCEL_FUNCTIONS.length);}
}
let S={rows:[],cols:[],cfg:null,rec:null,typeOverrides:{},filterText:'',formulaColumn:null,cellSelection:null,pivotResult:null,fixPreview:null,undoRows:null,preview:{query:'',sort:'',direction:1},f:{col:'',text:'',top:0,sort:''}},ch=null,pieZoom=1;
const themePreferenceKey='plotline-theme',systemTheme=window.matchMedia('(prefers-color-scheme: dark)');
let themePreference;
try{const saved=localStorage.getItem(themePreferenceKey);if(saved==='light'||saved==='dark')themePreference=saved}catch(error){}
function setTheme(theme,remember=false){
 document.documentElement.dataset.theme=theme;
 $('#themeToggle').textContent=theme==='light'?'Dark mode':'Light mode';
 if(remember){themePreference=theme;try{localStorage.setItem(themePreferenceKey,theme)}catch(error){}}
 if(ch)drawChart();
}
setTheme(themePreference||(systemTheme.matches?'dark':'light'));
renderExcelFunctions();
$('#themeToggle').addEventListener('click',()=>setTheme(document.documentElement.dataset.theme==='light'?'dark':'light',true));
systemTheme.addEventListener('change',event=>{if(!themePreference)setTheme(event.matches?'dark':'light')});
const num=v=>{if(typeof v==='number')return isFinite(v)?v:NaN;if(typeof v!=='string')return NaN;const t=v.trim().replace(/^\((.*)\)$/,'-$1').replace(/[$€£₹,\s]/g,'').replace(/%$/,'');return /^-?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(t)?parseFloat(t):NaN};
const miss=v=>v==null||/^(|na|n\/a|null|none|nan|-|--|\?)$/i.test(String(v).trim());
const MON='(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*';
const isDt=v=>{const t=String(v).trim();return /^\d{4}[-\/]\d{1,2}([-\/]\d{1,2})?$/.test(t)||/^\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}$/.test(t)||new RegExp('^'+MON+'([\\s\\-\']*\\d{2,4})?$','i').test(t)||/^Q[1-4]([\s\-']*\d{2,4})?$/i.test(t)||/^\d{4}\s*Q[1-4]$/i.test(t)};
const dk=(c,v)=>c.yr?num(v):Date.parse(v);
const say=(m)=>$('#err').textContent=m||'';
let tt;const toast=m=>{const e=$('#tg');e.textContent=m;e.hidden=false;clearTimeout(tt);tt=setTimeout(()=>e.hidden=true,3200)};

/* ---------- parsing ---------- */
function fromJSON(j){
 if(Array.isArray(j)){if(j.length&&Array.isArray(j[0])){const h=j[0].map(String);return j.slice(1).map(r=>Object.fromEntries(h.map((k,i)=>[k,r[i]])))}
  if(j.length&&typeof j[0]=='object'&&j[0]!==null)return j;return j.map((v,i)=>({Item:'#'+(i+1),Value:v}))}
 if(j&&typeof j=='object'){const v=Object.values(j);
  if(v.length&&v.every(Array.isArray)){const n=Math.max(...v.map(a=>a.length)),k=Object.keys(j);return Array.from({length:n},(_,i)=>Object.fromEntries(k.map(c=>[c,j[c][i]])))}
  if(v.every(x=>typeof x!='object'||x===null))return Object.entries(j).map(([k,x])=>({Label:k,Value:x}));
  const a=v.find(Array.isArray);if(a)return fromJSON(a)}
 throw Error('That JSON is not a table I can chart. Use an array of objects or an object of arrays.')}
function parse(t){t=t.trim();if(!t)throw Error('Paste or upload some data first.');
 let j;try{j=JSON.parse(t)}catch(e){}if(j!==undefined&&typeof j=='object')return fromJSON(j);
 const nl=()=>{const r=[];t.split(/;|\n|,(?!\d{3}\b)|\s+and\s+/i).forEach(s=>{const m=s.trim().match(/^(.*?\S)[\s:=\-–]+[$€£₹]?(-?[\d.,]*\d)\s*%?$/);if(m)r.push({Label:m[1],Value:m[2]})});return r};
 if(!/\n/.test(t)){const r=nl();if(r.length>=2)return r}
 let c=t;if(/^[^\n]*\|/.test(t))c=t.split('\n').filter(l=>!/^[\s|:\-]+$/.test(l)).map(l=>l.replace(/^\s*\||\|\s*$/g,'')).join('\n');
 const p=Papa.parse(c,{header:true,skipEmptyLines:'greedy',transformHeader:h=>h.trim(),transform:v=>v.trim()}),f=p.meta.fields||[];
 if(f.length<2){const r=nl();if(r.length>=2)return r}
 if(f.length<2||!p.data.length)throw Error('I could not read a table from that. Include a header row and at least one row of values, or type pairs like "Jan 120, Feb 135".');
 return p.data}

/* ---------- analysis ---------- */
function inspect(){
 const names=Object.keys(S.rows[0]);
 S.cols=names.map(name=>{
  const raw=S.rows.map(row=>row[name]),values=raw.filter(value=>!miss(value));
  const numericCount=values.filter(value=>Number.isFinite(num(value))).length;
  let detected='cat',year=false;
  if(values.length&&numericCount/values.length>=.8){
   detected='num';
   if(/year|yr|fy/i.test(name)&&values.every(value=>Number.isInteger(num(value))&&num(value)>1899&&num(value)<2101)){detected='date';year=true}
  }else if(values.length&&values.filter(isDt).length/values.length>=.8)detected='date';
  const type=S.typeOverrides[name]||detected;
  return{name,type,yr:type==='date'&&year,sortable:type==='date'&&(year||values.every(value=>Number.isFinite(Date.parse(value)))),missing:raw.length-values.length,invalid:type==='num'?values.length-numericCount:0};
 });
}
function auto(){const c=S.cols,nums=c.filter(k=>k.type=='num'),dt=c.find(k=>k.type=='date'),ct=c.find(k=>k.type=='cat'),x=dt||ct;let ys,type,why;
 if(x){ys=nums.slice(0,6);if(!ys.length)return null;
  const cnt=new Set(S.rows.map(r=>r[x.name])).size,vals=S.rows.map(r=>num(r[ys[0].name])).filter(v=>!isNaN(v)),sum=vals.reduce((a,b)=>a+b,0);
  const nonneg=ys.every(y=>S.rows.every(r=>!(num(r[y.name])<0)));
  if(dt){type='line';why='The first column is a time sequence, so a line shows how values change.'}
  else if(ys.length==1&&cnt<=6&&nonneg&&(/share|percent|pct|%|proportion/i.test(ys[0].name)||Math.abs(sum-100)<1.5)){type='pie';why='A few categories that add up to a whole, so a pie shows each share.'}
  else if(ys.length>=3&&nonneg&&cnt<=12){type='stacked';why='Several non-negative series per category, so stacked bars show totals and composition. Switch to Bar to compare series directly.'}
  else{type='bar';why='Comparing values across categories, so bars are the easiest to read.'}
 }else if(nums.length>=2){x=nums[0];ys=[nums[1]];type='scatter';why='Two numeric columns and no category or date, so a scatter plot shows how they relate.'}
 else return null;
 return{x:x.name,ys:ys.map(y=>y.name),type,why};
}

function normalizeRows(rows){
 if(!Array.isArray(rows))throw Error('The file does not contain a table.');
 const records=rows.filter(row=>row&&typeof row==='object'&&!Array.isArray(row));
 if(!records.length)throw Error('The file does not contain any data rows.');
 const names=[...new Set(records.flatMap(row=>Object.keys(row)))].map((name,index)=>String(name||`Column ${index+1}`).trim()||`Column ${index+1}`);
 if(names.length<2)throw Error('Include at least two columns: one label column and one values column.');
 const result=records.map(row=>Object.fromEntries(names.map(name=>[name,row[name]??''])))
  .filter(row=>Object.values(row).some(value=>!miss(value)));
 if(!result.length)throw Error('The file contains headers but no data rows.');
 return result;
}

function rowsFromText(text,delimiter){
 if(!window.Papa)throw Error('The data parser did not load. Check your internet connection and reload the page.');
 if(delimiter){
  const parsed=Papa.parse(text,{header:true,delimiter,skipEmptyLines:'greedy',transformHeader:header=>header.trim(),transform:value=>value.trim()});
  if(parsed.errors.some(error=>error.type==='Delimiter'))throw Error('I could not detect the columns in this file.');
  return normalizeRows(parsed.data);
 }
 return normalizeRows(parse(text));
}

async function rowsFromFile(file){
 const name=file.name.toLowerCase(),extension=name.split('.').pop();
 if(['xlsx','xls'].includes(extension)){
  if(!window.XLSX)throw Error('The Excel reader did not load. Check your internet connection and reload the page.');
  const workbook=XLSX.read(await file.arrayBuffer(),{type:'array'});
  const sheet=workbook.Sheets[workbook.SheetNames[0]];
  if(!sheet)throw Error('This Excel file has no worksheets.');
  return normalizeRows(fromJSON(XLSX.utils.sheet_to_json(sheet,{header:1,defval:'',raw:false})));
 }
 const text=await file.text();
 if(extension==='json')return normalizeRows(fromJSON(JSON.parse(text)));
 if(extension==='tsv')return rowsFromText(text,'\t');
 if(['csv','txt'].includes(extension))return rowsFromText(text);
 throw Error('Choose a CSV, TSV, TXT, JSON, XLS, or XLSX file.');
}

function makeConfig(recommendation){
 return{x:recommendation.x,ys:recommendation.ys,type:recommendation.type,title:'',xLabel:recommendation.x,yLabel:'',palette:'Studio',legend:true,colors:{series:{},slices:{}}};
}

function chartIssue(type,xName,ys){
 const numeric=S.cols.filter(column=>column.type==='num');
 if(!ys.length)return 'Select at least one numeric value series.';
 if(ys.some(name=>!numeric.some(column=>column.name===name)))return 'Value series must be numeric columns.';
 if(type==='scatter'){
  if(numeric.length<2)return 'Scatter charts need at least two numeric columns.';
  if(S.cols.find(column=>column.name===xName)?.type!=='num')return 'Scatter charts need a numeric X axis.';
  if(!ys.some(name=>name!==xName))return 'Choose a numeric Y series different from the X axis.';
  return '';
 }
 if(!['cat','date'].includes(S.cols.find(column=>column.name===xName)?.type))return 'Choose a category or date column for this chart type.';
 if(type==='pie'){
  if(ys.length!==1)return 'Pie charts use exactly one numeric series.';
  const values=S.rows.map(row=>num(row[ys[0]])).filter(Number.isFinite);
  if(!values.length)return 'The selected series has no numeric values for a pie chart.';
  if(values.some(value=>value<0))return 'Pie charts need non-negative values. Choose another series or chart type.';
 }
 return '';
}

function isPieSeries(name){
 const values=S.rows.map(row=>num(row[name])).filter(Number.isFinite);
 return values.length>0&&values.every(value=>value>=0);
}

function chartTypeIssue(type){
 const config=S.cfg,numeric=S.cols.filter(column=>column.type==='num');
 let xName=config.x,ys=[...config.ys];
 if(type==='scatter'){
  if(S.cols.find(column=>column.name===xName)?.type!=='num')xName=numeric[0]?.name;
  ys=ys.filter(name=>name!==xName);
  if(!ys.length)ys=[numeric.find(column=>column.name!==xName)?.name].filter(Boolean);
 }else{
  const categories=S.cols.filter(column=>column.type==='cat'||column.type==='date');
  if(!categories.length)return 'Needs a category or date column for the X axis.';
  if(!categories.some(column=>column.name===xName))xName=categories[0].name;
  if(type==='pie'){
    ys=[ys.find(isPieSeries)||numeric.find(column=>isPieSeries(column.name))?.name].filter(Boolean);
  }
 }
 return chartIssue(type,xName,ys);
}

function setColumnType(name,type){
 if(type==='auto')delete S.typeOverrides[name];
 else S.typeOverrides[name]=type;
 inspect();
 S.rec=auto();
 const config=S.cfg,numeric=S.cols.filter(column=>column.type==='num');
 config.ys=config.ys.filter(series=>numeric.some(column=>column.name===series));
 if(config.type==='scatter'){
  if(!numeric.some(column=>column.name===config.x))config.x=numeric[0]?.name||'';
  config.ys=config.ys.filter(series=>series!==config.x);
  if(!config.ys.length)config.ys=[numeric.find(column=>column.name!==config.x)?.name].filter(Boolean);
 }else{
  const categories=S.cols.filter(column=>column.type==='cat'||column.type==='date');
  if(!categories.some(column=>column.name===config.x))config.x=categories[0]?.name||'';
  if(config.type==='pie'){
   const series=config.ys.find(isPieSeries)||numeric.find(column=>isPieSeries(column.name))?.name;
   config.ys=series?[series]:[];
  }
 }
 if(!config.ys.length&&S.rec&&config.type!=='pie')config.ys=[...S.rec.ys];
 fillControls();
 renderPreview();
 drawChart();
}

function fillControls(){
 const config=S.cfg;
 $('#types').innerHTML=T.map(([value,label])=>{const issue=chartTypeIssue(value);return `<button type="button" data-type="${value}" aria-pressed="${config.type===value}" title="${esc(issue||`${label} chart`)}" ${issue?'disabled':''}>${label}</button>`}).join('');
 const unavailable=T.map(([type,label])=>[label,chartTypeIssue(type)]).filter(([,issue])=>issue);
 $('#typeHint').textContent=unavailable.length?`Unavailable for this dataset: ${unavailable.map(([label,issue])=>`${label}: ${issue}`).join(' ')}`:'Choose a chart type to change how these fields are displayed.';
 $('#types').querySelectorAll('button:not(:disabled)').forEach(button=>button.addEventListener('click',()=>{
  config.type=button.dataset.type;
  if(config.type==='scatter'){
   if(S.cols.find(column=>column.name===config.x)?.type!=='num')config.x=S.cols.find(column=>column.type==='num')?.name||config.x;
   config.ys=config.ys.filter(name=>name!==config.x);
   if(!config.ys.length)config.ys=[S.cols.find(column=>column.type==='num'&&column.name!==config.x)?.name].filter(Boolean);
  }else{
   if(!S.cols.some(column=>column.name===config.x&&(column.type==='cat'||column.type==='date')))config.x=S.cols.find(column=>column.type==='cat'||column.type==='date')?.name||config.x;
   if(config.type==='pie'){
    const suitable=config.ys.find(isPieSeries)||S.cols.find(column=>column.type==='num'&&isPieSeries(column.name))?.name;
    config.ys=suitable?[suitable]:[];
   }
  }
  fillControls();drawChart();
 }));
 const typeOptions=[['auto','Automatic'],['num','Number'],['cat','Category'],['date','Date']];
 $('#columnTypes').innerHTML=S.cols.map(column=>`<label><span>${esc(column.name)} <span class="mute">(${column.type})</span></span><select data-column-type="${esc(column.name)}" aria-label="Type for ${esc(column.name)}">${typeOptions.map(([value,label])=>`<option value="${value}" ${(S.typeOverrides[column.name]||'auto')===value?'selected':''}>${label}</option>`).join('')}</select></label>`).join('');
 $('#columnTypes').querySelectorAll('select').forEach(select=>select.addEventListener('change',()=>setColumnType(select.dataset.columnType,select.value)));
 const xColumns=config.type==='scatter'?S.cols.filter(column=>column.type==='num'):S.cols.filter(column=>column.type==='cat'||column.type==='date');
 $('#xs').innerHTML=xColumns.map(column=>`<option value="${esc(column.name)}">${esc(column.name)}</option>`).join('');
 $('#xs').value=config.x;
 $('#xs').onchange=()=>{
  config.x=$('#xs').value;
  if(config.type==='scatter'){
   config.ys=config.ys.filter(name=>name!==config.x);
   if(!config.ys.length)config.ys=[S.cols.find(column=>column.type==='num'&&column.name!==config.x)?.name].filter(Boolean);
  }
  fillControls();drawChart();
 };
 $('#ys').innerHTML=S.cols.filter(column=>column.type==='num'&&(config.type!=='scatter'||column.name!==config.x)).map(column=>`<label><input type="${config.type==='pie'?'radio':'checkbox'}" ${config.type==='pie'?'name="pieSeries"':''} value="${esc(column.name)}" ${config.ys.includes(column.name)?'checked':''}>${esc(column.name)}</label>`).join('');
 $('#ys').querySelectorAll('input').forEach(input=>input.addEventListener('change',()=>{
  config.ys=config.type==='pie'?[input.value]:[...$('#ys').querySelectorAll('input:checked')].map(item=>item.value);
  fillControls();
  drawChart();
 }));
 $('#pal').innerHTML=Object.keys(P).map(name=>`<option value="${name}">${name}</option>`).join('');
 $('#pal').value=config.palette;
 $('#pal').onchange=()=>{config.palette=$('#pal').value;fillControls();drawChart()};
 const pieLabels=[...new Set(visibleRows().map(row=>String(row[config.x]??'')))];
 const colorGroup=config.type==='pie'?'slices':'series';
 const colorNames=config.type==='pie'?pieLabels:config.ys;
 $('#colorLabel').textContent=config.type==='pie'?'Slice colors':'Series colors';
 $('#colorChoices').innerHTML=colorNames.map((name,index)=>{
  const fallback=(P[config.palette]||P.Studio)[index%(P[config.palette]||P.Studio).length];
  const color=config.colors[colorGroup][name]||fallback;
  return `<label><input type="color" data-color-group="${colorGroup}" data-color-key="${esc(name)}" value="${color}" aria-label="Color for ${esc(name)}">${esc(name)}</label>`;
 }).join('');
 $('#colorChoices').querySelectorAll('input[type="color"]').forEach(input=>input.addEventListener('input',()=>{
  config.colors[input.dataset.colorGroup][input.dataset.colorKey]=input.value;
  drawChart();
 }));
 $('#ttl').value=config.title;
 $('#ttl').oninput=()=>{config.title=$('#ttl').value;drawChart()};
 $('#xl').value=config.xLabel;
 $('#xl').oninput=()=>{config.xLabel=$('#xl').value;drawChart()};
 $('#yl').value=config.yLabel;
 $('#yl').oninput=()=>{config.yLabel=$('#yl').value;drawChart()};
 $('#lg').checked=config.legend;
 $('#lg').onchange=()=>{config.legend=$('#lg').checked;drawChart()};
}

function visibleRows(){
 if(!S.filterText)return S.rows;
 const query=S.filterText.toLowerCase();
 return S.rows.filter(row=>Object.values(row).some(value=>String(value??'').toLowerCase().includes(query)));
}

function renderPreview(){
 const state=S.preview,query=state.query.trim().toLowerCase();
 const rows=S.rows.map((row,index)=>({row,index})).filter(({row,index})=>!query||Object.values(row).some(value=>String(value??'').toLowerCase().includes(query))||String(S.formulaColumn?.values[index]??'').toLowerCase().includes(query));
 if(state.sort){
  const column=S.cols.find(item=>item.name===state.sort);
  rows.sort((left,right)=>{
   const a=left.row[state.sort],b=right.row[state.sort];
   let order;
   if(column?.type==='num'||column?.type==='date'){
    const first=column.type==='date'?dk(column,a):num(a),second=column.type==='date'?dk(column,b):num(b);
    order=Number.isFinite(first)&&Number.isFinite(second)?first-second:Number.isFinite(first)?-1:Number.isFinite(second)?1:0;
   }else order=String(a??'').localeCompare(String(b??''),undefined,{numeric:true,sensitivity:'base'});
   return order*state.direction||left.index-right.index;
  });
 }
 const pageCount=Math.max(1,Math.ceil(rows.length/PREVIEW_PAGE_SIZE));
 state.page=Math.min(Math.max(0,state.page||0),pageCount-1);
 const start=state.page*PREVIEW_PAGE_SIZE;
 const pageRows=rows.slice(start,start+PREVIEW_PAGE_SIZE);
 const head=document.createElement('tr');
 for(const column of S.cols){
  const cell=document.createElement('th');cell.scope='col';
  cell.setAttribute('aria-sort',state.sort===column.name?(state.direction===1?'ascending':'descending'):'none');
  const button=document.createElement('button');button.type='button';button.dataset.sort=column.name;
  button.textContent=`${column.name}${state.sort===column.name?(state.direction===1?' ↑':' ↓'):''}`;
  cell.append(button);head.append(cell);
 }
 if(S.formulaColumn){
  const cell=document.createElement('th');
  cell.scope='col';
  cell.textContent=S.formulaColumn.name;
  head.append(cell);
 }
 $('#previewTable thead').replaceChildren(head);
 const body=document.createDocumentFragment();
 for(const {row,index} of pageRows){
  const tableRow=document.createElement('tr');
  for(const [columnIndex,column] of S.cols.entries()){
   const cell=document.createElement('td');
   cell.dataset.rowIndex=String(index);
   cell.dataset.columnIndex=String(columnIndex);
   cell.setAttribute('data-selected',String(isCellSelected(index,columnIndex)));
   cell.textContent=String(row[column.name]??'');
   tableRow.append(cell);
  }
  if(S.formulaColumn){const cell=document.createElement('td');cell.textContent=String(S.formulaColumn.values[index]??'');tableRow.append(cell)}
  body.append(tableRow);
 }
 if(!rows.length){const tableRow=document.createElement('tr'),cell=document.createElement('td');cell.colSpan=S.cols.length+(S.formulaColumn?1:0);cell.textContent='No rows match this search.';tableRow.append(cell);body.append(tableRow)}
 $('#previewTable tbody').replaceChildren(body);
 const searching=Boolean(query);
 const shownStart=rows.length?start+1:0,shownEnd=Math.min(start+PREVIEW_PAGE_SIZE,rows.length);
 $('#previewStatus').textContent=searching?`Showing ${rows.length} matching of ${S.rows.length} total records.`:`Showing ${S.rows.length} total records.`;
 $('#previewPageStatus').textContent=`Showing ${shownStart}-${shownEnd} of ${rows.length} records · Page ${state.page+1} of ${pageCount}`;
 $('#previewPrevious').disabled=state.page===0;
 $('#previewNext').disabled=state.page>=pageCount-1;
 $('#showAllRecords').disabled=!searching;
}

function formatCellRange(selection){
 const first=`${excelColumnLabel(selection.startColumn)}${selection.startRow+2}`;
 const last=`${excelColumnLabel(selection.endColumn)}${selection.endRow+2}`;
 return first===last?first:`${first}:${last}`;
}

function isCellSelected(row,column){
 const selection=S.cellSelection;
 return Boolean(selection&&row>=Math.min(selection.startRow,selection.endRow)&&row<=Math.max(selection.startRow,selection.endRow)&&column>=Math.min(selection.startColumn,selection.endColumn)&&column<=Math.max(selection.startColumn,selection.endColumn));
}

function selectDatasetCell(row,column,extend=false){
 if(!Number.isInteger(row)||row<0||row>=S.rows.length||!Number.isInteger(column)||column<0||column>=S.cols.length)return;
 const previous=S.cellSelection;
 const start=extend&&previous?{row:previous.startRow,column:previous.startColumn}:{row,column};
 S.cellSelection={startRow:start.row,startColumn:start.column,endRow:row,endColumn:column};
 const range=formatCellRange(S.cellSelection);
 if(selectedExcelFunction)$('#formulaRange').value=range;
 $('#cellSelectionHint').textContent=`Selected ${range}. ${selectedExcelFunction?`Range for ${selectedExcelFunction} is ready.`:'Choose an Excel function to use this selection.'}`;
 renderPreview();
}

function analysisCategories(){
 return S.cols.filter(column=>column.type!=='num').map(column=>column.name);
}

function analysisMeasures(){
 return S.cols.filter(column=>column.type==='num').map(column=>column.name);
}

function fillAnalysisControls(){
 const categories=analysisCategories(),measures=analysisMeasures();
 const optionMarkup=(items,emptyLabel)=>`${emptyLabel?`<option value="">${esc(emptyLabel)}</option>`:''}${items.map(name=>`<option value="${esc(name)}">${esc(name)}</option>`).join('')}`;
 $('#pivotGroup1').innerHTML=optionMarkup(categories);
 $('#pivotGroup2').innerHTML=optionMarkup(categories,'None');
 $('#pivotMeasure').innerHTML=optionMarkup(measures);
 $('#kpiMeasure').innerHTML=optionMarkup(measures);
 $('#guidedMeasure').innerHTML=optionMarkup(measures);
 $('#kpiGroup').innerHTML=optionMarkup(categories,'No grouping');
 $('#pivotGroup1').value=categories[0]||'';
 $('#pivotGroup2').value='';
 $('#pivotMeasure').value=measures[0]||'';
 $('#kpiMeasure').value=measures[0]||'';
 $('#guidedMeasure').value=measures[0]||'';
 $('#kpiGroup').value='';
 updateComparisonOptions();
 $('#runPivot').disabled=!categories.length||!measures.length;
 $('#runKpi').disabled=!measures.length;
 $('#runGuided').disabled=!measures.length&&$('#guidedQuestion').value!=='missing'&&$('#guidedQuestion').value!=='duplicates';
 $('#exportPivot').disabled=!S.pivotResult;
 renderQualityChecks();
}

function makeTable(headSelector,bodySelector,headers,rows){
 const head=document.createElement('tr'),body=document.createDocumentFragment();
 for(const title of headers){const cell=document.createElement('th');cell.scope='col';cell.textContent=String(title);head.append(cell)}
 for(const values of rows){
  const tableRow=document.createElement('tr');
  for(const value of values){const cell=document.createElement('td');cell.textContent=String(value??'');tableRow.append(cell)}
  body.append(tableRow);
 }
 $(headSelector).replaceChildren(head);
 $(bodySelector).replaceChildren(body);
}

function aggregateValues(values,operation){
 const numbers=values.map(num).filter(Number.isFinite);
 if(operation==='count')return numbers.length;
 if(!numbers.length)return'';
 if(operation==='sum')return numbers.reduce((total,value)=>total+value,0);
 if(operation==='average')return numbers.reduce((total,value)=>total+value,0)/numbers.length;
 if(operation==='min')return numbers.reduce((minimum,value)=>Math.min(minimum,value),Infinity);
 return numbers.reduce((maximum,value)=>Math.max(maximum,value),-Infinity);
}

function buildPivot(){
 const first=$('#pivotGroup1').value,second=$('#pivotGroup2').value,measure=$('#pivotMeasure').value,operation=$('#pivotAggregate').value;
 if(!first||!measure)throw Error('Select a grouping column and a numeric measure first.');
 const groups=new Map();
 for(const row of S.rows){
  const labels=[String(row[first]??'')];
  if(second&&second!==first)labels.push(String(row[second]??''));
  const key=JSON.stringify(labels);
  if(!groups.has(key))groups.set(key,{labels,values:[]});
  groups.get(key).values.push(row[measure]);
 }
 const headers=[first,...(second&&second!==first?[second]:[]),`${operation[0].toUpperCase()+operation.slice(1)} of ${measure}`];
 const results=[...groups.values()].map(group=>[...group.labels,aggregateValues(group.values,operation)]);
 results.sort((left,right)=>String(left[0]).localeCompare(String(right[0]),undefined,{numeric:true,sensitivity:'base'}));
 S.pivotResult={headers,rows:results,groupColumns:headers.slice(0,-1),measure,operation};
 makeTable('#pivotTable thead','#pivotTable tbody',headers,results);
 $('#pivotOutput').hidden=false;
 $('#pivotStatus').textContent=`${results.length} group${results.length===1?'':'s'} summarized from ${S.rows.length} records.`;
 $('#exportPivot').disabled=!results.length;
}

function updateComparisonOptions(){
 const grouping=$('#kpiGroup').value;
 const values=grouping? [...new Set(S.rows.map(row=>String(row[grouping]??'')))]:[];
 const markup=values.map(value=>`<option value="${esc(value)}">${esc(value||'(blank)')}</option>`).join('');
 $('#kpiCompareA').innerHTML=markup;
 $('#kpiCompareB').innerHTML=markup;
 if(values.length>1)$('#kpiCompareB').value=values[1];
}

function calculateKpis(){
 const measure=$('#kpiMeasure').value,grouping=$('#kpiGroup').value;
 if(!measure)throw Error('Select a numeric KPI measure.');
 const values=S.rows.map(row=>num(row[measure])).filter(Number.isFinite);
 if(!values.length)throw Error(`${measure} has no numeric values.`);
 const total=values.reduce((sum,value)=>sum+value,0);
 const cards=[
  ['Total',fm(total)],
  ['Average',fm(total/values.length)],
  ['Minimum',fm(values.reduce((minimum,value)=>Math.min(minimum,value),Infinity))],
  ['Maximum',fm(values.reduce((maximum,value)=>Math.max(maximum,value),-Infinity))],
  ['Numeric records',String(values.length)]
 ];
 if(grouping){
  const grouped=new Map();
  for(const row of S.rows){const key=String(row[grouping]??'');if(!grouped.has(key))grouped.set(key,[]);grouped.get(key).push(row[measure])}
  const ranked=[...grouped].map(([name,items])=>({name,total:aggregateValues(items,'sum')})).sort((a,b)=>b.total-a.total);
  if(ranked.length){cards.push(['Top group',`${ranked[0].name||'(blank)'} (${fm(ranked[0].total)})`]);cards.push(['Bottom group',`${ranked[ranked.length-1].name||'(blank)'} (${fm(ranked[ranked.length-1].total)})`])}
  const first=$('#kpiCompareA').value,second=$('#kpiCompareB').value;
  if(first!==''&&second!==''&&first!==second){
   const a=aggregateValues(grouped.get(first)||[],'sum'),b=aggregateValues(grouped.get(second)||[],'sum'),delta=a-b,percent=b?`${fm(delta/b*100)}%`:'not available (baseline is zero)';
   $('#kpiStatus').textContent=`${first||'(blank)'} vs ${second||'(blank)'}: ${fm(a)} vs ${fm(b)}; difference ${fm(delta)} (${percent} vs baseline).`;
  }else $('#kpiStatus').textContent=`KPI totals grouped by ${grouping}. Choose two different groups to compare.`;
 }else $('#kpiStatus').textContent='Choose a grouping column to compare groups.';
 const container=$('#kpiCards');
 container.replaceChildren(...cards.map(([label,value])=>{
  const card=document.createElement('div');card.className='kpi-value';
  const heading=document.createElement('strong');heading.textContent=label;
  const result=document.createElement('span');result.textContent=value;
  card.append(heading,result);return card;
 }));
}

function renderGuidedTable(headers,rows){
 if(!rows.length){$('#guidedOutput').hidden=true;return}
 makeTable('#guidedTable thead','#guidedTable tbody',headers,rows);
 $('#guidedOutput').hidden=false;
}

function setGuidedChart(xName,measure,type,title){
 if(!S.cfg||!S.cols.some(column=>column.name===xName)||!analysisMeasures().includes(measure))return;
 const xType=S.cols.find(column=>column.name===xName)?.type;
 if(type==='line'&&xType!=='date')type='bar';
 if(!['cat','date'].includes(xType))return;
 const issue=chartIssue(type,xName,[measure]);
 if(issue)return;
 S.cfg.x=xName;S.cfg.ys=[measure];S.cfg.type=type;S.cfg.title=title;
 S.cfg.xLabel=xName;S.cfg.yLabel=measure;
 fillControls();drawChart();
}

function runGuidedAnalysis(){
 const question=$('#guidedQuestion').value,measure=$('#guidedMeasure').value;
 const categories=analysisCategories(),group=categories[0],rows=[];
 if(question==='missing'){
  for(const column of S.cols)rows.push([column.name,column.missing]);
  $('#guidedAnswer').textContent=`${S.cols.reduce((total,column)=>total+column.missing,0)} missing cells across ${S.rows.length} records. Missing values are reported, not silently filled.`;
  renderGuidedTable(['Column','Missing cells'],rows);
  return;
 }
 if(question==='duplicates'){
  const duplicates=duplicateCounts(S.rows);
  $('#guidedAnswer').textContent=`${duplicates} exact duplicate row${duplicates===1?'':'s'} found. This check does not remove any records.`;
  const seen=new Set();
  for(const [index,row] of S.rows.entries()){
   const key=JSON.stringify(S.cols.map(column=>row[column.name]??''));
   if(seen.has(key))rows.push([index+1,...S.cols.map(column=>row[column.name])]);
   else seen.add(key);
  }
  renderGuidedTable(['Duplicate row',...S.cols.map(column=>column.name)],rows);
  return;
 }
 if(!measure)throw Error('Choose a numeric measure.');
 if(question==='outliers'){
  const values=S.rows.map((row,index)=>({row,index,value:num(row[measure])})).filter(point=>Number.isFinite(point.value)).sort((a,b)=>a.value-b.value);
  if(values.length<4){$('#guidedAnswer').textContent='At least four numeric values are needed for the IQR outlier check.';$('#guidedOutput').hidden=true;return}
  const quantile=fraction=>{const position=(values.length-1)*fraction,lower=Math.floor(position),weight=position-lower;return values[lower].value*(1-weight)+values[Math.min(lower+1,values.length-1)].value*weight};
  const q1=quantile(.25),q3=quantile(.75),spread=q3-q1;
  const unusual=spread?values.filter(point=>point.value<q1-1.5*spread||point.value>q3+1.5*spread):[];
  $('#guidedAnswer').textContent=`${unusual.length} possible outlier${unusual.length===1?'':'s'} in ${measure} using the 1.5× IQR rule. These are statistical flags, not proof of bad data.`;
  renderGuidedTable(['Row',group||'Record',measure],unusual.map(point=>[point.index+1,group?point.row[group]:'Record '+(point.index+1),fm(point.value)]));
  return;
 }
 if(question==='trend'){
  const date=S.cols.find(column=>column.type==='date');
  if(!date)throw Error('No date column is available for a trend analysis.');
  const ordered=S.rows.map(row=>({label:row[date.name],date:dk(date,row[date.name]),value:num(row[measure])})).filter(point=>Number.isFinite(point.date)&&Number.isFinite(point.value)).sort((a,b)=>a.date-b.date);
  if(ordered.length<2)throw Error('At least two valid dated numeric records are needed.');
  const first=ordered[0],last=ordered[ordered.length-1],delta=last.value-first.value;
  $('#guidedAnswer').textContent=`${measure} ${delta>0?'increased':delta<0?'decreased':'was unchanged'} by ${fm(delta)} from ${first.label} (${fm(first.value)}) to ${last.label} (${fm(last.value)}).`;
  renderGuidedTable([date.name,measure],ordered.map(point=>[point.label,fm(point.value)]));
  setGuidedChart(date.name,measure,'line',`${measure} over time`);
  return;
 }
 if(!group)throw Error('No category or date column is available for a group comparison.');
 const grouped=new Map();
 for(const row of S.rows){const label=String(row[group]??'');if(!grouped.has(label))grouped.set(label,[]);grouped.get(label).push(row[measure])}
 const ranked=[...grouped].map(([label,items])=>({label,value:aggregateValues(items,'sum')})).filter(item=>Number.isFinite(item.value)).sort((a,b)=>question==='highest'?b.value-a.value:a.value-b.value);
 if(!ranked.length)throw Error(`No numeric ${measure} values can be grouped.`);
 const winner=ranked[0];
 $('#guidedAnswer').textContent=`${winner.label||'(blank)'} has the ${question==='highest'?'highest':'lowest'} total ${measure}: ${fm(winner.value)}.`;
 renderGuidedTable([group,`Total ${measure}`],ranked.map(item=>[item.label||'(blank)',fm(item.value)]));
 setGuidedChart(group,measure,'bar',`${measure} by ${group}`);
}

function duplicateCounts(rows){
 const seen=new Set();let duplicates=0;
 for(const row of rows){
  const key=JSON.stringify(S.cols.map(column=>row[column.name]??''));
  if(seen.has(key))duplicates++;
  else seen.add(key);
 }
 return duplicates;
}

function categoryInconsistencies(){
 const findings=[];
 for(const column of S.cols.filter(item=>item.type==='cat')){
  const variants=new Map();
  for(const row of S.rows){
   const value=String(row[column.name]??'');
   if(miss(value))continue;
   const key=value.trim().toLocaleLowerCase();
   if(!variants.has(key))variants.set(key,new Set());
   variants.get(key).add(value);
  }
  for(const [normalized,values] of variants)if(values.size>1)findings.push(`${column.name}: ${[...values].map(value=>`"${value}"`).join(', ')} differ only by spaces or letter case.`);
 }
 return findings;
}

function outlierCount(){
 let count=0;
 for(const column of S.cols.filter(item=>item.type==='num')){
  const values=S.rows.map(row=>num(row[column.name])).filter(Number.isFinite).sort((a,b)=>a-b);
  if(values.length<4)continue;
  const quantile=fraction=>{const position=(values.length-1)*fraction,lower=Math.floor(position),weight=position-lower;return values[lower]*(1-weight)+values[Math.min(lower+1,values.length-1)]*weight};
  const q1=quantile(.25),q3=quantile(.75),spread=q3-q1;
  if(spread>0)count+=values.filter(value=>value<q1-1.5*spread||value>q3+1.5*spread).length;
 }
 return count;
}

function renderQualityChecks(){
 if(!S.rows.length)return;
 const duplicates=duplicateCounts(S.rows),missing=S.cols.reduce((total,column)=>total+column.missing,0),inconsistent=categoryInconsistencies(),outliers=outlierCount();
 const findings=[];
 findings.push(`${missing} missing cells across ${S.cols.filter(column=>column.missing).length} columns.`);
 findings.push(`${duplicates} exact duplicate row${duplicates===1?'':'s'}.`);
 findings.push(`${inconsistent.length} category spelling/case ${inconsistent.length===1?'inconsistency':'inconsistencies'}.`);
 findings.push(`${outliers} potential numeric outlier${outliers===1?'':'s'} (1.5× IQR; statistical flags only).`);
 $('#qualitySummary').textContent=findings.join(' ');
 const details=[...inconsistent];
 for(const column of S.cols.filter(item=>item.missing))details.push(`${column.name}: ${column.missing} missing value${column.missing===1?'':'s'}; no automatic fill is applied.`);
 if(!details.length)details.push('No missing values or inconsistent category labels detected.');
 const renderList=(selector,items)=>$(selector).replaceChildren(...items.map(text=>{const item=document.createElement('li');item.textContent=text;return item}));
 renderList('#qualityDetails',details);
 $('#undoFixes').disabled=!S.undoRows;
}

function prepareQualityFixes(){
 const fixTrim=$('#fixTrim').checked,fixCategories=$('#fixCategories').checked,removeDuplicates=$('#fixDuplicates').checked;
 if(!fixTrim&&!fixCategories&&!removeDuplicates)throw Error('Choose at least one fix to preview.');
 let rows=S.rows.map(row=>Object.fromEntries(S.cols.map(column=>[column.name,typeof row[column.name]==='string'&&fixTrim?row[column.name].trim():row[column.name]])));
 if(fixCategories){
  for(const column of S.cols.filter(item=>item.type==='cat')){
   const counts=new Map();
   for(const row of rows){const value=String(row[column.name]??'');if(miss(value))continue;const key=value.trim().toLocaleLowerCase();if(!counts.has(key))counts.set(key,new Map());const variants=counts.get(key);variants.set(value.trim(),(variants.get(value.trim())||0)+1)}
   const canonical=new Map([...counts].map(([key,variants])=>[key,[...variants].sort((left,right)=>right[1]-left[1])[0][0]]));
   for(const row of rows){const value=String(row[column.name]??''),standard=canonical.get(value.trim().toLocaleLowerCase());if(standard)row[column.name]=standard}
  }
 }
 const previewRows=rows.map(row=>({...row}));
 const modifiedCount=previewRows.reduce((count,row,index)=>count+(JSON.stringify(S.rows[index])!==JSON.stringify(row)),0);
 const beforeDuplicates=rows.length;
 if(removeDuplicates){const seen=new Set();rows=rows.filter(row=>{const key=JSON.stringify(S.cols.map(column=>row[column.name]??''));if(seen.has(key))return false;seen.add(key);return true})}
 S.fixPreview={rows,previewRows,duplicatesRemoved:beforeDuplicates-rows.length};
 const changed=modifiedCount+S.fixPreview.duplicatesRemoved;
 const head=['Original row',...S.cols.map(column=>column.name)],examples=[];
 for(let index=0;index<Math.min(previewRows.length,5);index++)if(JSON.stringify(S.rows[index])!==JSON.stringify(previewRows[index]))examples.push([index+1,...S.cols.map(column=>previewRows[index][column.name])]);
 makeTable('#fixPreviewTable thead','#fixPreviewTable tbody',head,examples);
 $('#fixPreview').hidden=false;
 $('#applyFixes').disabled=false;
 $('#qualityStatus').textContent=`Preview: ${changed} row${changed===1?'':'s'} changed; ${S.fixPreview.duplicatesRemoved} duplicate row${S.fixPreview.duplicatesRemoved===1?'':'s'} would be removed. Review sample changes, then apply or discard.`;
}

function applyQualityFixes(){
 if(!S.fixPreview)throw Error('Preview the selected fixes before applying them.');
 S.undoRows=S.rows.map(row=>({...row}));
 S.rows=S.fixPreview.rows;
 S.fixPreview=null;
 S.cellSelection=null;
 S.formulaColumn=null;
 S.pivotResult=null;
 inspect();
 S.rec=auto();
 $('#fixPreview').hidden=true;
 $('#pivotOutput').hidden=true;
 $('#formulaOutput').hidden=true;
 $('#applyFixes').disabled=true;
 $('#formulaOutput').hidden=true;
 renderPreview();
 fillAnalysisControls();
 if(S.cfg){fillControls();drawChart()}
 $('#qualityStatus').textContent='Fixes applied. Use Undo last fix to restore the previous dataset.';
 renderQualityChecks();
}

function undoQualityFixes(){
 if(!S.undoRows)return;
 S.rows=S.undoRows;
 S.undoRows=null;
 S.pivotResult=null;
 $('#pivotOutput').hidden=true;
 inspect();
 S.rec=auto();
 renderPreview();
 fillAnalysisControls();
 if(S.cfg){fillControls();drawChart()}
 $('#qualityStatus').textContent='The previous dataset has been restored.';
}

function excelColumnIndex(label){
 let index=0;
 for(const character of label.toUpperCase())index=index*26+character.charCodeAt(0)-64;
 return index-1;
}

function tokenizeFormula(source){
 const tokens=[];
 const pattern=/^\s*(?:(\d+(?:\.\d*)?|\.\d+(?:[eE][+-]?\d+)?)|("(?:[^"]|"")*")|(\[[^\]]+\])|(\$?[A-Za-z]{1,3}\$?\d+)|(\$?[A-Za-z][A-Za-z0-9_.]*)|(<=|>=|<>|[(),;:+\-*/&=<>]))/;
 let rest=source;
 while(rest.trim()){
  const match=rest.match(pattern);
  if(!match)throw Error(`Unexpected formula text near "${rest.slice(0,16)}".`);
  rest=rest.slice(match[0].length);
  const [raw,number,string,structured,cell,identifier,operator]=match;
  if(!raw.trim())continue;
  if(number!==undefined)tokens.push({type:'number',value:Number(number)});
  else if(string!==undefined)tokens.push({type:'string',value:string.slice(1,-1).replace(/""/g,'"')});
  else if(structured!==undefined)tokens.push({type:'header',value:structured.slice(1,-1)});
  else if(cell!==undefined)tokens.push({type:'reference',value:cell.replace(/\$/g,'')});
  else if(identifier!==undefined)tokens.push({type:'identifier',value:identifier});
  else tokens.push({type:operator===','||operator===';'?'separator':'operator',value:operator});
 }
 tokens.push({type:'eof',value:''});
 return tokens;
}

function parseFormula(source){
 const tokens=tokenizeFormula(source.startsWith('=')?source.slice(1):source);
 let position=0;
 const current=()=>tokens[position];
 const take=()=>tokens[position++];
 const accept=value=>current().value===value?(take(),true):false;
 const precedence={'=':1,'<>':1,'<':1,'>':1,'<=':1,'>=':1,'&':2,'+':3,'-':3,'*':4,'/':4};
 function primary(){
  const token=take();
  if(token.type==='number'||token.type==='string')return{type:'literal',value:token.value};
  if(token.type==='operator'&&token.value==='-')return{type:'unary',operator:'-',value:primary()};
  if(token.type==='operator'&&token.value==='+')return{type:'unary',operator:'+',value:primary()};
  if(token.value==='('){
   const value=expression();
   if(!accept(')'))throw Error('Missing closing parenthesis.');
   return value;
  }
  if(token.type==='header'||token.type==='reference'||token.type==='identifier'){
   if(token.type==='identifier'&&accept('(')){
    const args=[];
    if(!accept(')')){
     do{args.push(expression())}while(current().type==='separator'&&(take(),true));
     if(!accept(')'))throw Error(`Missing closing parenthesis after ${token.value}.`);
    }
    return{type:'call',name:token.value.toUpperCase(),args};
   }
   const reference={type:'reference',value:token.value,explicitHeader:token.type==='header'};
   if(accept(':')){
    const end=take();
    if(!['header','reference','identifier'].includes(end.type))throw Error('A range must have a column or cell reference on both sides of ":".');
    return{type:'range',start:reference,end:{type:'reference',value:end.value,explicitHeader:end.type==='header'}};
   }
   if(token.type==='identifier'&&/^(TRUE|FALSE)$/i.test(token.value))return{type:'literal',value:/^TRUE$/i.test(token.value)};
   return reference;
  }
  throw Error('Expected a value, column reference, or function.');
 }
 function expression(minimum=0){
  let left=primary();
  while(current().type==='operator'&&(precedence[current().value]||0)>minimum){
   const operator=take().value,level=precedence[operator],right=expression(level);
   left={type:'binary',operator,left,right};
  }
  return left;
 }
 const tree=expression();
 if(current().type!=='eof')throw Error(`Unexpected "${current().value}" after the formula.`);
 return tree;
}

function formulaGrid(){
 return [S.cols.map(column=>column.name),...S.rows.map(row=>S.cols.map(column=>row[column.name]??''))];
}

function excelColumnLabel(index){
 let label='';
 for(index++;index>0;index=Math.floor((index-1)/26))label=String.fromCharCode(65+(index-1)%26)+label;
 return label;
}

function formulaReference(reference){
 const value=reference.value;
 const cell=value.match(/^([A-Za-z]{1,3})(\d+)$/);
 if(cell)return{column:excelColumnIndex(cell[1]),row:Number(cell[2])};
 const header=S.cols.findIndex(column=>column.name.toLowerCase()===value.toLowerCase());
 if(reference.explicitHeader||header>=0)return{column:header,row:null};
 if(/^\$?[A-Za-z]{1,3}\$?$/.test(value))return{column:excelColumnIndex(value.replace(/\$/g,'')),row:null};
 throw Error(`Unknown column "${value}". Use a column letter or [${value}] reference.`);
}

function formulaRange(node){
 const first=formulaReference(node.start),last=formulaReference(node.end);
 const grid=formulaGrid();
 const left=Math.min(first.column,last.column),right=Math.max(first.column,last.column);
 if(left<0||right>=S.cols.length)throw Error('That column reference is outside the dataset.');
 const top=first.row==null||last.row==null?1:Math.min(first.row,last.row);
 const bottom=first.row==null||last.row==null?grid.length:Math.max(first.row,last.row);
 if(top<1||bottom>=grid.length+1)throw Error('That row reference is outside the dataset.');
 const matrix=grid.slice(top-1,bottom).map(row=>row.slice(left,right+1));
 return left===right?matrix.map(row=>row[0]):matrix;
}

function formulaResolveReference(reference){
 const position=formulaReference(reference),grid=formulaGrid();
 if(position.column<0||position.column>=S.cols.length)throw Error('That column reference is outside the dataset.');
 if(position.row==null)return grid.map(row=>row[position.column]);
 if(position.row<1||position.row>grid.length)throw Error('That cell reference is outside the dataset.');
 return grid[position.row-1][position.column];
}

const formulaArray=value=>Array.isArray(value);
const formulaFlatten=value=>formulaArray(value)?value.flat(Infinity):[value];
const formulaMatrix=value=>formulaArray(value)?(formulaArray(value[0])?value:value.map(item=>[item])):[[value]];
const formulaScalar=value=>formulaArray(value)?(formulaArray(value[0])?value[0][0]:value[0]):value;
function formulaEqual(a,b){
 const first=num(a),second=num(b);
 return Number.isFinite(first)&&Number.isFinite(second)?first===second:String(a??'').toLowerCase()===String(b??'').toLowerCase();
}
function formulaCompare(a,b){
 const first=num(a),second=num(b);
 if(Number.isFinite(first)&&Number.isFinite(second))return first-second;
 return String(a??'').localeCompare(String(b??''),undefined,{numeric:true,sensitivity:'base'});
}
function formulaCriteria(value,criteria){
 const text=String(criteria??'');
 const match=text.match(/^(<=|>=|<>|=|<|>)(.*)$/);
 const operator=match?match[1]:'=';
 const expected=match?match[2]:text;
 if(operator==='='){
  if(expected.includes('*')||expected.includes('?')){
   const escaped=expected.replace(/[.+^${}()|[\]\\]/g,'\\$&').replace(/\*/g,'.*').replace(/\?/g,'.');
   return new RegExp(`^${escaped}$`,'i').test(String(value??''));
  }
  return formulaEqual(value,expected);
 }
 const order=formulaCompare(value,expected);
 return operator==='>'?order>0:operator==='<'?order<0:operator==='>='?order>=0:operator==='<='?order<=0:!formulaEqual(value,expected);
}

function evaluateFormula(node){
 if(node.type==='literal')return node.value;
 if(node.type==='reference')return formulaResolveReference(node);
 if(node.type==='range')return formulaRange(node);
 if(node.type==='unary'){
  const value=evaluateFormula(node.value),convert=item=>node.operator==='-'?-num(item):num(item);
  return formulaArray(value)?value.map(convert):convert(value);
 }
 if(node.type==='binary'){
  const left=evaluateFormula(node.left),right=evaluateFormula(node.right);
  const operation=(a,b)=>{
   if(node.operator==='&')return String(a??'')+String(b??'');
   if(['=','<>','<','>','<=','>='].includes(node.operator)){
    const order=formulaCompare(a,b);
    return node.operator==='='?formulaEqual(a,b):node.operator==='<>'?!formulaEqual(a,b):node.operator==='<'?order<0:node.operator==='>'?order>0:node.operator==='<='?order<=0:order>=0;
   }
   const first=num(a),second=num(b);
   if(!Number.isFinite(first)||!Number.isFinite(second))throw Error('Arithmetic formulas need numeric values.');
   if(node.operator==='/'&&second===0)throw Error('Cannot divide by zero.');
   return node.operator==='+'?first+second:node.operator==='-'?first-second:node.operator==='*'?first*second:first/second;
  };
  if(!formulaArray(left)&&!formulaArray(right))return operation(left,right);
  const length=Math.max(formulaFlatten(left).length,formulaFlatten(right).length);
  return Array.from({length},(_,index)=>operation(formulaArray(left)?formulaFlatten(left)[index]:left,formulaArray(right)?formulaFlatten(right)[index]:right));
 }
 if(node.type!=='call')throw Error('Invalid formula.');
 const name=node.name,args=node.args;
 const evaluate=index=>index<args.length?evaluateFormula(args[index]):undefined;
 if(name==='IF'){
  if(args.length<2||args.length>3)throw Error('IF needs 2 or 3 arguments.');
  const test=evaluate(0);
  if(!formulaArray(test))return test?evaluate(1):args.length===3?evaluate(2):false;
  const yes=evaluate(1),no=args.length===3?evaluate(2):false;
  return formulaFlatten(test).map((value,index)=>value?(formulaArray(yes)?formulaFlatten(yes)[index]:yes):(formulaArray(no)?formulaFlatten(no)[index]:no));
 }
 if(name==='IFERROR'){
  if(args.length!==2)throw Error('IFERROR needs 2 arguments.');
  try{return evaluate(0)}catch(error){return evaluate(1)}
 }
 const values=args.map((_,index)=>evaluate(index));
 const first=value=>formulaScalar(value);
 const flatten=value=>formulaFlatten(value);
 const requireArgs=(minimum,maximum=minimum)=>{if(args.length<minimum||args.length>maximum)throw Error(`${name} needs ${minimum===maximum?minimum:`${minimum} to ${maximum}`} arguments.`)};
 const rowCount=matrix=>matrix.length;
 const colCount=matrix=>matrix[0]?.length||0;
 const rowsOf=value=>formulaMatrix(value);
 switch(name){
  case 'SUM':requireArgs(1,255);return values.flatMap(flatten).reduce((total,item)=>total+(Number.isFinite(num(item))?num(item):0),0);
  case 'COUNT':requireArgs(1,255);return values.flatMap(flatten).filter(item=>item!==''&&item!=null&&Number.isFinite(num(item))).length;
  case 'COUNTA':requireArgs(1,255);return values.flatMap(flatten).filter(item=>item!==''&&item!=null).length;
  case 'AVERAGE':{
   requireArgs(1,255);const numbers=values.flatMap(flatten).map(num).filter(Number.isFinite);
   if(!numbers.length)throw Error('AVERAGE has no numeric values.');
   return numbers.reduce((total,item)=>total+item,0)/numbers.length;
  }
  case 'SUMIF':case 'COUNTIF':case 'AVERAGEIF':{
   requireArgs(2,name==='SUMIF'||name==='AVERAGEIF'?3:2);
   const criteriaRange=flatten(values[0]),criteria=first(values[1]),sumRange=name==='COUNTIF'?criteriaRange:flatten(args.length===3?values[2]:values[0]);
   if(criteriaRange.length!==sumRange.length)throw Error(`${name} ranges must have the same number of cells.`);
   const selected=criteriaRange.map((item,index)=>formulaCriteria(item,criteria)?sumRange[index]:null).filter(item=>item!==null);
   if(name==='COUNTIF')return selected.length;
   const numbers=selected.map(num).filter(Number.isFinite);
   if(name==='SUMIF')return numbers.reduce((total,item)=>total+item,0);
   if(!numbers.length)throw Error('AVERAGEIF found no numeric matches.');
   return numbers.reduce((total,item)=>total+item,0)/numbers.length;
  }
  case 'SUMIFS':case 'COUNTIFS':case 'AVERAGEIFS':{
   const hasResultRange=name!=='COUNTIFS',minimum=hasResultRange?3:2;
   if(args.length<minimum||args.length%2!==(hasResultRange?1:0))throw Error(`${name} needs a range followed by one or more criteria-range and criteria pairs.`);
   const sumRange=hasResultRange?flatten(values[0]):null,start=hasResultRange?1:0;
   const ranges=[];
   for(let index=start;index<values.length;index+=2)ranges.push([flatten(values[index]),first(values[index+1])]);
   const length=ranges[0][0].length;
   if(ranges.some(([range])=>range.length!==length)||sumRange&&sumRange.length!==length)throw Error(`${name} ranges must have the same number of cells.`);
   const matched=Array.from({length},(_,index)=>index).filter(index=>ranges.every(([range,criteria])=>formulaCriteria(range[index],criteria)));
   if(name==='COUNTIFS')return matched.length;
   const selected=matched.map(index=>sumRange[index]).map(num).filter(Number.isFinite);
   if(name==='SUMIFS')return selected.reduce((total,item)=>total+item,0);
   if(!selected.length)throw Error('AVERAGEIFS found no numeric matches.');
   return selected.reduce((total,item)=>total+item,0)/selected.length;
  }
  case 'XLOOKUP':{
   requireArgs(3,6);
   const lookup=first(values[0]),lookups=flatten(values[1]),returnArray=values[2],returnMatrix=formulaArray(returnArray[0])?returnArray:null,returns=returnMatrix?returnMatrix.map(row=>row):flatten(returnArray);
   if(lookups.length!==returns.length)throw Error('XLOOKUP lookup and return arrays must have the same length.');
   const matchMode=values.length>4?Number(first(values[4])):0,searchMode=values.length>5?Number(first(values[5])):1;
   if(![0,-1,1,2].includes(matchMode)||![1,-1,2,-2].includes(searchMode))throw Error('XLOOKUP received an unsupported match or search mode.');
   let index=-1;
   const order=searchMode===-1||searchMode===-2?Array.from({length:lookups.length},(_,i)=>lookups.length-i-1):Array.from({length:lookups.length},(_,i)=>i);
   for(const candidate of order)if(formulaEqual(lookups[candidate],lookup)){index=candidate;break}
   if(index<0&&matchMode===2){const wildcard=String(lookup).replace(/[.+^${}()|[\]\\]/g,'\\$&').replace(/\*/g,'.*').replace(/\?/g,'.');index=order.find(candidate=>new RegExp(`^${wildcard}$`,'i').test(String(lookups[candidate]??'')))??-1}
   if(index<0&&matchMode!==0){
    const eligible=order.filter(candidate=>matchMode===1?formulaCompare(lookups[candidate],lookup)>0:formulaCompare(lookups[candidate],lookup)<0);
    if(eligible.length)index=eligible.reduce((best,candidate)=>Math.abs(formulaCompare(lookups[candidate],lookup))<Math.abs(formulaCompare(lookups[best],lookup))?candidate:best,eligible[0]);
   }
   if(index<0){if(values.length>3)return values[3];throw Error('#N/A')}
   return returns[index];
  }
  case 'VLOOKUP':case 'HLOOKUP':{
   requireArgs(3,4);
   const table=rowsOf(values[1]),horizontal=name==='HLOOKUP';
   const lookup=first(values[0]),returnIndex=Number(first(values[2]));
   const outer=horizontal?colCount(table):rowCount(table),inner=horizontal?rowCount(table):colCount(table);
   if(!Number.isInteger(returnIndex)||returnIndex<1||returnIndex>inner)throw Error(`${name} return index is outside the lookup table.`);
   const approximate=values.length<4||first(values[3])!==false,findAt=index=>horizontal?table[0][index]:table[index][0];
   let found=-1;
   for(let index=0;index<outer;index++)if(formulaEqual(findAt(index),lookup)){found=index;break}
   if(found<0&&approximate)for(let index=0;index<outer;index++)if(formulaCompare(findAt(index),lookup)<=0)found=index;
   if(found<0)throw Error('#N/A');
   return horizontal?table[returnIndex-1][found]:table[found][returnIndex-1];
  }
  case 'INDEX':{
   requireArgs(2,3);
   const table=rowsOf(values[0]),row=Number(first(values[1])),column=values.length>2?Number(first(values[2])):1;
   if(row===0&&column===0)return table;
   if(row===0){if(column<1||column>colCount(table))throw Error('INDEX column is outside the selected range.');return table.map(item=>item[column-1])}
   if(column===0){if(row<1||row>rowCount(table))throw Error('INDEX row is outside the selected range.');return table[row-1]}
   if(row<1||row>rowCount(table)||column<1||column>colCount(table))throw Error('INDEX position is outside the selected range.');
   return table[row-1][column-1];
  }
  case 'MATCH':{
   requireArgs(2,3);
   const lookup=first(values[0]),list=flatten(values[1]),mode=values.length>2?Number(first(values[2])):1;
   if(![-1,0,1].includes(mode))throw Error('MATCH match type must be -1, 0, or 1.');
   let found=-1;
   if(mode===0)found=list.findIndex(item=>formulaEqual(item,lookup));
   else for(let index=0;index<list.length;index++)if(mode===1?formulaCompare(list[index],lookup)<=0:formulaCompare(list[index],lookup)>=0)found=index;
   if(found<0)throw Error('#N/A');
   return found+1;
  }
  case 'TEXTJOIN':{
   requireArgs(3,255);
   const delimiter=String(first(values[0])??''),ignoreEmpty=Boolean(first(values[1]));
   return values.slice(2).flatMap(flatten).filter(value=>!ignoreEmpty||value!==''&&value!=null).map(value=>String(value??'')).join(delimiter);
  }
  case 'FILTER':{
   requireArgs(2,3);
   const table=rowsOf(values[0]),include=flatten(values[1]);
   if(table.length!==include.length)throw Error('FILTER include array must match the number of rows in the selected range.');
   const filtered=table.filter((_,index)=>Boolean(include[index]));
   if(!filtered.length)return values.length===3?values[2]:(()=>{throw Error('FILTER found no matching rows.')})();
   return formulaArray(values[0][0])?filtered:filtered.map(row=>row[0]);
  }
  case 'UNIQUE':{
   requireArgs(1,3);
   const table=rowsOf(values[0]),byColumn=values.length>1&&Boolean(first(values[1])),once=values.length>2&&Boolean(first(values[2]));
   const items=byColumn?table[0].map((_,column)=>table.map(row=>row[column])):table;
   const keys=items.map(item=>JSON.stringify(item)),unique=items.filter((item,index)=>once?keys.indexOf(keys[index])===keys.lastIndexOf(keys[index]):keys.indexOf(keys[index])===index);
   const result=byColumn?unique.reduce((matrix,column)=>matrix.map((row,index)=>[...row,column[index]]),Array.from({length:unique[0]?.length||0},()=>[])):unique;
   return formulaArray(values[0][0])||byColumn?result:result.map(row=>row[0]);
  }
  case 'SORT':{
   requireArgs(1,4);
   const table=rowsOf(values[0]),sortIndex=values.length>1?Number(first(values[1])):1,order=values.length>2?Number(first(values[2])):1,byColumn=values.length>3&&Boolean(first(values[3]));
   const dimension=byColumn?rowCount(table):colCount(table);
   if(!Number.isInteger(sortIndex)||sortIndex<1||sortIndex>dimension||![1,-1].includes(order))throw Error('SORT received an invalid column index or sort order.');
   if(byColumn){
    const columns=table[0].map((_,column)=>table.map(row=>row[column]));
    columns.sort((a,b)=>formulaCompare(a[sortIndex-1],b[sortIndex-1])*order);
    return table.map((_,row)=>columns.map(column=>column[row]));
   }
   const sorted=table.slice().sort((a,b)=>formulaCompare(a[sortIndex-1],b[sortIndex-1])*order);
   return formulaArray(values[0][0])?sorted:sorted.map(row=>row[0]);
  }
  case 'LEFT':case 'RIGHT':{
   requireArgs(1,2);
   const count=values.length>1?Number(first(values[1])):1;
   if(!Number.isInteger(count)||count<0)throw Error(`${name} character count must be a non-negative integer.`);
   const transform=value=>name==='LEFT'?String(value??'').slice(0,count):count===0?'':String(value??'').slice(-count);
   return formulaArray(values[0])?flatten(values[0]).map(transform):transform(values[0]);
  }
  case 'MID':{
   requireArgs(3);
   const start=Number(first(values[1])),count=Number(first(values[2]));
   if(!Number.isInteger(start)||start<1||!Number.isInteger(count)||count<0)throw Error('MID start must be at least 1 and character count must be non-negative.');
   const transform=value=>String(value??'').slice(start-1,start-1+count);
   return formulaArray(values[0])?flatten(values[0]).map(transform):transform(values[0]);
  }
  default:throw Error(`Unsupported Excel function "${name}".`);
 }
}

function calculateFormula(source){
 if(!S.rows.length)throw Error('Load a dataset before running a formula.');
 if(!source.trim())throw Error('Enter an Excel formula first.');
 return evaluateFormula(parseFormula(source.trim()));
}

function splitFormulaArguments(source){
 const parts=[];
 let start=0,depth=0,quoted=false;
 for(let index=0;index<source.length;index++){
  const character=source[index];
  if(character==='"'){
   if(quoted&&source[index+1]==='"'){index++;continue}
   quoted=!quoted;
  }else if(!quoted&&character==='(')depth++;
  else if(!quoted&&character===')')depth--;
  else if(!quoted&&depth===0&&character===','){
   parts.push(source.slice(start,index).trim());
   start=index+1;
  }
 }
 if(quoted||depth!==0)throw Error('Check the quotes and parentheses in the other arguments.');
 const final=source.slice(start).trim();
 if(final)parts.push(final);
 if(parts.some(part=>!part))throw Error('Enter a value for each other argument, or remove the extra comma.');
 return parts;
}

function buildSelectedFormula(){
 if(!selectedExcelFunction)throw Error('Select an Excel function first.');
 const range=$('#formulaRange').value.trim();
 if(!range)throw Error('Enter the dataset range for this function.');
 const spec=EXCEL_FUNCTION_SPECS[selectedExcelFunction],extras=splitFormulaArguments($('#formulaArguments').value.trim());
 const args=[...extras];
 args.splice(spec.rangeIndex,0,range);
 return `=${selectedExcelFunction}(${args.join(',')})`;
}

function renderFormulaResult(value){
 const output=$('#formulaOutput'),head=document.createElement('tr'),body=document.createDocumentFragment();
 const matrix=formulaMatrix(value);
 const resultValues=formulaFlatten(value);
 if(resultValues.length===S.rows.length&&Array.isArray(value)&&['IF','LEFT','RIGHT','MID'].includes(selectedExcelFunction)){
  S.formulaColumn={name:`${selectedExcelFunction||'Formula'} result`,values:resultValues};
  output.hidden=true;
  $('#formulaStatus').textContent=`${S.formulaColumn.name} added to the dataset preview.`;
  renderPreview();
  return;
 }
 S.formulaColumn=null;
 renderPreview();
 const columnNames=Array.isArray(value)&&Array.isArray(value[0])?Array.from({length:matrix[0]?.length||0},(_,index)=>`Result ${index+1}`):['Result'];
 for(const name of columnNames){const cell=document.createElement('th');cell.scope='col';cell.textContent=name;head.append(cell)}
 $('#formulaTable thead').replaceChildren(head);
 for(const row of matrix){
  const tableRow=document.createElement('tr');
  for(let index=0;index<columnNames.length;index++){const cell=document.createElement('td');cell.textContent=String(row[index]??'');tableRow.append(cell)}
  body.append(tableRow);
 }
 $('#formulaTable tbody').replaceChildren(body);
 output.hidden=false;
 $('#formulaStatus').textContent=formulaArray(value)?`${matrix.length} result row${matrix.length===1?'':'s'}.`:`Result: ${String(value??'')}`;
}

function updateFormulaColumns(){
 $('#formulaColumns').textContent=S.cols.map((column,index)=>`${excelColumnLabel(index)}: ${column.name}`).join(' · ');
}

function runFormula(){
 try{
  const result=calculateFormula($('#formulaInput').value);
  renderFormulaResult(result);
 }catch(error){
  $('#formulaOutput').hidden=true;
  $('#formulaStatus').textContent=error.message||'Could not calculate this formula.';
 }
}

function runSelectedFunction(){
 try{
  $('#formulaInput').value=buildSelectedFormula();
  runFormula();
 }catch(error){
  $('#formulaOutput').hidden=true;
  $('#formulaStatus').textContent=error.message||'Could not calculate this function.';
 }
}

$('#runFormula').addEventListener('click',runFormula);
$('#formulaInput').addEventListener('keydown',event=>{if(event.key==='Enter')runFormula()});
$('#formulaInput').addEventListener('input',()=>{selectedExcelFunction=''});
$('#runSelectedFunction').addEventListener('click',runSelectedFunction);
$('#formulaRange').addEventListener('keydown',event=>{if(event.key==='Enter')$('#formulaArguments').focus()});
$('#formulaArguments').addEventListener('keydown',event=>{if(event.key==='Enter')runSelectedFunction()});
$('#cancelSelectedFunction').addEventListener('click',()=>{
 selectedExcelFunction='';
 $('#formulaBuilder').hidden=true;
 $('#formulaStatus').textContent='';
});
$('#clearFormula').addEventListener('click',()=>{
 S.formulaColumn=null;
 selectedExcelFunction='';
 $('#formulaBuilder').hidden=true;
 renderPreview();
 $('#formulaInput').value='';
 $('#formulaOutput').hidden=true;
 $('#formulaStatus').textContent='';
});

$('#previewSearch').addEventListener('input',()=>{S.preview.query=$('#previewSearch').value;S.preview.page=0;renderPreview()});
$('#previewPrevious').addEventListener('click',()=>{S.preview.page=Math.max(0,S.preview.page-1);renderPreview()});
$('#previewNext').addEventListener('click',()=>{S.preview.page+=1;renderPreview()});
$('#showAllRecords').addEventListener('click',()=>{
 S.preview.query='';
 S.preview.page=0;
 $('#previewSearch').value='';
 renderPreview();
});
$('#runPivot').addEventListener('click',()=>{
 try{buildPivot()}catch(error){$('#pivotStatus').textContent=error.message||'Could not build the pivot table.'}
});
$('#exportPivot').addEventListener('click',()=>{
 if(!S.pivotResult)return;
 try{download('plotline-pivot.csv',Papa.unparse([S.pivotResult.headers,...S.pivotResult.rows]),'text/csv;charset=utf-8')}
 catch(error){$('#pivotStatus').textContent=error.message||'Could not export the pivot table.'}
});
$('#kpiGroup').addEventListener('change',updateComparisonOptions);
$('#runKpi').addEventListener('click',()=>{
 try{calculateKpis()}catch(error){$('#kpiStatus').textContent=error.message||'Could not calculate KPIs.'}
});
$('#guidedQuestion').addEventListener('change',()=>{$('#runGuided').disabled=!analysisMeasures().length&&!['missing','duplicates'].includes($('#guidedQuestion').value)});
$('#runGuided').addEventListener('click',()=>{
 try{runGuidedAnalysis()}catch(error){$('#guidedAnswer').textContent=error.message||'Could not answer that question.';$('#guidedOutput').hidden=true}
});
$('#previewFixes').addEventListener('click',()=>{
 try{prepareQualityFixes()}catch(error){$('#qualityStatus').textContent=error.message||'Could not preview these fixes.'}
});
$('#applyFixes').addEventListener('click',()=>{
 try{applyQualityFixes()}catch(error){$('#qualityStatus').textContent=error.message||'Could not apply these fixes.'}
});
$('#undoFixes').addEventListener('click',undoQualityFixes);
$('#previewTable thead').addEventListener('click',event=>{
 const button=event.target.closest('button[data-sort]');
 if(!button)return;
 const sort=button.dataset.sort;
 if(S.preview.sort===sort)S.preview.direction*=-1;
 else{S.preview.sort=sort;S.preview.direction=1}
 renderPreview();
});
$('#previewTable').addEventListener('pointerdown',event=>{
 const cell=event.target.closest('td[data-row-index][data-column-index]');
 if(!cell)return;
 selectDatasetCell(Number(cell.dataset.rowIndex),Number(cell.dataset.columnIndex),event.shiftKey);
});
$('#previewTable').addEventListener('pointerover',event=>{
 if(!(event.buttons&1))return;
 const cell=event.target.closest('td[data-row-index][data-column-index]');
 if(cell)selectDatasetCell(Number(cell.dataset.rowIndex),Number(cell.dataset.columnIndex),true);
});
$('#previewTable').addEventListener('click',event=>{
 const cell=event.target.closest('td[data-row-index][data-column-index]');
 if(cell&&event.shiftKey)selectDatasetCell(Number(cell.dataset.rowIndex),Number(cell.dataset.columnIndex),true);
});

function setChartFilter(value,updateInput=true){
 S.filterText=value.trim();
 if(updateInput)$('#chartFilter').value=S.filterText;
 $('#clearChartFilter').disabled=!S.filterText;
 fillControls();
 drawChart();
}

$('#chartFilter').addEventListener('input',()=>setChartFilter($('#chartFilter').value,false));
$('#clearChartFilter').addEventListener('click',()=>setChartFilter(''));

function drawChart(){
 if(!window.Chart)throw Error('The chart library did not load. Check your internet connection and reload the page.');
 if(ch){ch.destroy();ch=null}
 const config=S.cfg;
 updateReport(S.rec);
 const issue=chartIssue(config.type,config.x,config.ys);
 $('#chartIssue').textContent=issue;
 $('#chartIssue').hidden=!issue;
 if(issue){say(issue);return}
 const rows=visibleRows();
 const colors=P[config.palette]||P.Studio;
 const type=config.type==='stacked'?'bar':config.type==='area'?'line':config.type;
 let data;
 if(config.type==='scatter'){
  const xColumn=S.cols.find(column=>column.name===config.x);
  if(!xColumn||xColumn.type!=='num')throw Error('Scatter charts need a numeric X axis. Choose one in the X axis menu.');
  data={datasets:config.ys.map((name,index)=>({label:name,data:rows.map(row=>({x:num(row[config.x]),y:num(row[name])})).filter(point=>isFinite(point.x)&&isFinite(point.y)),backgroundColor:config.colors.series[name]||colors[index%colors.length]}))};
 }else{
  const labels=rows.map(row=>String(row[config.x]??''));
  const series=config.type==='pie'?config.ys.slice(0,1):config.ys;
  data={labels,datasets:series.map((name,index)=>{
   const sliceColors=labels.map((label,item)=>config.colors.slices[label]||colors[item%colors.length]);
   const seriesColor=config.colors.series[name]||colors[index%colors.length];
  return{label:name,data:rows.map(row=>miss(row[name])?null:num(row[name])),backgroundColor:config.type==='pie'?sliceColors:seriesColor,borderColor:config.type==='pie'?sliceColors:seriesColor,borderWidth:2,tension:.25,fill:config.type==='area'};
  })};
 }
 const ink=getComputedStyle(document.documentElement).getPropertyValue('--ink').trim();
 const mute=getComputedStyle(document.documentElement).getPropertyValue('--mute').trim();
 const grid=getComputedStyle(document.documentElement).getPropertyValue('--grid').trim();
 const options={responsive:true,maintainAspectRatio:false,interaction:{mode:['scatter','pie'].includes(config.type)?'nearest':'index',intersect:['scatter','pie'].includes(config.type)},plugins:{legend:{display:config.legend,labels:{color:mute}},tooltip:{enabled:true,callbacks:{label(context){if(config.type==='scatter')return `${context.dataset.label}: (${fm(context.parsed.x)}, ${fm(context.parsed.y)})`;const value=config.type==='pie'?context.parsed:context.parsed.y;return `${context.dataset.label}: ${fm(value)}`}}},title:{display:Boolean(config.title),text:config.title,color:ink},zoom:{zoom:{wheel:{enabled:true},pinch:{enabled:true},drag:{enabled:true,threshold:4},mode:'xy'},pan:{enabled:true,mode:'xy'}}},scales:{}};
 $('#zoomControls').hidden=false;
 $('#zoomHint').textContent=config.type==='pie'?'Scroll over the pie or use the buttons to zoom.':'Scroll or drag on the chart to inspect a range.';
 if(config.type==='pie')options.radius=`${Math.round(pieZoom*100)}%`;
 if(!['pie'].includes(config.type)){
  options.scales={x:{title:{display:Boolean(config.xLabel),text:config.xLabel,color:mute},ticks:{color:mute,autoSkip:true,maxTicksLimit:12},grid:{color:grid},stacked:config.type==='stacked'},y:{title:{display:Boolean(config.yLabel),text:config.yLabel,color:mute},ticks:{color:mute,maxTicksLimit:8},grid:{color:grid},stacked:config.type==='stacked',beginAtZero:config.type==='bar'||config.type==='stacked'}};
 }
 ch=new Chart($('#cv'),{type,data,options});
 say('');
}

function updateReport(recommendation){
 const rows=visibleRows(),config=S.cfg;
 const chartDetails=[`Chart type: ${T.find(([type])=>type===config.type)?.[1]||config.type}.`];
 if(config.title.trim())chartDetails.push(`Chart title: ${config.title.trim()}.`);
 const axisLabel=config.xLabel&&config.xLabel!==config.x?` (${config.xLabel})`:'';
 chartDetails.push(config.type==='pie'?`Slice categories: ${config.x}${axisLabel}.`:`X axis: ${config.x}${axisLabel}.`);
 if(config.yLabel)chartDetails.push(`Y axis label: ${config.yLabel}.`);
 chartDetails.push(`Value series: ${config.ys.join(', ')}.`);
 chartDetails.push(S.filterText?`Showing ${rows.length} of ${S.rows.length} rows matching "${S.filterText}".`:`Showing all ${S.rows.length} dataset rows.`);
 if(recommendation)chartDetails.push(`Recommendation (heuristic): ${recommendation.why}`);
 const xColumn=S.cols.find(column=>column.name===config.x);
 for(const name of config.ys){
  const points=rows.map(row=>({row,value:num(row[name])})).filter(point=>Number.isFinite(point.value));
  if(!points.length){chartDetails.push(`Observed: ${name} has no numeric values in the current chart view.`);continue}
  const stats=points.reduce((result,point)=>{result.low=Math.min(result.low,point.value);result.high=Math.max(result.high,point.value);result.total+=point.value;return result},{low:Infinity,high:-Infinity,total:0});
  chartDetails.push(`Observed: ${name} has ${points.length} numeric values, ranging from ${fm(stats.low)} to ${fm(stats.high)}; average ${fm(stats.total/points.length)}.`);
  if((config.type==='line'||config.type==='area')&&xColumn?.type==='date'){
   const dated=points.map(point=>({label:String(point.row[config.x]??''),date:dk(xColumn,point.row[config.x]),value:point.value})).filter(point=>Number.isFinite(point.date)).sort((a,b)=>a.date-b.date);
   if(dated.length>1){
    const first=dated[0],last=dated[dated.length-1],change=last.value-first.value,direction=change>0?'increased':change<0?'decreased':'had no net change';
    const percent=first.value!==0?` (${fm(Math.abs(change/first.value*100))}% change)`:'';
    chartDetails.push(`Observed date-order change: ${name} ${direction} from ${first.label} (${fm(first.value)}) to ${last.label} (${fm(last.value)})${percent}.`);
    const periods=[];
    for(let index=1;index<dated.length;index++){
     const previous=dated[index-1],current=dated[index];
     if(current.date<=previous.date)continue;
     periods.push({previous,current,change:current.value-previous.value});
    }
    if(periods.length){
     const periodText=period=>{
      const delta=period.change,sign=delta>0?'+':'';
      const percent=period.previous.value!==0?` (${fm(Math.abs(delta/period.previous.value*100))}%)`:'';
      return `${period.previous.label} to ${period.current.label}: ${sign}${fm(delta)}${percent}`;
     };
     const recent=periods.slice(-5).map(periodText);
     chartDetails.push(`Recent period-over-period changes for ${name}: ${recent.join('; ')}${periods.length>recent.length?`; latest ${recent.length} of ${periods.length} periods`:''}.`);
     const latest=periods[periods.length-1];
     chartDetails.push(`Latest period: ${name} ${latest.change>0?'increased':latest.change<0?'decreased':'was unchanged'} from ${latest.previous.label} (${fm(latest.previous.value)}) to ${latest.current.label} (${fm(latest.current.value)}).`);
     const increases=periods.filter(period=>period.change>0).sort((a,b)=>b.change-a.change);
     const decreases=periods.filter(period=>period.change<0).sort((a,b)=>a.change-b.change);
     if(increases.length)chartDetails.push(`Largest increase: ${name} rose by ${fm(increases[0].change)} from ${increases[0].previous.label} (${fm(increases[0].previous.value)}) to ${increases[0].current.label} (${fm(increases[0].current.value)}).`);
     if(decreases.length)chartDetails.push(`Largest decrease: ${name} fell by ${fm(Math.abs(decreases[0].change))} from ${decreases[0].previous.label} (${fm(decreases[0].previous.value)}) to ${decreases[0].current.label} (${fm(decreases[0].current.value)}).`);
    }
   }
  }
  if(points.length>=4){
   const ordered=points.map(point=>point.value).sort((a,b)=>a-b);
   const quantile=fraction=>{const position=(ordered.length-1)*fraction,lower=Math.floor(position),weight=position-lower;return ordered[lower]*(1-weight)+ordered[Math.min(lower+1,ordered.length-1)]*weight};
   const q1=quantile(.25),q3=quantile(.75),spread=q3-q1;
   if(spread>0){
    const unusual=points.filter(point=>point.value<q1-1.5*spread||point.value>q3+1.5*spread);
    if(unusual.length){
     const examples=unusual.slice(0,3).map(point=>`${fm(point.value)} at ${config.x}=${String(point.row[config.x]??'')}`).join('; ');
     chartDetails.push(`Potential outliers (IQR heuristic): ${unusual.length} value${unusual.length===1?'':'s'} flagged; ${examples}${unusual.length>3?'; and more':''}. This statistical flag does not mean the data is wrong.`);
    }
   }
  }
 }
 const datasetDetails=[`Dataset contains ${S.rows.length} rows and ${S.cols.length} columns.`];
 const typeCounts=S.cols.reduce((counts,column)=>{counts[column.type]=(counts[column.type]||0)+1;return counts},{});
 datasetDetails.push(`Column types: ${typeCounts.num||0} numeric, ${typeCounts.cat||0} category, ${typeCounts.date||0} date.`);
 datasetDetails.push(`Columns: ${S.cols.map(column=>`${column.name} (${column.type})`).join(', ')}.`);
 const missing=S.cols.reduce((total,column)=>total+column.missing,0);
 const invalid=S.cols.reduce((total,column)=>total+column.invalid,0);
 datasetDetails.push(`${missing} missing cell${missing===1?'':'s'} and ${invalid} non-numeric value${invalid===1?'':'s'} in numeric columns.`);
 const renderList=(selector,items)=>$(selector).replaceChildren(...items.map(text=>{const item=document.createElement('li');item.textContent=text;return item}));
 renderList('#sum',chartDetails);
 renderList('#dataset',datasetDetails);
 const warnings=[];
 for(const column of S.cols){
  if(column.missing)warnings.push(`${column.name}: ${column.missing} missing value${column.missing===1?'':'s'}. Inspect affected rows in Data preview; missing values remain blank in charts.`);
  if(column.invalid)warnings.push(`${column.name}: ${column.invalid} non-numeric value${column.invalid===1?'':'s'} ignored in charts. Review those rows in Data preview and correct the values or change the column type.`);
 }
 if(!warnings.length)warnings.push('No missing or invalid values found.');
 renderList('#chk',warnings);
 $('#why').textContent=recommendation?.why||'Chart generated from the selected columns.';
}

function loadRows(rows){
 S.rows=normalizeRows(rows);
 S.filterText='';
 S.formulaColumn=null;
 S.cellSelection=null;
 S.pivotResult=null;
 S.fixPreview=null;
 S.undoRows=null;
 selectedExcelFunction='';
 $('#formulaBuilder').hidden=true;
 $('#formulaRange').value='';
 $('#formulaArguments').value='';
 S.typeOverrides={};
 S.preview={query:'',sort:'',direction:1};
 $('#previewSearch').value='';
 $('#chartFilter').value='';
 $('#clearChartFilter').disabled=true;
 inspect();
 const recommendation=auto();
 if(!recommendation)throw Error('I could not find a category or date column and a numeric values column.');
 S.rec=recommendation;
 S.cfg=makeConfig(recommendation);
 $('#formulaInput').value='';
 $('#formulaOutput').hidden=true;
 $('#formulaStatus').textContent='';
 $('#cellSelectionHint').textContent='Click a cell or drag across cells to select a range for the active Excel function. Use Shift-click to extend the range.';
 $('#qualityStatus').textContent='';
 $('#pivotStatus').textContent='';
 $('#kpiStatus').textContent='';
 $('#guidedAnswer').textContent='';
 $('#guidedOutput').hidden=true;
 $('#guidedTable thead').replaceChildren();
 $('#guidedTable tbody').replaceChildren();
 $('#kpiCards').replaceChildren();
 $('#pivotOutput').hidden=true;
 $('#fixPreview').hidden=true;
 $('#empty').hidden=true;
 $('#preview').hidden=false;
 $('#res').hidden=false;
 $('#ctl').hidden=false;
 fillControls();
 fillAnalysisControls();
 updateFormulaColumns();
 renderPreview();
 drawChart();
}

function download(name,content,type){
 const url=URL.createObjectURL(new Blob([content],{type}));
 const link=document.createElement('a');link.href=url;link.download=name;link.click();
 URL.revokeObjectURL(url);
}

function isRecord(value){return value!==null&&typeof value==='object'&&!Array.isArray(value)}

function saveChartSettings(){
 const settings={version:SETTINGS_VERSION,columnTypes:{...S.typeOverrides},config:S.cfg};
 download('plotline-settings.json',JSON.stringify(settings,null,2),'application/json');
 $('#settingsStatus').textContent='Chart settings saved. Dataset values are not included.';
}

function analyzedRows(){
 if(!S.formulaColumn)return S.rows.map(row=>({...row}));
 if(S.cols.some(column=>column.name===S.formulaColumn.name))throw Error('The formula result column conflicts with a dataset column.');
 return S.rows.map((row,index)=>({...row,[S.formulaColumn.name]:S.formulaColumn.values[index]??''}));
}

function exportAnalyzedWorkbook(){
 if(!window.XLSX)throw Error('The Excel exporter did not load.');
 const workbook=XLSX.utils.book_new();
 XLSX.utils.book_append_sheet(workbook,XLSX.utils.json_to_sheet(analyzedRows()),'Analyzed data');
 if(S.pivotResult)XLSX.utils.book_append_sheet(workbook,XLSX.utils.aoa_to_sheet([S.pivotResult.headers,...S.pivotResult.rows]),'Pivot summary');
 XLSX.writeFile(workbook,'plotline-analyzed-data.xlsx');
}

function saveAnalysisProject(){
 if(!S.rows.length)throw Error('Load a dataset before saving a project.');
 const project={
  format:'plotline-analysis',
  version:1,
  rows:S.rows,
  typeOverrides:S.typeOverrides,
  chart:S.cfg,
  formulaColumn:S.formulaColumn,
  pivot:{group1:$('#pivotGroup1').value,group2:$('#pivotGroup2').value,measure:$('#pivotMeasure').value,operation:$('#pivotAggregate').value},
  kpi:{measure:$('#kpiMeasure').value,group:$('#kpiGroup').value,compareA:$('#kpiCompareA').value,compareB:$('#kpiCompareB').value},
  guided:$('#guidedAnswer').textContent?{question:$('#guidedQuestion').value,measure:$('#guidedMeasure').value}:null,
  filterText:S.filterText
 };
 download('plotline-analysis.json',JSON.stringify(project,null,2),'application/json');
 $('#projectStatus').textContent='Analysis project saved locally. The file contains your dataset and analysis settings.';
}

function validateProject(project){
 if(!isRecord(project)||project.format!=='plotline-analysis'||project.version!==1)throw Error('This is not a supported Plotline analysis project.');
 const rows=normalizeRows(project.rows);
 const names=new Set(Object.keys(rows[0]));
 if(!isRecord(project.typeOverrides))throw Error('The project has invalid column type settings.');
 for(const [name,type] of Object.entries(project.typeOverrides))if(!names.has(name)||!['num','cat','date'].includes(type))throw Error(`Invalid project column type for "${name}".`);
 if(!isRecord(project.chart)||typeof project.chart.x!=='string'||!Array.isArray(project.chart.ys)||!['bar','stacked','line','area','pie','scatter'].includes(project.chart.type))throw Error('The project has invalid chart settings.');
 if(!names.has(project.chart.x)||project.chart.ys.some(name=>!names.has(name)))throw Error('Project chart refers to columns that are not in the project dataset.');
 if(typeof project.chart.title!=='string'||typeof project.chart.xLabel!=='string'||typeof project.chart.yLabel!=='string'||typeof project.chart.legend!=='boolean'||!Object.hasOwn(P,project.chart.palette)||!isRecord(project.chart.colors)||!isRecord(project.chart.colors.series)||!isRecord(project.chart.colors.slices))throw Error('The project has invalid chart settings.');
 const allowedColors=new Set([...names,...rows.flatMap(row=>Object.values(row).map(value=>String(value??'')))]);
 for(const group of ['series','slices'])for(const [key,color] of Object.entries(project.chart.colors[group]))if(!allowedColors.has(key)||typeof color!=='string'||!/^#[0-9a-f]{6}$/i.test(color))throw Error(`Invalid project chart color for "${key}".`);
 if(project.formulaColumn!==null&&project.formulaColumn!==undefined&&(!isRecord(project.formulaColumn)||typeof project.formulaColumn.name!=='string'||!Array.isArray(project.formulaColumn.values)||project.formulaColumn.values.length!==rows.length||names.has(project.formulaColumn.name)))throw Error('The project has invalid formula results.');
 if(project.pivot!==undefined&&(!isRecord(project.pivot)||project.pivot.operation!==undefined&&!['sum','average','count','min','max'].includes(project.pivot.operation)))throw Error('The project has invalid pivot settings.');
 if(project.kpi!==undefined&&!isRecord(project.kpi))throw Error('The project has invalid KPI settings.');
 if(project.guided!==undefined&&project.guided!==null&&(!isRecord(project.guided)||!['highest','lowest','trend','outliers','missing','duplicates'].includes(project.guided.question)))throw Error('The project has invalid guided analysis settings.');
 return{rows,overrides:{...project.typeOverrides},chart:project.chart,formulaColumn:project.formulaColumn||null,pivot:project.pivot||{},kpi:project.kpi||{},guided:project.guided||{},filterText:typeof project.filterText==='string'?project.filterText:''};
}

function loadAnalysisProject(project){
 const validated=validateProject(project);
 const previous={rows:S.rows,cols:S.cols,cfg:S.cfg,rec:S.rec,typeOverrides:S.typeOverrides,filterText:S.filterText,formulaColumn:S.formulaColumn,pivotResult:S.pivotResult,cellSelection:S.cellSelection,preview:S.preview};
 try{
  loadRows(validated.rows);
  S.typeOverrides=validated.overrides;
  inspect();
  const issue=chartIssue(validated.chart.type,validated.chart.x,validated.chart.ys);
  if(issue)throw Error(`Project chart is not compatible with its dataset: ${issue}`);
  S.cfg={...validated.chart,ys:[...validated.chart.ys],colors:{series:{...validated.chart.colors.series},slices:{...validated.chart.colors.slices}}};
  S.formulaColumn=validated.formulaColumn;
  S.filterText=validated.filterText;
  fillControls();
  fillAnalysisControls();
  for(const [selector,key] of [['#pivotGroup1','group1'],['#pivotGroup2','group2'],['#pivotMeasure','measure'],['#pivotAggregate','operation']])if(validated.pivot[key]!==undefined)$(selector).value=validated.pivot[key];
  if(validated.pivot.group1&&validated.pivot.measure)buildPivot();
  if(validated.kpi.measure)$('#kpiMeasure').value=validated.kpi.measure;
  if(validated.kpi.group!==undefined){$('#kpiGroup').value=validated.kpi.group;updateComparisonOptions()}
  if(validated.kpi.compareA!==undefined)$('#kpiCompareA').value=validated.kpi.compareA;
  if(validated.kpi.compareB!==undefined)$('#kpiCompareB').value=validated.kpi.compareB;
  if(validated.kpi.measure)calculateKpis();
  if(validated.guided.question){
   $('#guidedQuestion').value=validated.guided.question;
   if(validated.guided.measure)$('#guidedMeasure').value=validated.guided.measure;
   runGuidedAnalysis();
   S.cfg={...validated.chart,ys:[...validated.chart.ys],colors:{series:{...validated.chart.colors.series},slices:{...validated.chart.colors.slices}}};
   fillControls();
  }
  $('#chartFilter').value=S.filterText;
  $('#clearChartFilter').disabled=!S.filterText;
  renderPreview();
  drawChart();
 }catch(error){
  Object.assign(S,previous);
  if(S.rows.length){
   inspect();fillControls();fillAnalysisControls();renderPreview();drawChart();
  }
  throw error;
 }
 $('#projectStatus').textContent='Analysis project loaded.';
}

function buildPdfReport(pdf,chart){
 const margin=12,pageWidth=pdf.internal.pageSize.getWidth(),pageHeight=pdf.internal.pageSize.getHeight();
 const contentWidth=pageWidth-margin*2,bottom=pageHeight-margin;
 let y=margin;
 pdf.setFont('helvetica','bold');pdf.setFontSize(18);pdf.text('Plotline analysis report',margin,y);y+=8;
 pdf.setFont('helvetica','normal');pdf.setFontSize(9);
 pdf.text(`Generated: ${new Intl.DateTimeFormat(undefined,{dateStyle:'medium',timeStyle:'short'}).format(new Date())}`,margin,y);y+=5;
 pdf.text(`Chart filter: ${S.filterText?`"${S.filterText}"`:'None'}`,margin,y);y+=8;
 const scale=Math.min(contentWidth/chart.width,(pageHeight*.42)/chart.height);
 const imageWidth=chart.width*scale,imageHeight=chart.height*scale;
 pdf.addImage(chart.toBase64Image(),'PNG',margin+(contentWidth-imageWidth)/2,y,imageWidth,imageHeight);
 y+=imageHeight+8;
 const sections=[
  ['Dataset summary',[...$('#dataset').children].map(item=>item.textContent)],
  ['Chart and observations',[...$('#sum').children].map(item=>item.textContent)],
  ['Data quality and next steps',[...$('#chk').children].map(item=>item.textContent)]
 ];
 for(const [heading,items] of sections){
  if(y+10>bottom){pdf.addPage();y=margin}
  pdf.setFont('helvetica','bold');pdf.setFontSize(12);pdf.text(heading,margin,y);y+=6;
  pdf.setFont('helvetica','normal');pdf.setFontSize(9);
  for(const item of items){
   const lines=pdf.splitTextToSize(`- ${item}`,contentWidth);
   if(y+lines.length*4.5>bottom){pdf.addPage();y=margin}
   pdf.text(lines,margin,y);y+=lines.length*4.5+2;
  }
  y+=2;
 }
 const pageCount=pdf.internal.getNumberOfPages();
 for(let page=1;page<=pageCount;page++){
  pdf.setPage(page);pdf.setFont('helvetica','normal');pdf.setFontSize(8);
  pdf.text(`Page ${page} of ${pageCount}`,pageWidth-margin,pageHeight-6,{align:'right'});
 }
}

function applyChartSettings(settings){
 if(!isRecord(settings)||settings.version!==SETTINGS_VERSION||!isRecord(settings.config))throw Error('This settings file is invalid or uses an unsupported version.');
 const requestedOverrides=settings.columnTypes||{};
 if(!isRecord(requestedOverrides))throw Error('Column type overrides must be an object.');
 const columnNames=new Set(S.cols.map(column=>column.name));
 for(const [name,type] of Object.entries(requestedOverrides)){
  if(!columnNames.has(name)||!['num','cat','date'].includes(type))throw Error(`Invalid column type override for "${name}".`);
 }
 const source=settings.config;
 if(!T.some(([type])=>type===source.type)||typeof source.x!=='string'||!Array.isArray(source.ys)||!source.ys.every(name=>typeof name==='string'))throw Error('Chart type, X field, or value series is invalid.');
 if(typeof source.title!=='string'||typeof source.xLabel!=='string'||typeof source.yLabel!=='string'||typeof source.legend!=='boolean'||!Object.hasOwn(P,source.palette))throw Error('Chart labels, legend, or palette are invalid.');
 if(!isRecord(source.colors))throw Error('Chart colors are invalid.');
 const previousOverrides=S.typeOverrides;
 try{
  S.typeOverrides={...requestedOverrides};
  inspect();
  if(!columnNames.has(source.x)||source.ys.some(name=>!columnNames.has(name)))throw Error('Settings refer to columns that are not in the current dataset.');
  const issue=chartIssue(source.type,source.x,source.ys);
  if(issue)throw Error(`These settings do not fit the current dataset: ${issue}`);
  const validateColors=(group,allowed)=>{
   const values=source.colors[group]||{};
   if(!isRecord(values))throw Error('Chart colors are invalid.');
   const result={};
   for(const [name,color] of Object.entries(values)){
    if(!allowed.has(name)||typeof color!=='string'||!/^#[0-9a-f]{6}$/i.test(color))throw Error(`Invalid saved color for "${name}".`);
    result[name]=color;
   }
   return result;
  };
  const numericNames=new Set(S.cols.filter(column=>column.type==='num').map(column=>column.name));
  const sliceNames=new Set(S.rows.map(row=>String(row[source.x]??'')));
  const config={x:source.x,ys:[...source.ys],type:source.type,title:source.title,xLabel:source.xLabel,yLabel:source.yLabel,palette:source.palette,legend:source.legend,colors:{series:validateColors('series',numericNames),slices:validateColors('slices',sliceNames)}};
  S.cfg=config;
 }catch(error){
  S.typeOverrides=previousOverrides;
  inspect();
  throw error;
 }
 S.rec=auto();
 fillControls();
 renderPreview();
 drawChart();
 $('#settingsStatus').textContent='Chart settings loaded.';
}

$('#saveSettings').addEventListener('click',()=>{
 try{saveChartSettings()}catch(error){$('#settingsStatus').textContent=error.message||'Could not save chart settings.'}
});
$('#loadSettings').addEventListener('click',()=>{
 if(!S.cfg){$('#settingsStatus').textContent='Load data before applying chart settings.';return}
 $('#settingsFile').click();
});
$('#settingsFile').addEventListener('change',async event=>{
 const file=event.target.files?.[0];
 if(!file)return;
 try{
  if(file.size>100000)throw Error('Settings files must be smaller than 100 KB.');
  applyChartSettings(JSON.parse(await file.text()));
 }catch(error){$('#settingsStatus').textContent=error.message||'Could not load chart settings.'}
 finally{event.target.value=''}
});

$('#saveProject').addEventListener('click',()=>{
 try{saveAnalysisProject()}catch(error){$('#projectStatus').textContent=error.message||'Could not save the analysis project.'}
});
$('#openProject').addEventListener('click',()=>{
 if(!S.rows.length){$('#projectStatus').textContent='Load a dataset or choose a project file to begin.'}
 $('#projectFile').click();
});
$('#projectFile').addEventListener('change',async event=>{
 const file=event.target.files?.[0];
 if(!file)return;
 try{
  if(file.size>20000000)throw Error('Analysis project files must be smaller than 20 MB.');
  loadAnalysisProject(JSON.parse(await file.text()));
 }catch(error){$('#projectStatus').textContent=error.message||'Could not open this analysis project.'}
 finally{event.target.value=''}
});

$('#up').addEventListener('click',()=>$('#file').click());
$('#file').addEventListener('change',async event=>{
 const file=event.target.files?.[0];
 if(!file)return;
 try{loadRows(await rowsFromFile(file));toast(`Loaded ${file.name}`)}
 catch(error){say(error.message||'I could not read that file.')}
 finally{event.target.value=''}
});
$('#go').addEventListener('click',()=>{try{loadRows(parse($('#src').value))}catch(error){say(error.message||'I could not read that data.')}});
$('#src').addEventListener('keydown',event=>{if(event.ctrlKey&&event.key==='Enter')$('#go').click()});
$('#smp').addEventListener('click',()=>{
  $('#src').value=SAMPLES[$('#sampleChoice').value]||SAMPLES.monthly;
  $('#go').click();
});
function zoomChart(factor){
 if(!ch)return;
 if(S.cfg?.type==='pie'){
  pieZoom=Math.min(1.2,Math.max(.8,pieZoom*factor));
  ch.options.radius=`${Math.round(pieZoom*100)}%`;
  ch.update('none');
 }else ch.zoom(factor);
}
$('#zoomIn').addEventListener('click',()=>zoomChart(1.15));
$('#zoomOut').addEventListener('click',()=>zoomChart(1/1.15));
$('#zoomReset').addEventListener('click',()=>{
 if(S.cfg?.type==='pie'){
  pieZoom=1;
  if(ch){ch.options.radius='100%';ch.update('none')}
 }else ch?.resetZoom();
});
$('#cv').addEventListener('wheel',event=>{
 if(S.cfg?.type!=='pie')return;
 event.preventDefault();
 zoomChart(event.deltaY<0?1.08:1/1.08);
},{passive:false});
$('#ask').addEventListener('click',()=>{
 const request=$('#cmd').value.trim().toLowerCase();
 if(!request){$('#reply').textContent='Enter a chart change first.';return}
 if(!S.cfg){$('#reply').textContent='Build a chart from data before applying changes.';return}
 const requested=[...T].sort((a,b)=>b[0].length-a[0].length).find(([value,label])=>new RegExp(`\\b(?:${value}|${label.toLowerCase()})\\b`).test(request));
 const filterMatch=request.match(/(?:show|keep)\s+only\s+(.+)$|filter\s+(?:to|only)\s+(.+)$|^only\s+(.+)$/);
 const clearFilter=/\b(?:show all|all data|clear filter|reset filter)\b/.test(request);
 const filterValue=filterMatch?.slice(1).find(Boolean)?.replace(/^['"]|['"]$/g,'').replace(/[.!?]+$/,'').trim();
 if(!requested&&!filterValue&&!clearFilter){$('#reply').textContent='Try a chart type, "show only 2025", or "show all".';return}
 const nextFilter=clearFilter?'':filterValue||S.filterText;
 const matchingRows=nextFilter?S.rows.filter(row=>Object.values(row).some(value=>String(value??'').toLowerCase().includes(nextFilter.toLowerCase()))):S.rows;
 if(!matchingRows.length){$('#reply').textContent=`No rows match "${nextFilter}". The chart was not changed.`;return}
 const changes=[];
 if(requested){S.cfg.type=requested[0];changes.push(`Changed to ${requested[1]} chart`)}
 if(filterValue){S.filterText=filterValue;changes.push(`Showing ${matchingRows.length} matching row${matchingRows.length===1?'':'s'}`)}
 if(clearFilter){S.filterText='';changes.push(`Showing all ${S.rows.length} rows`)}
 $('#chartFilter').value=S.filterText;
 $('#clearChartFilter').disabled=!S.filterText;
 fillControls();
 drawChart();
 $('#reply').textContent=`${changes.join('. ')}.`;
});
$('#exp').addEventListener('click',event=>{
 const kind=event.target.dataset.k;
 if(!kind||!ch)return;
 try{
  if(kind==='png')download('plotline-chart.png',ch.toBase64Image().split(',')[1]&&Uint8Array.from(atob(ch.toBase64Image().split(',')[1]),char=>char.charCodeAt(0)), 'image/png');
  else if(kind==='csv')download('plotline-data.csv',Papa.unparse(visibleRows()),'text/csv;charset=utf-8');
  else if(kind==='data-csv')download('plotline-analyzed-data.csv',Papa.unparse(analyzedRows()),'text/csv;charset=utf-8');
  else if(kind==='xlsx')exportAnalyzedWorkbook();
  else if(kind==='svg')download('plotline-chart.svg',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ch.width} ${ch.height}"><image width="100%" height="100%" href="${ch.toBase64Image()}"/></svg>`,'image/svg+xml');
  else if(kind==='pdf'){
   if(!window.jspdf)throw Error('The PDF exporter did not load.');
   const pdf=new jspdf.jsPDF({orientation:ch.width>ch.height?'landscape':'portrait'});
    buildPdfReport(pdf,ch);pdf.save('plotline-analysis-report.pdf');
  }
 }catch(error){say(error.message||'Export failed.')}
});
</script>
</body>
</html>
