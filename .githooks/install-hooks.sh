#!/bin/bash
# Git Hooks 설치 스크립트

echo "설치 중: Git Hooks..."
cp .githooks/pre-push .git/hooks/pre-push
chmod +x .git/hooks/pre-push
echo "✅ Git Hooks 설치 완료!"
echo "이제 푸시 전 자동으로 actionlint가 실행됩니다."
