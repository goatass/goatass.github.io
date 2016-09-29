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
git branch -D sub
git subtree push --prefix dist origin sub
git checkout sub
git push --force origin sub
git checkout master
git rebase sub
git push --force origin master
