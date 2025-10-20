// Utility function to standardize API responses
export const sendResponse = (
  res,
  { success, statusCode = 200, data = null, message = "" }
) => {
  // Send JSON response with consistent structure
  res.status(statusCode).json({ success, data, message });
};
