import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotlyComponent } from './plotly.component';
import * as Plotly from 'plotly.js/lib/core';

// describe('PlotlyComponent', () => {
//   let component: PlotlyComponent;
//   let fixture: ComponentFixture<PlotlyComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ PlotlyComponent ]
//     })
//     .compileComponents()
//     .then(() => {
//       fixture = TestBed.createComponent(PlotlyComponent);
//       component = fixture.componentInstance;
//     });
//   }));

//   it('#should call the buildPlotChart function to build plot chart via refreshing browser', () => {
//     spyOn(component, 'buildPlotChart');
//     component.ngOnInit();
//     expect(component.buildPlotChart).toHaveBeenCalled();
//   });

//   it('#should generate random id to create unique id by generateId function', () => {
//     const id1 = component.generateId(5);
//     const id2 = component.generateId(5);
//     expect(id1).not.toEqual(id2);
//   });

//   it('#should build plot chart by buildPlotChart function', (done) => {
//     fixture.detectChanges();
//     fixture.whenStable().then(() => {
//       if (Plotly) {
//         spyOn(Plotly, 'newPlot');
//         component.buildPlotChart();
//         expect(Plotly.newPlot).toHaveBeenCalled();
//         done();
//       } else {
//         done();
//       }
//     });
//   });
// });
/**
 * wrote in 2018/3/30
 * update in 2018/8/14
 */
