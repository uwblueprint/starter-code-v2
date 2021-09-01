// eslint-disable-next-line import/prefer-default-export
export const downloadFile = (data: string, fileName: string): void => {
  const a = document.createElement("a");
  a.href = data;
  a.download = fileName;
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(url);
  });
};
