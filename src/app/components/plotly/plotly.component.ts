import {
  Component,
  OnInit,
  Input
} from '@angular/core';
// import * as Plotly from 'plotly.js/dist/plotly-basic.js';
import * as Plotly from 'plotly.js/lib/core';

@Component({
  selector: 'app-plotly',
  templateUrl: './plotly.component.html',
  styleUrls: ['./plotly.component.scss']
})
export class PlotlyComponent implements OnInit {
  @Input() data: any;
  @Input() layout: any;
  @Input() options: any;
  @Input() style: any;

  plotlyChartId: string;

  constructor() {
    this.plotlyChartId = 'plotDiv_' + this.generateId(5);
  }

  ngOnInit() {
    this.buildPlotChart();
  }

  generateId(nLen: number) {
    return Math.random().toString(36).substr(2, nLen);
  }

  buildPlotChart(nCount: number = 0) {
    if (nCount > 100) {
      console.log('Timeout to build new plotly chart.');
    } else if (!(<HTMLInputElement>document.getElementById(this.plotlyChartId))) {
      nCount ++;
      setTimeout(() => this.buildPlotChart(nCount), 50);
    } else {
      if (Plotly) {
        Plotly.newPlot(this.plotlyChartId, this.data, this.layout, this.options);
      }
    }
  }
}
