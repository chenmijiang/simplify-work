import logger from "./logger";

function errorHandler(error) {
  logger.error("An error occurred:", error.message);
  // Exit the process with an error code
  process.exit(1);
}

export default errorHandler;
