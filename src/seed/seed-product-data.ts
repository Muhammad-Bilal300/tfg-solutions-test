import mockProductsData from "../data/product-data";
import Product from "../models/product-model";

const seedMockProductsData = async () => {
  try {
    const count = await Product.countDocuments();

    if (count === 0) {
      await Product.insertMany(mockProductsData);
    }
  } catch (error) {
    console.error("Error seeding mock products:", error);
  }
};

export default seedMockProductsData;
