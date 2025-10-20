export const sendResponse = (
  res,
  { success, statusCode = 200, data = null, message = "" }
) => {
  res.status(statusCode).json({ success, data, message });
};
