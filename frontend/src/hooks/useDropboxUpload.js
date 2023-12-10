import { useState } from "react";
import {Dropbox} from "dropbox";

const useDropboxUpload = () => {
    const [uploading, setUploading] = useState(false);
    const [uploadedURL, setUploadedURL] = useState('');
    const [error, setError] = useState(null);

    const uploadImageToDropbox = async (file) => {
        setUploading(true);
        setError(null);

        try {
            const uniqueFilename = `${file.name}_${Date.now()}`;

            const renamedFile = new File([file], uniqueFilename, { type: file.type });

            const accessToken = 'sl.BrfL4keHtPyJyWi46Q0xzsfzWNt6XARGl_-WgvJw2dF3E048eoHLWY3oqoGAxsUkQn-PafjUpQeO8wyP63OpSPuSdVButLBiUnG2HHm-tUUNwaqOFwuxRT3h1yBok3ajrRidE4Dm4MTPOrbMbIxTJe8'; // Replace with your Dropbox access token
            const dbx = new Dropbox({
                accessToken,
            });

            const response = await dbx.filesUpload({
                path: '/' + renamedFile.name,
                contents: renamedFile,
            });

            const { path_display: uploadedPath } = response.result;
            const sharedLinkResponse = await dbx.sharingCreateSharedLinkWithSettings({
                path: uploadedPath,
                settings: { requested_visibility: { ".tag": "public" } },
            });

            const directFileURL = sharedLinkResponse.result.url.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
            setUploadedURL(directFileURL);
            setUploading(false);
        } catch (err) {
            setError(err);
            setUploading(false);

            if (err.response) {
                console.error("Dropbox API Error:", err.response);  
            } else {
                console.error("Error uploading to Dropbox:", err);
            }
        }
    };

    return {
        uploading,
        uploadedURL,
        error,
        uploadImageToDropbox,
    };
};

export default useDropboxUpload;
