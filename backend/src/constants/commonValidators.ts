import bcrypt from "bcrypt";
import { z } from "zod";

export const NAME_VALIDATOR = z.string().trim().min(1);

export const PHONE_NUMBER_VALIDATOR = z
  .string()
  .trim()
  .regex(/^(?:\+92|0092|92|0)?(3[0-9]{2})([0-9]{7})$/);

export const URL_VALIDATOR = z.string().trim().url();

export const LOGIN_PASSWORD_VALIDATOR = z.string().trim().min(8);

export const REGISTER_PASSWORD_VALIDATOR = LOGIN_PASSWORD_VALIDATOR.transform(
  (value) => {
    const salt = bcrypt.genSaltSync(12);
    return bcrypt.hashSync(value, salt);
  }
);

export const EMAIL_VALIDATOR = z.string().trim().min(1).email();

export const ID_VALIDATOR = z.string().trim().uuid();

export const DESCRIPTION_VALIDATOR = z.string().trim().min(0);
export const PRICE_VALIDATOR = z.number().min(0);
export const IMAGE_URL_VALIDATOR = z.string().trim().url();
export const DATETIME_VALIDATOR = z.string().trim().datetime();
