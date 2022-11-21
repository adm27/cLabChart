export interface VariableXLevelFilterModel{
  year: number,
  totalCountries: Array<{
    country: string,
    ngs_price: number
  }>
}
