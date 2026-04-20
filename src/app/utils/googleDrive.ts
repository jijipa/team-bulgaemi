/**
 * Google Drive 업로드 응답 타입
 */
export interface DriveUploadResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

/**
 * 이미지를 Google Drive에 업로드
 * @param file - 업로드할 이미지 파일
 * @param googleScriptUrl - Google Apps Script URL
 * @returns 업로드된 이미지 URL 또는 에러
 */
export async function uploadImageToGoogleDrive(
  file: File,
  googleScriptUrl: string
): Promise<DriveUploadResponse> {
  // 파일 크기 체크 (10MB 제한)
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  if (file.size > MAX_SIZE) {
    return {
      success: false,
      error: "이미지 크기가 너무 큽니다. 10MB 이하의 이미지를 선택해주세요.",
    };
  }

  // 이미지 타입 체크
  if (!file.type.startsWith("image/")) {
    return {
      success: false,
      error: "이미지 파일만 업로드할 수 있습니다.",
    };
  }

  try {
    console.log("📤 이미지 업로드 시작:", file.name);

    // 이미지 압축 (Canvas 사용)
    const compressedBlob = await compressImage(file);
    console.log("✅ 이미지 압축 완료:", compressedBlob.size, "bytes");

    // Blob을 Base64로 변환
    const base64 = await blobToBase64(compressedBlob);
    const base64Data = base64.split(",")[1]; // "data:image/png;base64," 부분 제거
    
    // ✅ URL-safe base64로 변환 (+ → -, / → _, = 제거)
    const urlSafeBase64 = base64Data.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

    console.log("📡 업로드 URL:", googleScriptUrl);

    // 청크 업로드 방식 (GET 요청으로 데이터를 여러 번 나눠서 전송)
    const CHUNK_SIZE = 5000; // 5000자씩 청크 (속도 개선)
    const chunks: string[] = [];
    
    for (let i = 0; i < urlSafeBase64.length; i += CHUNK_SIZE) {
      chunks.push(urlSafeBase64.substring(i, i + CHUNK_SIZE));
    }
    
    console.log(`📦 총 ${chunks.length}개 청크로 분할 완료`);
    
    // 업로드 세션 ID 생성
    const uploadId = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log("📤 청크 업로드 시작...");
    
    // 각 청크를 순차적으로 전송
    for (let i = 0; i < chunks.length; i++) {
      const chunkUrl = 
        `${googleScriptUrl}?action=uploadChunk` +
        `&uploadId=${encodeURIComponent(uploadId)}` +
        `&chunkIndex=${i}` +
        `&totalChunks=${chunks.length}` +
        `&data=${encodeURIComponent(chunks[i])}`;
      
      try {
        await fetchJSONP<{ success: boolean; message?: string }>(chunkUrl);
        console.log(`✅ 청크 ${i + 1}/${chunks.length} 업로드 완료`);
      } catch (error) {
        console.error(`❌ 청크 ${i + 1}/${chunks.length} 업로드 실패:`, error);
        return {
          success: false,
          error: `청크 업로드 실패: ${i + 1}/${chunks.length}`,
        };
      }
    }
    
    console.log("✅ 모든 청크 업로드 완료");
    
    // 최종 조합 및 Drive 업로드 요청
    const finalizeUrl = 
      `${googleScriptUrl}?action=finalizeUpload` +
      `&uploadId=${encodeURIComponent(uploadId)}` +
      `&fileName=${encodeURIComponent(file.name)}` +
      `&mimeType=${encodeURIComponent(compressedBlob.type)}`;
    
    console.log("📤 최종 업로드 요청...");
    
    try {
      console.log("🔗 최종 URL:", finalizeUrl);
      const finalResult = await fetchJSONP<{ success: boolean; url?: string; error?: string; message?: string }>(finalizeUrl);
      
      console.log("📥 최종 업로드 응답:", finalResult);
      
      if (finalResult.success && finalResult.url) {
        console.log("✅ Google Drive 업로드 완료:", finalResult.url);
        return {
          success: true,
          imageUrl: finalResult.url,
        };
      } else {
        console.error("❌ 최종 업로드 실패:", finalResult);
        return {
          success: false,
          error: finalResult.error || finalResult.message || "이미지 업로드에 실패했습니다.",
        };
      }
    } catch (error) {
      console.error("❌ 최종 업로드 예외:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "이미지 업로드에 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("❌ Google Drive 업로드 에러:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "이미지 업로드에 실패했습니다.",
    };
  }
}

/**
 * 이미지를 압축 (Canvas 사용)
 */
async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Canvas context를 가져올 수 없습니다.'));
          return;
        }

        // 최대 크기 설정 (1280x1280)
        const maxSize = 1280;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // 배경을 흰색으로 채우기 (투명 PNG 대응)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        
        // 이미지 그리기
        ctx.drawImage(img, 0, 0, width, height);

        // JPEG로 변환 (압축률 0.85)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('이미지 압축에 실패했습니다.'));
            }
          },
          'image/jpeg',
          0.85
        );
      };

      img.onerror = () => {
        reject(new Error('이미지 로드에 실패했습니다.'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('파일 읽기에 실패했습니다.'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Blob을 Base64 문자열로 변환
 */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * JSONP 요청 헬퍼
 */
function fetchJSONP<T = any>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const callback = `jsonp_callback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const separator = url.includes('?') ? '&' : '?';
    const scriptUrl = `${url}${separator}callback=${callback}`;
    
    (window as any)[callback] = (data: T) => {
      cleanup();
      resolve(data);
    };
    
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.async = true;
    
    script.onerror = () => {
      cleanup();
      reject(new Error(`JSONP request failed: ${scriptUrl.substring(0, 100)}...`));
    };
    
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error(`JSONP request timeout`));
    }, 30000); // 30초 타임아웃
    
    const cleanup = () => {
      clearTimeout(timeout);
      delete (window as any)[callback];
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
    
    document.head.appendChild(script);
  });
}