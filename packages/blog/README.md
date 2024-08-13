# PJBlog

2004-present blog which base `injection` logic.

## Install

```bash
$ npm i @pjblog/blog
$ pnpm i @pjblog/blog
```

## Usage

```ts
import createBlog, { BlogProps, Newable, Plugin } from '@pjblog/blog';
createBlog(options: BlogProps, plugins?: Newable<Plugin<any>>[]): void;
```