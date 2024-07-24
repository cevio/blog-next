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

@Entity({ name: 'categories' })
export class BlogCategoryEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Index('name-idx', { unique: true })
  @Column({
    type: 'varchar',
    length: 50,
    comment: '分类名',
    nullable: false
  })
  public cate_name: string;

  @Column({
    type: 'integer',
    comment: '分类排序',
    default: 0
  })
  public cate_order: number;

  @Column({
    type: 'bool',
    comment: '是否外链',
    default: false
  })
  public cate_outable: boolean;

  @Column({
    type: 'text',
    comment: '外链地址',
    nullable: true
  })
  public cate_outlink: string;

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

  public add(name: string, link?: string) {
    this.updateName(name);
    this.updateLink(link);
    this.gmt_create = this.gmt_modified;
    return this;
  }

  public updateName(name: string) {
    this.cate_name = name;
    this.gmt_modified = new Date();
    return this;
  }

  public updateOrder(i: number) {
    this.cate_order = i;
    this.gmt_modified = new Date();
    return this;
  }

  public updateLink(link?: string) {
    if (link) {
      this.cate_outable = true;
      this.cate_outlink = link;
    } else {
      this.cate_outable = false;
      this.cate_outlink = null;
    }
    this.gmt_modified = new Date();
    return this;
  }
}