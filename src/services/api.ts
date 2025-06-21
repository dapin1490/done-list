import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? '/api' // 프로덕션 환경에서는 상대 경로 사용 (프록시 설정 필요)
    : 'http://localhost:8000', // 개발 환경에서는 백엔드 주소 직접 사용
});

// 요청 인터셉터: 로컬 스토리지에서 토큰을 가져와 헤더에 추가
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default api; 