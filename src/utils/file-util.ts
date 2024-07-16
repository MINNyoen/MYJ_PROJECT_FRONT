export const dataURItoFile = (dataURI: string) => {
    const BASE64_MARKER = ';base64,';
    const mime = dataURI.split(BASE64_MARKER)[0].split(':')[1];
    const filename = 'File' + (new Date()).getTime() + '.' + mime.split('/')[1];
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });
    return new File([blob], filename, { type: mimeString });
  };