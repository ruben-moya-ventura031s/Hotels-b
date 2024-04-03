const catchError = require('../utils/catchError');
const Hotel = require('../models/Hotel');
const { Op } = require('sequelize');
const Review = require('../models/Review');
const City = require('../models/City');
const Image = require('../models/Image');

const getAll = catchError(async(req, res) => {
    const {name, cityId} = req.query
    const where = {}
    if(cityId) where.cityId = cityId
    if(name) where.name = { [Op.iLike]: `%${name}%` }
    const results = await Hotel.findAll({
        include: [ Review, City, Image ],
        where: where,
    });

    const newsWithRating = results.map(hotel => {
        const newsJson = hotel.toJSON()
        let sum = 0
        newsJson.reviews.forEach(review => {
            sum += review.rating
        })
        const totalReview = newsJson.reviews.length
        const average = totalReview > 0 ? sum / totalReview : 0
        delete newsJson.reviews
        return { ...newsJson, rating: average}
        
    })

    return res.json(newsWithRating);
});

const create = catchError(async(req, res) => {
    const result = await Hotel.create(req.body);
    return res.status(201).json(result);
});

const getOne = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await Hotel.findByPk(id, {include: [Review, Image, City]});
    if(!result) return res.sendStatus(404)
    const newsJson = result.toJSON()
        let sum = 0
        newsJson.reviews.forEach(review => {
            sum += review.rating
        })
        const totalReview = newsJson.reviews.length
        const average = totalReview > 0 ? sum / totalReview : 0
        delete newsJson.reviews
        return res.json({ ...newsJson, rating: average});
});

const remove = catchError(async(req, res) => {
    const { id } = req.params;
    await Hotel.destroy({ where: {id} });
    return res.sendStatus(204);
});

const update = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await Hotel.update(
        req.body,
        { where: {id}, returning: true }
    );
    if(result[0] === 0) return res.sendStatus(404);
    return res.json(result[1][0]);
});

module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update
}