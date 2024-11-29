#!/bin/bash

echo "Reading dependencies from application.properties..."
DEPENDENCIES=$(grep '^dependencies=' ./application.properties | cut -d'=' -f2)

echo "Dependencies: $DEPENDENCIES"

# 예를 들어, 의존성을 설치하는 과정
for dep in ${DEPENDENCIES//,/ }
do
  echo "Installing dependency: $dep"
  # 의존성 설치 명령어 (예: curl, wget 등)
done

# 빌드 실행
echo "Running custom build..."
# 실제 빌드 명령어 추가
