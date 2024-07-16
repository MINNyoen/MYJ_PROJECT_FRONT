export const transFormData = (data : any) => {
    const bodyFormData = new FormData();
    Object.keys(data).forEach((key) => {
        bodyFormData.append(key, data[key]);
    })
    return bodyFormData;
}