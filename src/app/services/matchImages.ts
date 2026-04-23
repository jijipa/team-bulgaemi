import { isSupabaseConfigured, supabase } from "../lib/supabase";

const MATCH_IMAGE_BUCKET = "match-images";
const MAX_IMAGE_DIMENSION = 1600;
const JPEG_QUALITY = 0.82;
const MATCH_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "heic", "heif"];

const getFileExtension = (file: File): string => {
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension) return extension;
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  if (file.type === "image/heic") return "heic";
  if (file.type === "image/heif") return "heif";
  return "jpg";
};

const loadImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("이미지를 불러오지 못했습니다."));
    };
    image.src = objectUrl;
  });
};

const canvasToBlob = (
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("이미지 최적화에 실패했습니다."));
        }
      },
      type,
      quality,
    );
  });
};

const optimizeImage = async (file: File): Promise<{ blob: Blob; contentType: string; extension: string }> => {
  const image = await loadImage(file);
  const scale = Math.min(
    1,
    MAX_IMAGE_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight),
  );
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("이미지 최적화를 지원하지 않는 브라우저입니다.");
  }

  canvas.width = width;
  canvas.height = height;
  context.drawImage(image, 0, 0, width, height);

  const blob = await canvasToBlob(canvas, "image/jpeg", JPEG_QUALITY);
  return { blob, contentType: "image/jpeg", extension: "jpg" };
};

export const uploadMatchImageToSupabase = async (
  matchId: string,
  file: File,
): Promise<string> => {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured.");
  }

  let uploadBody: Blob | File;
  let contentType = file.type || "application/octet-stream";
  let extension = getFileExtension(file);

  try {
    const optimized = await optimizeImage(file);
    uploadBody = optimized.blob;
    contentType = optimized.contentType;
    extension = optimized.extension;
  } catch (error) {
    console.warn("⚠️ 이미지 최적화 실패, 원본 파일로 업로드합니다.", error);
    uploadBody = file;
  }

  const filePath = `matches/${matchId}/cover.${extension}`;
  const stalePaths = MATCH_IMAGE_EXTENSIONS
    .filter((staleExtension) => staleExtension !== extension)
    .map((staleExtension) => `matches/${matchId}/cover.${staleExtension}`);

  await supabase.storage.from(MATCH_IMAGE_BUCKET).remove(stalePaths);

  const { error: uploadError } = await supabase.storage
    .from(MATCH_IMAGE_BUCKET)
    .upload(filePath, uploadBody, {
      cacheControl: "3600",
      contentType,
      upsert: true,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage
    .from(MATCH_IMAGE_BUCKET)
    .getPublicUrl(filePath);

  return `${data.publicUrl}?v=${Date.now()}`;
};

export const deleteMatchImagesFromSupabase = async (
  matchId: string,
): Promise<void> => {
  if (!isSupabaseConfigured || !supabase) {
    return;
  }

  const paths = MATCH_IMAGE_EXTENSIONS.map(
    (extension) => `matches/${matchId}/cover.${extension}`,
  );
  const { error } = await supabase.storage
    .from(MATCH_IMAGE_BUCKET)
    .remove(paths);

  if (error) {
    throw error;
  }
};
