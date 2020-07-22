const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');
const cors = require('./cors');

//Token
var authenticate = require('../authenticate');

//use Mongoose models
const Favorites = require('../models/favorite');

const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus
    })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorites.find({
                'user': req.user._id
            })
            .populate('user')
            .populate('dishes')
            .then((favorites) => {
                if (favorites != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites);
                } else {
                    err = new Error('You have no favorites');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.find({
                'user': req.user._id
            })
            .then((favorites) => {
                req.body.user = req.user._id;

                //If favorite collection of the current user exist
                if (favorites.length) {
                    console.log("favorite", favorites);
                    let favoriteExist = false;
                    //Check if dish is already in favorite list
                    if (favorites[0].dishes.length) {
                        for (var i = 0; i <= favorites[0].dishes.length; i++) {
                            if (favorites[0].dishes[i] == req.body._id) {
                                favoriteExist = true;
                            }
                        }
                    }
                    //CASE 1
                    //When dishes is not included=> adding to the list of favorites
                    if (!favoriteExist) {
                        favorites[0].dishes.push(req.body._id);
                        favorites[0].save()
                            .then((favorite) => {
                                Favorites.findById(favorite._id)
                                    .populate('user')
                                    .populate('dishes')
                                    .then((favorite) => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(favorite);
                                    })
                            }, (err) => next(err));
                    }
                    //CASE 2
                    //When dishes is added to fav list
                    else {
                        console.log('Dish was already in your favorite list!');
                        res.json(favorites);
                    }
                }
                //If the collection of current user not exist
                else {
                    Favorites.create({
                        user: req.body.user
                    }, function (err, favorites) {
                        if (err) throw err;
                        favorites.dishes.push(req.body._id);
                        favorites.save((err, favorites) => {
                            if (err) throw err;
                            console.log('Create favorite list for you!');
                            res.json(favorites);
                        });
                    })
                }
            })
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.remove({
            'user': req.user._id
        }, function (err, resp) {
            if (err) throw err;
            res.json(resp);
        })
    });

//If the dishes is not in favorite list, then add it
//Siilar to POST method above, but taking data from params.favoriteId
favoriteRouter.route('/:favoriteId')
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.find({
                'user': req.user._id
            })
            .then((favorites) => {
                req.body.user = req.user._id;
                console.log("favoriteId param", req.params.favoriteId);
                //If favorite collection of the current user exist
                if (favorites.length) {
                    console.log("Post favorite from params", favorites);
                    let favoriteExist = false;
                    //Check if dish is already in favorite list
                    if (favorites[0].dishes.length) {
                        for (var i = 0; i <= favorites[0].dishes.length; i++) {
                            if (favorites[0].dishes[i] == req.params.favoriteId) {
                                favoriteExist = true;
                            }
                        }
                    }
                    //CASE 1
                    //When dishes is not included=> adding to the list of favorites
                    if (!favoriteExist) {
                        favorites[0].dishes.push(req.params.favoriteId);
                        favorites[0].save()
                            .then((favorite) => {
                                Favorites.findById(favorite._id)
                                    .populate('user')
                                    .populate('dishes')
                                    .then((favorite) => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(favorite);
                                    })
                            }, (err) => next(err));
                    }
                    //CASE 2
                    //When dishes is added to fav list
                    else {
                        console.log('Dish was already in your favorite list!');
                        res.json(favorites);
                    }
                }
                //If the collection of current user not exist
                else {
                    Favorites.create({
                        user: req.body.user
                    }, function (err, favorites) {
                        if (err) throw err;
                        favorites.dishes.push(req.params.favoriteId);
                        favorites.save((err, favorites) => {
                            if (err) throw err;
                            console.log('Create favorite list for you!');
                            res.json(favorites);
                        });
                    })
                }
            })
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.find({
            'user': req.user._id
        }, (err, favorites) => {
            if (err) return err;
            var favorite = favorites ? favorites[0] : null;

            if (favorite) {
                for (var i = (favorite.dishes.length - 1); i >= 0; i--) {
                    if (favorite.dishes[i] == req.params.favoriteId) {
                        favorite.dishes.remove(req.params.favoriteId);
                    }
                }
                favorite.save(function (err, favorite) {
                    if (err) throw err;
                    console.log('Del suceessfully!');
                    res.json(favorite);
                });
            } else {
                console.log('you have no favourites!');
                res.json(favorite);
            }
        })
    })


module.exports = favoriteRouter;