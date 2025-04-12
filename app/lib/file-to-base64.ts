export const toBase64 = (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result?.toString() || "");
    reader.onerror = (error) => reject(error);
  });
};

export function base64ToFile(base64: string, filename: string): File {
  const mime = base64.match(/data:(.*);base64/)?.[1] || "";
  const byteString = atob(base64.split(",")[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uintArray = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uintArray[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([arrayBuffer], { type: mime });
  return new File([blob], filename, { type: mime });
}
