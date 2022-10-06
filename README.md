# GitHub Pages
Проект для демонстрации возможностей GitHub Pages.

## Запуск проекта
1. Установите зависимости с помощью команды `yarn`
2. Запуск локального сервера командой `yarn dev`
3. Запуск продуктовой сборки выполняется командой `yarn build & yarn preview` или выполнением двух команд поочереди:
   1. `yarn build` для получения продуктовой сборки
   2. `yarn preview` для запуска

## Инструкция по настройке GitHub Pages `Deploy from a Branch`
Этот вариант наиболее оптимальный, если ваш сайт не нужно собирать перед использованием. Например, если вы ведете разработку на html.
1. На github в нужном репозитории перейти в раздел `Settings -> Code and automation -> Pages`
2. В разделе `Build and deployment`:
   1. в качестве `Source` выбрать опцию `Deploy from a Branch`
   2. выбрать нужную `branch`, в которой находится код для отображения
   3. выбрать папку: корневую или docs

## Инструкция по настройке GitHub Pages используя `GitHub Actions`
Этот вариант подходит при использовании вами какого0либо фреймворка, чтобы автоматизировать процесс сборки вашего сайта.
1. На github в нужном репозитории перейти в раздел `Settings -> Code and automation -> Pages`
2. В разделе `Build and deployment` в качестве `Source` выбрать опцию `GitHub Actions`
3. Добавить файл `./.github/workflows/pages.yml` в ваш проект

### Пример файла `GitHub Actions` для сборщика `Vite`
```yaml
# ./.github/workflows/pages.yml
name: Deploy github pages

on:
  # Runs on pushes targeting the default branch
  push:
    branches: ["main"]

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x]
    steps:
      - uses: actions/checkout@v3

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}

      - name: Install Packages
        run: yarn

      - name: Build page
        run: yarn build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v1
        with:
          path: ./dist

  # Deployment job
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v1
```

Если хотите изменить имя ветки, изменение кода в которой будет вызывать запуск `GitHub Actions`. Измените настройки:
```yaml
on:
   # Runs on pushes targeting the default branch
   push:
      branches: ["main"]
```
Нужно заменить на:
```yaml
on:
   # Runs on pushes targeting the default branch
   push:
      branches: ["new_branch", "another_branch"]
```

### Изменения в файле для GitHub Actions для `create react app`
```yaml
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v1
        with:
          path: ./dist
```
Нужно заменить на:
```yaml
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v1
        with:
          path: ./build
```

### Изменения в файле для GitHub Actions для `Nextjs`
```yaml
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v1
        with:
          path: ./dist
```
Нужно заменить на:
```yaml
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v1
        with:
           path: ./out
```
Так же изменяется процесс сборки:
```yaml
      - name: Install Packages
        run: yarn
      
      - name: Build page
        run: yarn build
```
Нужно заменить на:
```yaml
      - name: Setup Pages
           id: pages
           uses: actions/configure-pages@v1
           with:
              # Automatically inject basePath in your Next.js configuration file and disable
              # server side image optimization (https://nextjs.org/docs/api-reference/next/image#unoptimized).
              #
              # You may remove this line if you want to manage the configuration yourself.
              static_site_generator: next
              
      - name: Install Packages
        run: yarn

      - name: Build page
        run: yarn next build

      - name: Build page
        run: yarn next export
```