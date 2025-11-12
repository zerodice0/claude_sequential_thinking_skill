#!/bin/bash
# act 설치 스크립트 (GitHub Actions 로컬 실행 도구)

set -e

echo "🚀 act 설치 중..."
echo ""
echo "act는 GitHub Actions를 로컬에서 실행할 수 있게 해주는 도구입니다."
echo "자세한 정보: https://github.com/nektos/act"
echo ""

# OS 감지
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  if command -v brew &> /dev/null; then
    echo "📦 Homebrew를 사용하여 설치합니다..."
    brew install act
  else
    echo "❌ Homebrew가 설치되어 있지 않습니다."
    echo "Homebrew 설치: /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    exit 1
  fi
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  # Linux
  echo "📦 curl을 사용하여 설치합니다..."
  curl --proto '=https' --tlsv1.2 -sSf https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash
else
  echo "❌ 지원되지 않는 OS입니다."
  echo "수동 설치 방법: https://github.com/nektos/act#installation"
  exit 1
fi

echo ""
echo "✅ act 설치 완료!"
echo ""
echo "💡 사용 방법:"
echo "   act                    # 기본 워크플로우 실행"
echo "   act -l                 # 사용 가능한 워크플로우 목록"
echo "   act -j test            # 특정 job만 실행"
echo "   act --container-architecture linux/amd64  # ARM Mac에서 실행 시"
