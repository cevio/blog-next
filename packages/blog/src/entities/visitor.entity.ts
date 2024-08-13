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

@Entity({ name: 'visitors' })
export class BlogVisitorEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    type: 'varchar',
    length: 50,
    comment: 'ip',
    nullable: false
  })
  public ip: string;

  @Column({
    type: 'text',
    comment: 'user-agent',
    nullable: false
  })
  public user_agent: string;

  @Column({
    type: 'varchar',
    length: 100,
    comment: 'token',
    nullable: false
  })
  public token: string;

  @Column({
    type: 'varchar',
    length: 255,
    comment: 'account',
    nullable: true
  })
  public account: string;

  @Index('gmtc-idx')
  @Column({
    type: 'timestamp',
    comment: '创建时间',
    default: () => 'CURRENT_TIMESTAMP'
  })
  public gmt_create: Date;

  public add(token: string, timestamp: number, ip: string, userAgent: string, account?: string) {
    this.token = token;
    this.account = account;
    this.ip = ip;
    this.user_agent = userAgent;
    this.gmt_create = new Date(timestamp);
    return this;
  }
}