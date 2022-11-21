import { AfterContentInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ECharts, EChartsOption } from 'echarts';
import {ServerApiService} from "../serverApiService";
import {VariableModel} from "../models/variable.model";
import {XLevelModel} from "../models/xLevel.model";
import {VariableXLevelFilterModel} from "../models/variableXLevelFilter.model";

interface ChartVariablesSource{
  year: number,
  [key: string]: number
}

@Component({
  selector: 'app-variable-chart',
  templateUrl: './variable-chart.component.html',
  styleUrls: ['variable-chart.component.css']
})
export class VariableChartComponent implements OnInit {
  public echartsInstance!: ECharts;
  public chartOption: EChartsOption ={
    tooltip: {
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
    },
    xAxis: [
      {
        type: 'category',
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [{ type: 'bar',
      barGap: 0,
      emphasis: {
        focus: 'series'
      }, },]
  };
  public countries: Array<string>=[];
  public xLevels: Array<XLevelModel>= []

  constructor(private serverApiService: ServerApiService) {
  }

  ngOnInit(): void {
    this.findCountries();
    this.findVariables();
  }

  private findVariables(){
    this.serverApiService.getXLevels().subscribe((result: Object)=>{
      this.xLevels = result as Array<XLevelModel>;
    }, (error)=>console.error(error));
  }

  private findCountries(){
    this.serverApiService.getCountries().subscribe((result: Object)=>{
      this.countries = result as Array<string>;
    }, (error)=>console.error(error));
  }

  setChart(variable: string){
    this.serverApiService.getVariablesByXLevel(variable).subscribe(result=>{
      console.log(result);
      this.setVars(result)
    });
  }


  setVars(vars: Array<VariableXLevelFilterModel>){
    let dataChart = new Array<ChartVariablesSource>;
    vars.forEach(variable=>{
      let yearValue: ChartVariablesSource = {year: variable.year}
      variable.totalCountries.forEach(countryValue=>{
        yearValue[countryValue.country] = countryValue.ngs_price
      })
      dataChart.push(yearValue);
    })
    console.log(dataChart.sort((a, b) => a.year<b.year?-1:a.year>b.year?1:0));
    this.setChartOptions(dataChart);
  }

  private setChartOptions(chartVars: Array<ChartVariablesSource>): void{
    this.chartOption.dataset= {
      dimensions: ['year',...this.countries],
      source: chartVars
    }
    this.chartOption.series = this.countries.map(c=>{return { type: 'bar',
      barGap: 0,
      emphasis: {
      focus: 'series'
    }, }});
    this.echartsInstance.setOption(this.chartOption, false, true);
  }




  public onChartInit(ec: ECharts): void {
    this.echartsInstance = ec;
  }

}

