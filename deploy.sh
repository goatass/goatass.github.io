#! /bin/bash

set -ue

git checkout dist
git rebase src
npm run build
if [ -f .gitignore ]
then
  sed -i 's/^dist\/$//' .gitignore
fi
git add -A .
git commit -m "`date`"
git stash
git push --force origin dist
git push origin `git subtree split --prefix dist dist`:sub --force
git checkout master
git rebase sub
git push --force origin master
