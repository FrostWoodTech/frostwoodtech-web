import axios from "axios";
import type {
  MediaConfigResponse,
  PresignedUploadRequest,
  PresignedUploadResponse,
} from "@/admin/types";
import { httpClient } from "@/admin/services/httpClient";

/** Step 1: get a presigned PUT URL. */
export async function createPresignedUpload(
  body: PresignedUploadRequest,
): Promise<PresignedUploadResponse> {
  const { data } = await httpClient.post<PresignedUploadResponse>(
    "/admin/media/presigned-upload",
    body,
  );
  return data;
}

/** Step 2: PUT to storage directly — not via `httpClient`, which would leak the bearer token. */
export async function uploadToPresignedUrl(
  uploadUrl: string,
  file: File,
  onProgress?: (percent: number) => void,
): Promise<void> {
  await axios.put(uploadUrl, file, {
    headers: { "Content-Type": file.type },
    onUploadProgress: onProgress
      ? (event) => {
          if (event.total)
            onProgress(Math.round((event.loaded / event.total) * 100));
        }
      : undefined,
  });
}

/** Resolves to a `media://` token, not a URL; display it with `resolveMediaDisplayUrl`. */
export async function uploadImage(
  request: PresignedUploadRequest,
  file: File,
): Promise<string> {
  const presigned = await createPresignedUpload(request);
  await uploadToPresignedUrl(presigned.uploadUrl, file);
  return `media://${presigned.objectKey}`;
}

export async function getMediaConfig(): Promise<MediaConfigResponse> {
  const { data } = await httpClient.get<MediaConfigResponse>(
    "/admin/media/config",
  );
  return data;
}
