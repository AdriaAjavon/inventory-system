export function successResponse(
  title,
  message,
  data = {},
  type = "success"
) {
  return {
    success: true,
    title,
    message,
    type,
    data,
    timestamp: new Date(),
  };
}

export function errorResponse(
  message,
  title = "Error"
) {
  return {
    success: false,
    title,
    message,
    type: "error",
    data: {},
    timestamp: new Date(),
  };
}

export function infoResponse(
  title,
  message,
  data = {}
) {
  return {
    success: true,
    title,
    message,
    type: "info",
    data,
    timestamp: new Date(),
  };
}