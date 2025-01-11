const {Rating} = require('../models/models');
const ApiError = require('../error/ApiError')

class RatingController{
    async add(req, res, next){
        const {rating, comment, deviceId, userId} = req.body;
        if (!userId || !deviceId) {
            return next(ApiError.badRequest("Missing userId or deviceId"));
          }

        const newComment = await Rating.create({rating, comment, deviceId, userId});
        return res.json(newComment);
    }

    async getAllDeviceComment(req, res, next){
        const {deviceId} = req.query;
        if(!deviceId){
            return next(ApiError.badRequest("Missing deviceId"));
        }

        const comments = await Rating.findAll({where: {deviceId}});
        return res.json(comments);
    }
}

module.exports = new RatingController();
