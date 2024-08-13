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
import pkg from 'crypto-js';
import { generate } from 'randomstring';
import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

const { SHA1, MD5 } = pkg;

@Entity({ name: 'users' })
@Index(['account', 'thirdpart_node_module'], {
  unique: true
})
export class BlogUserEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Index('account-idx')
  @Column({
    type: 'varchar',
    length: 255,
    comment: '用户登入账号，在同一种登录类型下必须唯一',
    nullable: false
  })
  public account: string;

  @Column({
    type: 'varchar',
    length: 255,
    comment: '昵称',
    nullable: true,
  })
  public nickname: string;

  @Column({
    type: 'varchar',
    length: 255,
    comment: '邮箱',
    nullable: true,
  })
  public email: string;

  @Column({
    type: 'text',
    comment: '头像',
    nullable: true,
  })
  public avatar: string;

  @Index('pass-idx')
  @Column({
    type: 'varchar',
    length: 40,
    comment: '密码编码',
    nullable: false,
  })
  public password: string;

  @Column({
    type: 'varchar',
    length: 6,
    comment: '盐',
    nullable: false,
  })
  public salt: string;

  @Index('token-idx')
  @Column({
    type: 'varchar',
    length: 32,
    comment: 'token',
    nullable: false,
  })
  public token: string;

  @Index('forbiden-idx')
  @Column({
    type: 'bool',
    default: false,
    comment: '是否禁止登录'
  })
  public forbiden: boolean;

  @Column({
    type: 'bool',
    comment: '是否管理员',
    default: false // 普通用户
  })
  public admin: boolean;

  @Column({
    type: 'text',
    comment: '个人网站',
    nullable: true,
  })
  public website: string;

  @Index('thirdpart-idx')
  @Column({
    type: 'bool',
    default: false,
    comment: '是否为第三方登录',
  })
  public thirdpart: boolean;

  @Column({
    type: 'varchar',
    length: 255,
    comment: '第三方登录的模块名称',
    nullable: true,
  })
  public thirdpart_node_module: string;

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

  public createPasswordHashCode(password: string) {
    return SHA1(this.salt + ':' + password).toString();
  }

  public checkPassword(password: string) {
    return this.createPasswordHashCode(password) === this.password;
  }

  public updatePassword(password: string) {
    this.salt = generate(6);
    this.password = this.createPasswordHashCode(password);
    this.gmt_modified = new Date();
    return this;
  }

  public add(account: string, password: string) {
    this.account = account;
    this.nickname = account;
    this.updatePassword(password);
    this.updateToken();
    this.gmt_create = this.gmt_modified;
    return this;
  }

  public updateToken() {
    this.token = MD5(this.password + ':' + Date.now()).toString();
    this.gmt_create = new Date();
    return this;
  }

  public addWithThirdpart(account: string, nickname: string, email: string, avatar: string, website: string, thirdpart: string) {
    this.account = account;
    this.updateProfile(nickname, email, avatar, website);
    this.thirdpart = true;
    this.thirdpart_node_module = thirdpart;
    this.gmt_create = this.gmt_modified;
    return this;
  }

  public updateProfile(nickname: string, email: string, avatar: string, website: string) {
    this.nickname = nickname;
    this.email = email;
    this.avatar = avatar;
    this.website = website;
    this.gmt_modified = new Date();
    return this;
  }

  public updateAdmin(value: boolean) {
    this.admin = value;
    this.gmt_modified = new Date();
    return this;
  }

  public updateForbiden(status: boolean) {
    this.forbiden = status;
    this.gmt_modified = new Date();
    return this;
  }
}