import '@afframe/ui/charts.css';
import { Amount, EChart, TextInput, formatAmount } from '@afframe/ui';
import { ChartsDemo } from './charts-demo';
import { ChatDemo } from './chat-demo';
import { DataGridDemo } from './data-grid-demo';

// The control route for the extras in scripts/check-example.mjs: Carbon
// Charts, ECharts, the data grid and the AI chat render here, so their
// JavaScript must ship here and on no other route. The amounts are formatted
// on the server.
const echartsOption = {
  xAxis: { type: 'category', data: ['Q1', 'Q2', 'Q3'] },
  yAxis: { type: 'value' },
  series: [{ type: 'bar', data: [12, 18, 9] }],
};

export default function ExtrasPage() {
  return (
    <main style={{ padding: 'var(--cds-spacing-07)' }}>
      <h1>Extras</h1>
      <TextInput id="search" labelText="Search" />
      <p data-testid="czk">{formatAmount(1234.5)}</p>
      <p>
        <Amount value={-1234.5} colorNegative />
      </p>
      <div data-afframe-extra="charts">
        <ChartsDemo />
      </div>
      <EChart option={echartsOption} style={{ height: 300 }} />
      <div data-afframe-extra="data-grid">
        <DataGridDemo />
      </div>
      <ChatDemo />
    </main>
  );
}
