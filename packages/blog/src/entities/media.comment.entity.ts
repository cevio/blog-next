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

@Entity({ name: 'media_comment' })
export class BlogMediaCommentEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Index('mid-idx')
  @Column({
    type: 'integer',
    comment: 'media id',
    default: 0,
  })
  public media_id: number;

  @Index('user-idx')
  @Column({
    type: 'integer',
    comment: '发布者',
    default: 0,
  })
  public user_id: number;

  @Column({
    type: 'text',
    comment: '内容',
  })
  public content: string;

  @Index('parent-idx')
  @Column({
    type: 'integer',
    comment: '所属评论ID',
    default: 0,
  })
  public parent_id: number;

  @Column({
    type: 'integer',
    comment: '子评论数',
    default: 0,
  })
  public child_count: number;

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

  public add(media_id: number, user: number, content: string, parent_id: number = 0) {
    this.media_id = media_id;
    this.user_id = user;
    this.content = content;
    this.parent_id = parent_id;
    this.gmt_create = this.gmt_modified = new Date();
    return this;
  }

  public updateContent(content: string) {
    this.content = content;
    this.gmt_modified = new Date();
    return this;
  }

  public updateChildCount(i: number) {
    this.child_count = this.child_count + i;
    this.gmt_modified = new Date();
    return this;
  }
}