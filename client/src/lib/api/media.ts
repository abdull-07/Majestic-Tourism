import api from '../api';

export interface UploadResult {
    url: string;
    publicId: string;
}

export const mediaApi = {
    upload: (file: File, folder: string) => {
        const formData = new FormData();
        formData.append('file', file);
        return api
            .post<UploadResult>(`/admin/media/upload?folder=${folder}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            .then((r) => r.data);
    },
};