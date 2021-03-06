// -*- mode: js; indent-tabs-mode: nil; js-basic-offset: 4 -*-
//
// This file is part of Thingpedia
//
// Copyright 2018 The Board of Trustees of the Leland Stanford Junior University
//
// Author: Giovanni Campagna <gcampagn@cs.stanford.edu>
//
// See COPYING for details
"use strict";

const db = require('../util/db');

module.exports = {
    async create(dbClient, post) {
        const id = await db.insertOne(dbClient, `insert into blog_posts set ?`, [post]);
        post.id = id;
        return post;
    },

    delete(dbClient, id) {
        return db.query(dbClient, `delete from blog_posts where id = ?`, [id]);
    },

    update(dbClient, id, post) {
        return db.query(dbClient, `update blog_posts set ?, upd_date = current_timestamp() where id = ?`, [post, id]);
    },

    publish(dbClient, id) {
        return db.query(dbClient, `update blog_posts set pub_date = current_timestamp(), upd_date = current_timestamp() where id = ?`, [id]);
    },
    unpublish(dbClient, id) {
        return db.query(dbClient, `update blog_posts set pub_date = null where id = ?`, [id]);
    },

    getAll(dbClient, start, end) {
        return db.selectAll(dbClient, `select bp.id,author,title,slug,blurb,image,pub_date,upd_date,u.human_name as author_name
            from blog_posts bp,users u where u.id = bp.author order by upd_date desc limit ?,?`, [start, end]);
    },
    getAllPublished(dbClient, start, end) {
        return db.selectAll(dbClient, `select bp.id,author,title,slug,blurb,image,pub_date,upd_date,u.human_name as author_name
            from blog_posts bp,users u where u.id = bp.author and pub_date is not null order by upd_date desc limit ?,?`, [start, end]);
    },

    getForView(dbClient, id) {
        return db.selectOne(dbClient, `select bp.id,author,title,slug,image,pub_date,upd_date,body,u.human_name as author_name from blog_posts bp,users u where u.id = bp.author and bp.id = ?`, [id]);
    },

    getForEdit(dbClient, id) {
        return db.selectOne(dbClient, `select * from blog_posts where id = ?`, [id]);
    },
};
