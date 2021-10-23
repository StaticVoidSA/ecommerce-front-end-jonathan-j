// export interface UserLocation {
//   "Address": string,
//   "Country": string,
//   "Town": string[],
//   "Lat": number,
//   "Long": number
// };

export class UserLocation {
  public Address: string;
  public Country: string;
  public Town: string[];
  public Lat: number;
  public Long: number;

  constructor(address: string, country: string, town: string[], lat: number,  long: number) {
    this.Address = address;
    this.Country = country;
    this.Town = town;
    this.Lat = lat;
    this.Long = long;
  }
}
