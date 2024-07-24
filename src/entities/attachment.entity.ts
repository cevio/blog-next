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

@Entity({ name: 'attachments' })
export class BlogAttachmentEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    type: 'text',
    comment: '路径',
    nullable: false
  })
  public path: string;

  @Column({
    type: 'integer',
    comment: '大小',
    default: 0
  })
  public size: number;

  @Column({
    type: 'varchar',
    length: 255,
    comment: '类型',
    nullable: false
  })
  public type: string;

  @Column({
    type: 'bool',
    comment: '是否是图片',
    default: false
  })
  public is_image: boolean;

  @Index('md5-idx', {
    unique: true,
  })
  @Column({
    type: 'varchar',
    length: 32,
    comment: '外链地址',
    nullable: false
  })
  public md5: string;

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

  public update(path: string, size: number, type: string, md5: string) {
    this.path = path;
    this.size = size;
    this.type = type;
    this.is_image = type.startsWith('image/');
    this.md5 = md5;
    this.gmt_modified = new Date();
    return this;
  }
}