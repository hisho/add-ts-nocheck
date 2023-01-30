# @hisho/add-ts-nocheck
指定したファイルに`// @ts-nocheck`を追加するscript

## Install

```shell
$ npm i -D @hisho/add-ts-nocheck
# or
$ yarn add -D @hisho/add-ts-nocheck
```

## Feature

1. globで指定したファイルに`// @ts-nocheck`を追加する

## Usage

### 1. package.json の scripts に以下を追加する

```json
{
  "scripts": {
    "postinstall": "build:add-ts-nocheck",
    "build:add-ts-nocheck": "add-ts-nocheck --patterns 'node_modules/**/!(*.d).ts,src/**/!(*.d).ts'"
  }
}
```

## TODO

- オプションを受け取れるようにする
- Testを書く