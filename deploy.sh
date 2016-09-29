#! /bin/bash

set -ue

npm run build
git checkout dist
git add -A dist
git commit -m "`date`"
git push --force origin dist
git push origin `git subtree split --prefix dist dist`:sub --force
git checkout master
git rebase sub
