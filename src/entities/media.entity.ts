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
import { generate } from 'randomstring';
import pkg from 'crypto-js';
const { MD5 } = pkg;

@Entity({ name: 'media' })
export class BlogMediaEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Index('title-idx')
  @Column({
    type: 'varchar',
    length: 255,
    comment: '标题',
    nullable: false,
  })
  public media_title: string;

  @Index('category-idx')
  @Column({
    type: 'integer',
    comment: '所属分类',
    default: 0,
  })
  public media_category: number;

  @Column({
    type: 'text',
    comment: '文案',
    nullable: false,
  })
  public media_description: string;

  @Index('user-idx')
  @Column({
    type: 'integer',
    comment: '发布者',
    default: 0,
  })
  public media_user_id: number;

  @Index('token-idx', { unique: true })
  @Column({
    type: 'varchar',
    length: 32,
    comment: '唯一识别码',
    nullable: false,
  })
  public media_token: string;

  @Column({
    type: 'integer',
    comment: '阅读量',
    default: 0,
  })
  public media_read_count: number;

  @Column({
    type: 'varchar',
    length: 250,
    comment: '类型',
    nullable: false,
  })
  public media_type: string;

  @Column({
    type: 'bool',
    comment: '是否允许评论',
    default: true,
  })
  public commentable: boolean;

  @Index('gmtc-idx')
  @Column({
    type: 'timestamp',
    comment: '创建时间',
    default: () => 'CURRENT_TIMESTAMP'
  })
  public gmt_create: Date;

  @Index('gmtm-idx')
  @Column({
    type: 'timestamp',
    comment: '更新时间',
    default: () => 'CURRENT_TIMESTAMP'
  })
  public gmt_modified: Date;

  public add(opts: {
    title: string,
    category: number,
    description: string,
    uid: number,
    type: string,
  }) {
    this.update(opts);
    this.media_user_id = opts.uid;
    this.media_type = opts.type;
    this.media_token = MD5(generate(16) + ':' + Date.now()).toString();
    return this;
  }

  public update(opts: {
    title: string,
    category: number,
    description: string,
  }) {
    this.media_title = opts.title;
    this.media_category = opts.category;
    this.media_description = opts.description;
    this.gmt_modified = new Date();
    return this;
  }

  public updateCount(i: number) {
    this.media_read_count = i;
    this.gmt_modified = new Date();
    return this;
  }

  public updateCommentable(value: boolean) {
    this.commentable = value;
    this.gmt_modified = new Date();
    return this;
  }
}