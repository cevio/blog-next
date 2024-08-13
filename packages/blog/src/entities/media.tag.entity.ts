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

@Entity({ name: 'media_tag' })
@Index(['tag_name', 'media_id'], { unique: true })
export class BlogMediaTagEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Index('tag-idx')
  @Column({
    type: 'varchar',
    length: 250,
    comment: '标签名'
  })
  public tag_name: string;

  @Index('mid-idx')
  @Column({
    type: 'integer',
    comment: '日志 id',
    default: 0,
  })
  public media_id: number;

  @Index('gmtc-idx')
  @Column({
    type: 'timestamp',
    comment: '创建时间',
    default: () => 'CURRENT_TIMESTAMP'
  })
  public gmt_create: Date;

  public add(name: string, mid: number) {
    this.tag_name = name;
    this.media_id = mid;
    this.gmt_create = new Date();
    return this;
  }
}