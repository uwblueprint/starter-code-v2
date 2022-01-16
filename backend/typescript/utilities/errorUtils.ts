/* eslint-disable-next-line import/prefer-default-export */
export const getErrorMessage = (error: unknown): string => {
  return error instanceof Error ? error.message : "Unknown error occurred.";
};
