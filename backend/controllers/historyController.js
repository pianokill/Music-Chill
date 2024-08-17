import historyModel from "../models/historyModel.js";

class historyController {
    async getHistory(req, res) {
        const userId = req.user.id
        const songData = await historyModel.getHistoryArtist(userId);
        res.json(songData);
    }

    async getLikedSongs(req, res) {
        const userId = req.user.id
        const songIds = await historyModel.getUserLikedSongs(userId);
        console.log(songIds)
        res.json(songIds);
    }

    async updateLikeSong(req, res) {
        const userId = req.user.id
        const songId = req.params.id
        const liked = req.body.liked
        await historyModel.updateLikeSong(userId, songId, liked);
        res.json({ message: "Success" });
    }

    async updateListeningTimes(req, res) {
        const userId = req.user.id
        const songId = req.params.id
        const times = req.body.times
        await historyModel.updateListeningTimes(userId, songId, times);
        res.json({ message: "Success" });
    }

}

export default new historyController();