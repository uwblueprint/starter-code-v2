// eslint-disable-next-line import/prefer-default-export
export const downloadFile = (data: string, fileName: string): void => {
  const url = URL.createObjectURL(data);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(url);
  });
};
