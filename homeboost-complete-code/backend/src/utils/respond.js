export function ok(res, data = null, message = 'OK', status = 200) {
  return res.status(status).json({ status: 'success', message, data });
}

export function created(res, data = null, message = 'Created') {
  return ok(res, data, message, 201);
}
