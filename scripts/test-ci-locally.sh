#!/bin/bash
# CI 환경을 로컬에서 재현하여 테스트하는 스크립트

set -e

echo "🔍 CI 환경 로컬 테스트 시작..."
echo ""

# 현재 디렉토리 확인
if [ ! -f "package.json" ]; then
  echo "❌ package.json이 없습니다. 프로젝트 루트에서 실행해주세요."
  exit 1
fi

# pnpm 설치 확인
if ! command -v pnpm &> /dev/null; then
  echo "❌ pnpm이 설치되어 있지 않습니다."
  echo "설치: npm install -g pnpm"
  exit 1
fi

# pnpm 버전 확인
PNPM_VERSION=$(pnpm --version | cut -d'.' -f1)
echo "📦 현재 pnpm 버전: $(pnpm --version)"

if [ "$PNPM_VERSION" -lt 10 ]; then
  echo "⚠️  pnpm 버전이 10 미만입니다. CI에서는 pnpm 10을 사용합니다."
  echo "업그레이드 권장: npm install -g pnpm@latest"
  read -p "계속하시겠습니까? (y/N): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

echo ""
echo "================================"
echo "Step 1: Install dependencies"
echo "================================"
pnpm install --frozen-lockfile

echo ""
echo "================================"
echo "Step 2: Run linter"
echo "================================"
pnpm run lint

echo ""
echo "================================"
echo "Step 3: Run type check"
echo "================================"
pnpm run typecheck

echo ""
echo "================================"
echo "Step 4: Run tests with coverage"
echo "================================"
pnpm run test:coverage

echo ""
echo "✅ 모든 CI 테스트가 성공적으로 완료되었습니다!"
echo ""
echo "💡 다음 단계:"
echo "   - git add .github/workflows/test.yml"
echo "   - git commit -m 'ci: update pnpm version to 10'"
echo "   - git push origin main"
