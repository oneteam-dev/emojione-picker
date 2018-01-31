#!/bin/bash

set -eu

NAME=sugarshin
PKG=emojione-picker
SCOPED_PKG="@$NAME/$PKG"

git fetch origin --tags --prune
set +e
TAG=$(git describe --abbrev=0 --tags)
set -e
VERSION=${TAG:1}
TARGET="$SCOPED_PKG@$VERSION"

if [[ $VERSION && -z "$(npm view "${TARGET}" --json)" ]]; then
  echo $TARGET
  npm i minimist@1.2.0
  node ./oneteam-scripts/packagejson-resolve $VERSION
  npm publish --access=public
fi
