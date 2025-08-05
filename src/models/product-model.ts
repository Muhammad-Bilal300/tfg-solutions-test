import mongoose, { Document, Schema } from "mongoose";

interface ProductTypes extends Document {
  product_id: number;
  value: number;
  country_code: string;

  createdAt: Date;
  updatedAt: Date;
}

const productSchema: Schema = new Schema<ProductTypes>(
  {
    product_id: {
      type: Number,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    country_code: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model<ProductTypes>("Product", productSchema);

export default Product;
