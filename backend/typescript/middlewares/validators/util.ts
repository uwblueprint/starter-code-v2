type Type = "string" | "integer" | "boolean";

export const validatePrimitive = (value: any, type: Type): boolean => {
  if (value === undefined || value === null) return false;

  switch (type) {
    case "string": {
      return typeof value === "string";
    }
    case "boolean": {
      return typeof value === "boolean";
    }
    case "integer": {
      return typeof value === "number" && Number.isInteger(value);
    }
    default: {
      return false;
    }
  }
};

export const validateArray = (value: any, type: Type): boolean => {
  return (
    value !== undefined &&
    value !== null &&
    typeof value === "object" &&
    Array.isArray(value) &&
    value.every((item) => validatePrimitive(item, type))
  );
};

export const validateFileType = (mimetype: string): boolean => {
  const allowableFileExtenstions = [
    "text/plain",
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/gif",
  ];
  return allowableFileExtenstions.includes(mimetype);
};

export const getApiValidationError = (
  fieldName: string,
  type: Type,
  isArray: boolean = false,
): string => {
  return `The ${fieldName} is not a ${type}${isArray ? " Array" : ""}`;
};

export const getFileTypeValidationError = (mimetype: string): string => {
  const allowableFileExtenstions = [
    "text/plain",
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/gif",
  ];
  return `The file type ${mimetype} is not one of ${allowableFileExtenstions}`;
};
