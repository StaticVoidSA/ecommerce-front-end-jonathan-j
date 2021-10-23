import { Injectable } from '@angular/core';

export interface currentCategories {
  category: string;
  subCategory: string;
  uri: string;
  title: string;
}

@Injectable({providedIn: 'root'})
export class CategoryDataService {

  private currentCategories: currentCategories[] = [
    // Fresh_Food
    { category: 'Fresh_Food', subCategory: 'Bakery', uri: '../../assets/Categories/Sub-Categories/Bakery.jpg', title: 'Bakery'},
    { category: 'Fresh_Food', subCategory: 'Butter_&_Margarine', uri: '../../assets/Categories/Sub-Categories/Butter_&_Margarine.jpg', title: 'Butter & Margarine'},
    { category: 'Fresh_Food', subCategory: 'Cheese', uri: '../../assets/Categories/Sub-Categories/Cheese.jpg', title: 'Cheese'},
    { category: 'Fresh_Food', subCategory: 'Eggs', uri: '../../assets/Categories/Sub-Categories/Eggs.jpg', title: 'Eggs'},
    { category: 'Fresh_Food', subCategory: 'Fruit', uri: '../../assets/Categories/Sub-Categories/Fruit.jpg', title: 'Fruit'},
    { category: 'Fresh_Food', subCategory: 'Meat_&_Poultry', uri: '../../assets/Categories/Sub-Categories/Meat_&_Poultry.jpg', title: 'Meat & Poultry'},
    { category: 'Fresh_Food', subCategory: 'Milk_&_Cream', uri: '../../assets/Categories/Sub-Categories/Milk_&_Cream.jpg', title: 'Milk & Cream'},
    { category: 'Fresh_Food', subCategory: 'Prepared_Meats', uri: '../../assets/Categories/Sub-Categories/Prepared_Meats.jpg', title: 'Prepared Meats'},
    { category: 'Fresh_Food', subCategory: 'Salads_&_Fresh_Herbs', uri: '../../assets/Categories/Sub-Categories/Salads_&_Fresh_Herbs.jpg', title: 'Salads & Fresh Herbs'},
    { category: 'Fresh_Food', subCategory: 'Vegetables', uri: '../../assets/Categories/Sub-Categories/Vegetables.png', title: 'Vagetables'},
    { category: 'Fresh_Food', subCategory: 'Yoghurt', uri: '../../assets/Categories/Sub-Categories/Yoghurt.jpg', title: 'Yoghurt'},
    { category: 'Fresh_Food', subCategory: 'Biltong_&_Droewors', uri: '../../assets/Categories/Sub-Categories/Biltong_&_Droewors.jpg', title: 'Biltong & Droewors'},
    // Food_Cupboard
    { category: 'Food_Cupboard', subCategory: 'Baking_Ingredients', uri: '../../assets/Categories/Sub-Categories/Baking_Ingredients.jpg', title: 'Baking Ingredients'},
    { category: 'Food_Cupboard', subCategory: 'Beans_&_Pulses_&_Lentils', uri: '../../assets/Categories/Sub-Categories/Beans_&_Pulses_&_Lentils.jpg', title: 'Beans, Pulses & Lentils'},
    { category: 'Food_Cupboard', subCategory: 'Biscuits_&_Crackers', uri: '../../assets/Categories/Sub-Categories/Biscuits_&_Crackers.jpg', title: 'Biscuits & Crackers'},
    { category: 'Food_Cupboard', subCategory: 'Breakfast_Cereals_&_Bars', uri: '../../assets/Categories/Sub-Categories/Breakfast_Cereals_&_Bars.jpg', title: 'Breakfast Cereals & Bars'},
    { category: 'Food_Cupboard', subCategory: 'Canned_Food_&_Packets', uri: '../../assets/Categories/Sub-Categories/Canned_Food_&_Packets.jpg', title: 'Canned Food & Packets'},
    { category: 'Food_Cupboard', subCategory: 'Chocolates_&_Sweets', uri: '../../assets/Categories/Sub-Categories/Chocolates_&_Sweets.jpg', title: 'Chocolates & Sweets'},
    { category: 'Food_Cupboard', subCategory: 'Chips_&_Dips', uri: '../../assets/Categories/Sub-Categories/Chips_&_Dips.jpg', title: 'Chips & Dips'},
    { category: 'Food_Cupboard', subCategory: 'Condiments_&_Salads', uri: '../../assets/Categories/Sub-Categories/Condiments_&_Salads.jpg', title: 'Condiments & Salads'},
    { category: 'Food_Cupboard', subCategory: 'Dried_Snacks_&_Fruits_&_Nuts', uri: '../../assets/Categories/Sub-Categories/Dried_Snacks_&_Fruits_&_Nuts.jpg', title: 'Dried Snacks, Fruits & Nuts'},
    { category: 'Food_Cupboard', subCategory: 'Jams_&_Spreads', uri: '../../assets/Categories/Sub-Categories/Jams_&_Spreads.jpg', title: 'Jams & Spreads'},
    { category: 'Food_Cupboard', subCategory: 'Long_Life_Milk', uri: '../../assets/Categories/Sub-Categories/Long_Life_Milk.png', title: 'Long Life Milk'},
    { category: 'Food_Cupboard', subCategory: 'Oil_&_Vinegar', uri: '../../assets/Categories/Sub-Categories/Oil_&_Vinegar.jpg', title: 'Oil & Vinegar'},
    { category: 'Food_Cupboard', subCategory: 'Pasta_&_Noodles', uri: '../../assets/Categories/Sub-Categories/Pasta_&_Noodles.jpg', title: 'Pasta & Noodles'},
    { category: 'Food_Cupboard', subCategory: 'Rice_&_Grains_&_Maize', uri: '../../assets/Categories/Sub-Categories/Rice_&_Grains_&_Maize.jpg', title: 'Rice, Grains & Maize'},
    { category: 'Food_Cupboard', subCategory: 'Sauces_&_Dressings', uri: '../../assets/Categories/Sub-Categories/Sauces_&_Dressings.jpg', title: 'Sauces & Dressings'},
    { category: 'Food_Cupboard', subCategory: 'Sugars_&_Sweeteners', uri: '../../assets/Categories/Sub-Categories/Sugars_&_Sweeteners.jpg', title: 'Sugars & Sweeteners'},
    { category: 'Food_Cupboard', subCategory: 'Health_&_Protein_&_Energy_Bars', uri: '../../assets/Categories/Sub-Categories/Health_&_Protein_&_Energy_Bars.jpg', title: 'Health, Protein & Energy Bars'},
    // Frozen_Food
    { category: 'Frozen_Food', subCategory: 'Frozen_Chips_&_Potatoes', uri: '../../assets/Categories/Sub-Categories/Frozen_Chips_&_Potatoes.jpg', title: 'Frozen Chips & Potatoes'},
    { category: 'Frozen_Food', subCategory: 'Frozen_Confectionary', uri: '../../assets/Categories/Sub-Categories/Frozen_Confectionary.jpg', title: 'Frozen Confectionary'},
    { category: 'Frozen_Food', subCategory: 'Frozen_Fish_&_Seafood', uri: '../../assets/Categories/Sub-Categories/Frozen_Fish_&_Seafood.jpeg', title: 'Frozen Fish & Seafood'},
    { category: 'Frozen_Food', subCategory: 'Frozen_Fruit', uri: '../../assets/Categories/Sub-Categories/Frozen_Fruit.jpg', title: 'Frozen Fruit'},
    { category: 'Frozen_Food', subCategory: 'Frozen_Meals', uri: '../../assets/Categories/Sub-Categories/Frozen_Meals.jpg', title: 'Frozen Meals'},
    { category: 'Frozen_Food', subCategory: 'Frozen_Meat', uri: '../../assets/Categories/Sub-Categories/Frozen_Meat.jpg', title: 'Frozen Meat'},
    { category: 'Frozen_Food', subCategory: 'Frozen_Pies', uri: '../../assets/Categories/Sub-Categories/Frozen_Pies.jpg', title: 'Frozen Pies'},
    { category: 'Frozen_Food', subCategory: 'Frozen_Pizza', uri: '../../assets/Categories/Sub-Categories/Frozen_Pizza.jpg', title: 'Frozen Pizza'},
    { category: 'Frozen_Food', subCategory: 'Frozen_Poultry', uri: '../../assets/Categories/Sub-Categories/Frozen_Poultry.jpg', title: 'Frozen Poultry'},
    { category: 'Frozen_Food', subCategory: 'Frozen_Ready_Meals', uri: '../../assets/Categories/Sub-Categories/Frozen_Ready_Meals.jpg', title: 'Frozen Ready Meals'},
    { category: 'Frozen_Food', subCategory: 'Frozen_Vegetables', uri: '../../assets/Categories/Sub-Categories/Frozen_Vegetables.jpg', title: 'Frozen Vegetables'},
    { category: 'Frozen_Food', subCategory: 'Frozen_Vegetarian', uri: '../../assets/Categories/Sub-Categories/Frozen_Vegetarian.jpeg', title: 'Frozen Vegetarian'},
    { category: 'Frozen_Food', subCategory: 'Ice_Creams_&_Desserts', uri: '../../assets/Categories/Sub-Categories/Ice_Creams_&_Desserts.jpeg', title: 'Ice Creams & Desserts'},
    // Convenience_Meals
    { category: 'Convenience_Meals', subCategory: 'Deli_&_Party_Snacks_&_Dips', uri: '../../assets/Categories/Sub-Categories/Deli_&_Party_Snacks_&_Dips.jpg', title: 'Party Snacks & Dips'},
    { category: 'Convenience_Meals', subCategory: 'Desserts', uri: '../../assets/Categories/Sub-Categories/Desserts.jpeg', title: 'Desserts'},
    { category: 'Convenience_Meals', subCategory: 'Meals', uri: '../../assets/Categories/Sub-Categories/Meals.jpg', title: 'Meals'},
    { category: 'Convenience_Meals', subCategory: 'Quiches_&_Pies', uri: '../../assets/Categories/Sub-Categories/Quiches_&_Pies.jpg', title: 'Quiches & Pies'},
    { category: 'Convenience_Meals', subCategory: 'Soups', uri: '../../assets/Categories/Sub-Categories/Soups.jpg', title: 'Soups'},
    // Beverages
    { category: 'Beverages', subCategory: 'Bottled_Water', uri: '../../assets/Categories/Sub-Categories/Bottled_Water.jpeg', title: 'Bottled Water'},
    { category: 'Beverages', subCategory: 'Coffee_&_Tea_&_Creamers', uri: '../../assets/Categories/Sub-Categories/Coffee_&_Tea_&_Creamers.jpg', title: 'Coffee, Tea & Creamers'},
    { category: 'Beverages', subCategory: 'Cold_Drinks', uri: '../../assets/Categories/Sub-Categories/Cold_Drinks.jpg', title: 'Cold Drinks'},
    { category: 'Beverages', subCategory: 'Hot_Chocolate_&_Malt_Drinks', uri: '../../assets/Categories/Sub-Categories/Hot_Chocolate_&_Malt_Drinks.jpg', title: 'Hot Chocolate & Malt Drinks'},
    { category: 'Beverages', subCategory: 'Juice', uri: '../../assets/Categories/Sub-Categories/Juice.jpg', title: 'Juice'},
    // Health_&_Beauty
    { category: 'Health_&_Beauty', subCategory: 'Bath_Shower_&_Soap', uri: '../../assets/Categories/Sub-Categories/Bath_Shower_&_Soap.jpg', title: 'Bath, Shower & Soap'},
    { category: 'Health_&_Beauty', subCategory: 'Body_&_Facial_Care', uri: '../../assets/Categories/Sub-Categories/Body_&_Facial_Care.jpg', title: 'Facial & Body Care'},
    { category: 'Health_&_Beauty', subCategory: 'Deodorant', uri: '../../assets/Categories/Sub-Categories/Deodorant.jpg', title: 'Deodorant'},
    { category: 'Health_&_Beauty', subCategory: 'Feminine_Care', uri: '../../assets/Categories/Sub-Categories/Feminine_Care.jpg', title: 'Feminine Care'},
    { category: 'Health_&_Beauty', subCategory: 'Foot_Care_&_Hosiery', uri: '../../assets/Categories/Sub-Categories/Foot_Care_&_Hosiery.jpg', title: 'Foot Care & Hoisery'},
    // Baby
    { category: 'Baby', subCategory: 'Baby_&_Toddler_Health_Care', uri: '../../assets/Categories/Sub-Categories/Baby_&_Toddler_Health_Care.jpg', title: 'Baby & Toddler Health Care'},
    { category: 'Baby', subCategory: 'Baby_Bathing_&_Toiletries', uri: '../../assets/Categories/Sub-Categories/Baby_Bathing_&_Toiletries.jpg', title: 'Baby Bathing & Toiletries'},
    { category: 'Baby', subCategory: 'Baby_Bottles_&_Treats', uri: '../../assets/Categories/Sub-Categories/Baby_Bottles_&_Treats.jpg', title: 'Baby Bottles & Treats'},
    { category: 'Baby', subCategory: 'Baby_Creams_&_Lotions_&_Glycerine', uri: '../../assets/Categories/Sub-Categories/Baby_Creams_&_Lotions_&_Glycerine.jpg', title: 'Baby Creams'},
    { category: 'Baby', subCategory: 'Baby_Essentials', uri: '../../assets/Categories/Sub-Categories/Baby_Essentials.jpg', title: 'Baby Essentials'},
    // House_Hold_Cleaning
    { category: 'House_Hold_Cleaning', subCategory: 'Air_Freshener', uri: '../../assets/Categories/Sub-Categories/Air_Freshener.jpg', title: 'Air Freshener'},
    { category: 'House_Hold_Cleaning', subCategory: 'Bathroom_Cleaners', uri: '../../assets/Categories/Sub-Categories/Bathroom_Cleaners.jpg', title: 'Bathroom Cleaners'},
    { category: 'House_Hold_Cleaning', subCategory: 'Brooms_&_Mops', uri: '../../assets/Categories/Sub-Categories/Brooms_&_Mops.jpg', title: 'Brooms & Mops'},
    { category: 'House_Hold_Cleaning', subCategory: 'Cleaning_Accessories', uri: '../../assets/Categories/Sub-Categories/Cleaning_Accessories.jpg', title: 'Cleaning Accessories'},
    { category: 'House_Hold_Cleaning', subCategory: 'Dishwashing', uri: '../../assets/Categories/Sub-Categories/Dishwashing.jpg', title: 'Dishwashing'},
    { category: 'House_Hold_Cleaning', subCategory: 'Bleach', uri: '../../assets/Categories/Sub-Categories/Bleach.png', title: 'Bleach'},
    // Electronics_&_Office
    { category: 'Electronics_&_Office', subCategory: 'Batteries', uri: '../../assets/Categories/Sub-Categories/Batteries.jpg', title: 'Batteries'},
    { category: 'Electronics_&_Office', subCategory: 'Computing_Accessories', uri: '../../assets/Categories/Sub-Categories/Computing_Accessories.jpg', title: 'Computing Accessories'},
    { category: 'Electronics_&_Office', subCategory: 'Stationary', uri: '../../assets/Categories/Sub-Categories/Stationary.jpg', title: 'Stationary'},
    // Home_&_Outdoor
    { category: 'Home_&_Outdoor', subCategory: 'Braai_&_Camping', uri: '../../assets/Categories/Sub-Categories/Braai_&_Camping.jpeg', title: 'Braai & Camping'},
    { category: 'Home_&_Outdoor', subCategory: 'Car_Care_&_Cleaning', uri: '../../assets/Categories/Sub-Categories/Car_Care_&_Cleaning.jpg', title: 'Car Care'},
    { category: 'Home_&_Outdoor', subCategory: 'Kitchen_&_Dining', uri: '../../assets/Categories/Sub-Categories/Kitchen_&_Dining.jpg', title: 'Kitchen & Dining'},
    { category: 'Home_&_Outdoor', subCategory: 'DIY', uri: '../../assets/Categories/Sub-Categories/DIY.jpg', title: 'DIY'},
    { category: 'Home_&_Outdoor', subCategory: 'Party_Accessories', uri: '../../assets/Categories/Sub-Categories/Party_Accessories.png', title: 'Party Accessories'},
    { category: 'Home_&_Outdoor', subCategory: 'Large_Applicances', uri: '../../assets/Categories/Sub-Categories/Large_Appliances.jpg', title: 'Large Appliances'},
    { category: 'Home_&_Outdoor', subCategory: 'Electrical_&_Lighting', uri: '../../assets/Categories/Sub-Categories/Electrical_&_Lighting.jpg', title: 'Electrical & Lighting'},
    { category: 'Home_&_Outdoor', subCategory: 'Sports', uri: '../../assets/Categories/Sub-Categories/Sports.jpg', title: 'Sports'},
    { category: 'Home_&_Outdoor', subCategory: 'Swimming_Pool', uri: '../../assets/Categories/Sub-Categories/Swimming_Pool.jpg', title: 'Swimming Pool'},
    { category: 'Home_&_Outdoor', subCategory: 'Pets', uri: '../../assets/Categories/Sub-Categories/Pets.jpg', title: 'Pets'},
    { category: 'Home_&_Outdoor', subCategory: 'Small_Appliances', uri: '../../assets/Categories/Sub-Categories/Small_Appliances.jpg', title: 'Small Appliances'},
    { category: 'Home_&_Outdoor', subCategory: 'Toys', uri: '../../assets/Categories/Sub-Categories/Toys.jpg', title: 'Toys'},
    { category: 'Home_&_Outdoor', subCategory: 'Home_Decor', uri: '../../assets/Categories/Sub-Categories/Home_Decor.jpg', title: 'Home Decor'},
    { category: 'Home_&_Outdoor', subCategory: 'Christmas', uri: '../../assets/Categories/Sub-Categories/Christmas.jpg', title: 'Christmas'},
    { category: 'Home_&_Outdoor', subCategory: 'Garden_&_Patio', uri: '../../assets/Categories/Sub-Categories/Garden_&_Patio.jpg', title: 'Garden & Patio'},
    { category: 'Home_&_Outdoor', subCategory: 'Luggage', uri: '../../assets/Categories/Sub-Categories/Luggage.png', title: 'Luggage'},
    // Liquor
    { category: 'Liquor', subCategory: 'Beer', uri: '../../assets/Categories/Sub-Categories/Beer.jpg', title: 'Beer'},
    { category: 'Liquor', subCategory: 'Red_Wine', uri: '../../assets/Categories/Sub-Categories/Red_Wine.jpg', title: 'Red Wine'},
    { category: 'Liquor', subCategory: 'White_Wine', uri: '../../assets/Categories/Sub-Categories/White_Wine.jpg', title: 'White Wine'},
    { category: 'Liquor', subCategory: 'Box_Wine', uri: '../../assets/Categories/Sub-Categories/Box_Wine.jpg', title: 'Box Wine'},
    { category: 'Liquor', subCategory: 'Rose_Wine', uri: '../../assets/Categories/Sub-Categories/Rose_Wine.jpg', title: 'Rose Wine'},
    { category: 'Liquor', subCategory: 'Spirits', uri: '../../assets/Categories/Sub-Categories/Spirits.jpg', title: 'Spirits'},
    { category: 'Liquor', subCategory: 'Liqueurs', uri: '../../assets/Categories/Sub-Categories/Liqueurs.jpg', title: 'Liquers'},
    { category: 'Liquor', subCategory: 'Mixers', uri: '../../assets/Categories/Sub-Categories/Mixers.jpg', title: 'Mixers'},
    { category: 'Liquor', subCategory: 'Ciders_&_Coolers', uri: '../../assets/Categories/Sub-Categories/Ciders_&_Coolers.jpg', title: 'Ciders & Coolers'},
    { category: 'Liquor', subCategory: 'Non_Alchoholic_Beverages', uri: '../../assets/Categories/Sub-Categories/Non_Alchoholic_Beverages.jpg', title: 'Non Alchoholic'},
  ];

  getSubCategories(category: string): currentCategories[] {
    let result: currentCategories[] = [];
    this.currentCategories.forEach(item => {
      if (item.category === category) {
        result.push(item);
      }
    });
    return result;
  }
}
