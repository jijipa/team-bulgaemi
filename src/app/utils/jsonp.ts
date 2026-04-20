/**
 * 🌐 JSONP 헬퍼 함수
 * Google Apps Script는 CORS 제한이 있어서 JSONP 방식으로 데이터를 가져와야 해요
 */

export function fetchJSONP<T = any>(
  url: string,
  callbackName?: string
): Promise<T> {
  return new Promise((resolve, reject) => {
    // 고유한 callback 함수 이름 생성
    const callback = callbackName || `jsonp_callback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // URL에 callback 파라미터 추가
    const separator = url.includes('?') ? '&' : '?';
    const scriptUrl = `${url}${separator}callback=${callback}`;
    
    // 전역 callback 함수 등록
    (window as any)[callback] = (data: T) => {
      // 성공 시 cleanup & resolve
      cleanup();
      resolve(data);
    };
    
    // script 태그 생성
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.async = true;
    
    // 에러 핸들링
    script.onerror = () => {
      cleanup();
      reject(new Error(`JSONP request failed: ${url}`));
    };
    
    // Timeout 설정 (30초로 증가)
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error(`JSONP request timeout: ${url}`));
    }, 30000);
    
    // Cleanup 함수
    const cleanup = () => {
      clearTimeout(timeout);
      delete (window as any)[callback];
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
    
    // script 태그를 DOM에 추가 (요청 시작)
    document.head.appendChild(script);
  });
}