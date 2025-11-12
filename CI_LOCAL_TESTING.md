# CI 로컬 테스트 가이드

GitHub Actions CI 환경을 로컬에서 재현하여 테스트하는 방법입니다.

## 🎯 문제 해결

### pnpm lockfile 버전 불일치 문제

**증상**: CI에서 `ERR_PNPM_NO_LOCKFILE` 또는 lockfile 관련 에러 발생

**원인**:

- 로컬: pnpm 10.x → lockfileVersion 9.0
- CI: pnpm 8.x → lockfileVersion 6.0 (호환 안 됨)

**해결**: `.github/workflows/test.yml`에서 pnpm 버전을 10으로 업데이트

```yaml
- name: Install pnpm
  uses: pnpm/action-setup@v4
  with:
    version: 10 # 8에서 10으로 변경
```

## 방법 1: 직접 명령어 실행 (빠른 확인)

```bash
# CI와 동일한 명령어 순서대로 실행
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test:coverage
```

## 방법 2: 스크립트 사용 (권장)

```bash
# 전체 CI 파이프라인 로컬 실행
./scripts/test-ci-locally.sh
```

이 스크립트는:

- pnpm 버전 확인
- 의존성 설치 (`--frozen-lockfile`)
- Linter 실행
- 타입 체크
- 테스트 + 커버리지

## 방법 3: act 사용 (완전한 CI 재현)

### act 설치

```bash
# macOS (Homebrew)
brew install act

# 또는 설치 스크립트 사용
./scripts/install-act.sh
```

### act 사용법

```bash
# 사용 가능한 워크플로우 확인
act -l

# 특정 job 실행
act -j test

# Node.js 18.x 매트릭스만 실행
act -j test --matrix node-version:18.x

# Node.js 20.x 매트릭스만 실행
act -j test --matrix node-version:20.x

# 전체 워크플로우 실행
act

# ARM Mac에서 실행 시
act --container-architecture linux/amd64
```

### act 장점

✅ GitHub Actions와 100% 동일한 환경
✅ Docker 기반으로 격리된 실행
✅ 매트릭스 빌드 테스트 가능
✅ 푸시 전에 CI 실패 미리 확인

### act 단점

⚠️ Docker 필요
⚠️ 초기 이미지 다운로드 시간 소요
⚠️ 리소스 사용량 높음

## 버전 확인

```bash
# pnpm 버전 확인
pnpm --version

# Node.js 버전 확인
node --version

# lockfile 버전 확인
head -1 pnpm-lock.yaml
```

## 권장 워크플로우

1. **개발 중**: `pnpm test` 또는 `pnpm test:watch`
2. **커밋 전**: `./scripts/test-ci-locally.sh`
3. **푸시 전** (선택): `act -j test`
4. **푸시 후**: GitHub Actions에서 확인

## 트러블슈팅

### pnpm 버전이 낮은 경우

```bash
# pnpm 업그레이드
npm install -g pnpm@latest

# 또는
corepack enable
corepack prepare pnpm@latest --activate
```

### lockfile이 손상된 경우

```bash
# lockfile 재생성
rm pnpm-lock.yaml
pnpm install

# git에 커밋
git add pnpm-lock.yaml
git commit -m "fix: regenerate pnpm-lock.yaml"
```

### act 실행 시 Docker 에러

```bash
# Docker 실행 확인
docker ps

# Docker Desktop 재시작 필요할 수 있음
```

## 참고 자료

- [pnpm 공식 문서](https://pnpm.io/)
- [act GitHub](https://github.com/nektos/act)
- [GitHub Actions 문서](https://docs.github.com/en/actions)
