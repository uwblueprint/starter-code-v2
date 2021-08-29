// eslint-disable-next-line import/prefer-default-export
export const downloadCSV = (data: string, fileName: string): void => {
  const byteOrderMark = "\uFEFF";
  const csvContent = byteOrderMark + data;
  const blob = new Blob([csvContent], {
    type: "text/csv, charset=UTF-8",
  });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(url);
  });
};
