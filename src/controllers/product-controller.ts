import { Request, Response } from "express";
import { STATUS_CODE } from "../constants/status-codes";
import ServerErrorResponse from "../utils/classes/server-error-response";
import { STATUS_MESSAGES } from "../constants/status-messages";
import { SUCCESS_MESSAGES } from "../constants/success-messages";
import ServerSuccessResponse from "../utils/classes/server-success-response";
import { ERROR_MERSSAGES } from "../constants/error-messages";
import Product from "../models/product-model";
import { missingFieldError } from "../utils/missing-field-error";
import { typeMismatchError } from "../utils/type-mismatch-error";

const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [productRes, productPrice] = await Promise.all([
      fetch(`https://fakestoreapi.com/products/${id}`),
      Product.findOne({ product_id: id }).select("value country_code"),
    ]);

    const productData = await productRes.json();

    if (!productData || productData === "") {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MERSSAGES.PRODUCT_NOT_FOUND));
    }

    if (!productPrice) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(
          ServerErrorResponse.notFound(ERROR_MERSSAGES.PRODUCT_PRICE_NOT_FOUND)
        );
    }

    const aggregatedData = {
      id: productData.id,
      title: productData.title,
      current_price: {
        value: productPrice.value,
        country_code: productPrice.country_code,
      },
    };

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.OK,
          SUCCESS_MESSAGES.FOUND,
          aggregatedData
        )
      );
  } catch (error) {
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(
        ServerErrorResponse.customErrorWithStackTrace(
          STATUS_CODE.SERVER_ERROR,
          STATUS_MESSAGES.SERVER_ERROR,
          error
        )
      );
  }
};

const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.body) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(ERROR_MERSSAGES.REQUEST_BODY_NOT_FOUND)
        );
    }

    const { price } = req.body;
    const requiredFields = [{ field: "price", type: "number" as const }];

    const missingError = missingFieldError(requiredFields, req.body);
    if (missingError) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(ServerErrorResponse.badRequest(missingError));
    }

    const typeError = typeMismatchError(requiredFields, req.body);
    if (typeError) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(ServerErrorResponse.badRequest(typeError));
    }

    const [productRes, updatedProductPrice] = await Promise.all([
      fetch(`https://fakestoreapi.com/products/${id}`),
      Product.findOneAndUpdate(
        { product_id: id },
        {
          value: price,
        },
        {
          new: true,
        }
      ),
    ]);

    const productData = await productRes.json();

    if (!productData || productData === "") {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MERSSAGES.PRODUCT_NOT_FOUND));
    }

    const aggregatedData = {
      id: productData.id,
      title: productData.title,
      current_price: {
        value: updatedProductPrice?.value,
        country_code: updatedProductPrice?.country_code,
      },
    };

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.OK,
          SUCCESS_MESSAGES.UPDATE,
          aggregatedData
        )
      );
  } catch (error) {
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(
        ServerErrorResponse.customErrorWithStackTrace(
          STATUS_CODE.SERVER_ERROR,
          STATUS_MESSAGES.SERVER_ERROR,
          error
        )
      );
  }
};

export { getProductById, updateProduct };
