/**
 * Copyright (c) PJBlog Platforms, net. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @Author evio<evio@vip.qq.com>
 * @Website https://www.pjhome.net
 */

'use strict';

import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";
import pkg from 'crypto-js';
const { MD5 } = pkg;

// https://blog.csdn.net/yangziqi098/article/details/102373271
@Entity({ name: 'media_article' })
export class BlogMediaArticleEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Index('mid-idx')
  @Column({
    type: 'integer',
    comment: 'media id',
    default: 0,
  })
  public media_id: number;

  @Column({
    type: 'text',
    comment: '文章内容',
    nullable: false,
  })
  public markdown: string;

  @Column({
    type: 'json',
    comment: '参考来源地址',
  })
  public source: string[];

  @Column({
    type: 'varchar',
    length: 32,
    comment: '文章内容md5',
    nullable: false,
    default: 'default-hashcode'
  })
  public md5: string;

  public update(markdown: string, source: string[] = []) {
    this.markdown = markdown;
    this.md5 = MD5(markdown).toString();
    this.source = source;
    return this;
  }

  public add(mid: number, markdown: string, source: string[] = []) {
    this.media_id = mid;
    this.update(markdown, source);
    return this;
  }
}