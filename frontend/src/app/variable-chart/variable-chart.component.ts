import { AfterContentInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ECharts, EChartsOption } from 'echarts';
import {ServerApiService} from "../serverApiService";
import {VariableModel} from "../models/variable.model";

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
  public chartOption!: EChartsOption;
  public countries: Array<string>=[];

  constructor(private serverApiService: ServerApiService) {
  }

  ngOnInit(): void {
    this.serverApiService.getVariables().subscribe((result: Object)=>{
      this.setVars(result as Array<VariableModel>);
    }, (error)=>console.error(error));
  }

  private findCountries(){
    this.serverApiService.getCountries().subscribe((result: Object)=>{
      this.countries = result as Array<string>;
    }, (error)=>console.error(error));
  }


  setVars(vars: Array<VariableModel>){
    let mapCountries = new Map<number, Map<string, number>>();
    vars.forEach(variable=>{
      if(!mapCountries.has(variable.year)){
        mapCountries.set(variable.year, new Map<string, number>());
      }
      mapCountries.get(variable.year)?.set(variable.country, variable.ngs_price);
    })

    console.log(JSON.stringify(mapCountries))
    let source: Array<ChartVariablesSource>

    this.chartOption = this.getChartOptions();
  }

  private getChartOptions(): EChartsOption{
    return  {
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
          axisTick: { show: false }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      dataset: {
        dimensions: ['year', 'Spain', 'alemania', 'peru'],
        source: [
          { year: 2015, 'Spain': 43.3, 'alemania': 85.8, "peru": 93.7 },
          { year: 2016, 'Spain': 43.3, 'alemania': 85.8, "peru": 93.7 },
          { year: 2017, 'Spain': 43.3, 'alemania': 85.8, "peru": 93.7 },
        ]
      },
      series: [{ type: 'bar',
        barGap: 0,

        emphasis: {
          focus: 'series'
        }, }, { type: 'bar',
        barGap: 0,

        emphasis: {
          focus: 'series'
        }, }, { type: 'bar',
        barGap: 0,

        emphasis: {
          focus: 'series'
        }, }]
    };
  }


  public onChartInit(ec: ECharts): void {
    this.echartsInstance = ec;
  }

  update() {
    this.echartsInstance.setOption(this.getChartOptions(), false, true);
  }
}

