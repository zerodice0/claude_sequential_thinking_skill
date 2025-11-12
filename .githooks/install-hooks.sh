#!/bin/bash
# Git Hooks 설치 스크립트

echo "설치 중: Git Hooks..."

# pre-commit hook 설치
cp .githooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
echo "✅ pre-commit hook 설치 완료 (자동 코드 포맷팅)"

# pre-push hook 설치
cp .githooks/pre-push .git/hooks/pre-push
chmod +x .git/hooks/pre-push
echo "✅ pre-push hook 설치 완료 (워크플로우 검증)"

echo ""
echo "🎉 Git Hooks 설치 완료!"
echo "- 커밋 전: 자동으로 Prettier가 코드를 포맷팅합니다"
echo "- 푸시 전: 자동으로 GitHub Actions 워크플로우를 검증합니다"
