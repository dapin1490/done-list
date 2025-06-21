# L8BY 프로젝트 설정 가이드

## 1. Node.js 설치

### Windows에서 Node.js 설치하기

1. **Node.js 공식 웹사이트 방문**
   - https://nodejs.org/ko/ 에 접속

2. **LTS 버전 다운로드**
   - "LTS" 버튼 클릭 (권장)
   - Windows Installer (.msi) 파일 다운로드

3. **설치 실행**
   - 다운로드한 .msi 파일 실행
   - 설치 마법사의 안내에 따라 설치 진행
   - 기본 설정으로 설치 권장

4. **설치 확인**
   - 명령 프롬프트(cmd) 또는 PowerShell 열기
   - 다음 명령어 실행:
   ```bash
   node --version
   npm --version
   ```

## 2. 프로젝트 실행

Node.js 설치 완료 후:

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **개발 서버 실행**
   ```bash
   npm run dev
   ```

3. **브라우저에서 확인**
   - `http://localhost:3000` 접속

## 3. 대안 설치 방법

### Chocolatey 사용 (Windows)
```bash
choco install nodejs
```

### Scoop 사용 (Windows)
```bash
scoop install nodejs
```

## 4. 문제 해결

### npm 명령어가 인식되지 않는 경우
- 컴퓨터 재시작
- 환경 변수 확인 (PATH에 Node.js 경로 포함)

### 권한 문제
- 관리자 권한으로 명령 프롬프트 실행

---

설치가 완료되면 `npm install` 명령어로 프로젝트를 시작할 수 있습니다! 