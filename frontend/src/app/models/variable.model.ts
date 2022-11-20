import {XLevelModel} from "./xLevel.model";

export class VariableModel{
  constructor(public year: number, public country: string, public x_level: XLevelModel, public ngs_price: number) {
  }

  public static buildByJson(jsonString: string): VariableModel{
    let json = JSON.parse(jsonString);
    return new VariableModel(json['year'], json['country'], json['x_level'], json['ngs_price']);

  }
}
