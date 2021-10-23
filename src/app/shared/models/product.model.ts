export class Product {
  public productID: string;
  public title: string;
  public category: string;
  public brand: string;
  public uri: string;
  public price: number;
  public description: string;
  public features: string;
  public usage: string;
  public quantity: string;
  public barcode: string;

  constructor(_productID: string, _category: string,_brand: string,
    public _title: string, public _uri: string, public _price: number,
    public _description: string, public _features: string,
    public _usage: string, public _quantity: string, _barcode: string) {
      this.productID = _productID;
      this.title = _title;
      this.category = _category;
      this.brand = _brand;
      this.uri = _uri;
      this.price = _price;
      this.description = _description;
      this.features = _features;
      this.usage = _usage;
      this.quantity = _quantity;
      this.barcode = _barcode;
    }
}
