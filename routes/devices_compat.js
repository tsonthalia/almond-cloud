// -*- mode: js; indent-tabs-mode: nil; js-basic-offset: 4 -*-
//
// This file is part of ThingEngine
//
// Copyright 2015 The Board of Trustees of the Leland Stanford Junior University
//
// Author: Giovanni Campagna <gcampagn@cs.stanford.edu>
//
// See COPYING for details
"use strict";

const express = require('express');

const user = require('../util/user');
const EngineManager = require('../almond/enginemanagerclient');

var router = express.Router();

router.use(user.requireLogIn);

router.get('/oauth2/callback/:kind', (req, res, next) => {
    const kind = req.params.kind;

    EngineManager.get().getEngine(req.user.id).then((engine) => {
        return engine.devices.factory;
    }).then((devFactory) => {
        var saneReq = {
            httpVersion: req.httpVersion,
            url: req.url,
            headers: req.headers,
            rawHeaders: req.rawHeaders,
            method: req.method,
            query: req.query,
            session: req.session,
        };
        return devFactory.runOAuth2(kind, saneReq);
    }).then(() => {
        if (req.session['device-redirect-to']) {
            res.redirect(303, req.session['device-redirect-to']);
            delete req.session['device-redirect-to'];
        } else {
            res.redirect(303, '/me');
        }
    }).catch(next);
});

module.exports = router;
