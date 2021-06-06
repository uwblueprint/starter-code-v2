type Type = "string" | "integer" | "boolean" | "string-array";

const isValid = (value: any, type: Type): boolean => {
  if (value === undefined || value === null) return false;

  if (type === "string") {
    return typeof value === "string";
  }
  if (type === "boolean") {
    return typeof value === "boolean";
  }
  if (type === "integer") {
    return typeof value === "number" && Number.isInteger(value);
  }
  if (type === "string-array") {
    return (
      typeof value === "object" &&
      Array.isArray(value) &&
      value.every((item) => isValid(item, "string"))
    );
  }
  return false;
};

export default isValid;
