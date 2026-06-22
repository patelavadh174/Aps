import { HttpError } from '../utils/httpError.js';

export function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      throw new HttpError(400, 'Validation failed', result.error.flatten());
    }
    req[source] = result.data;
    next();
  };
}
