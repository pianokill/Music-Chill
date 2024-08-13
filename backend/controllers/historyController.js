import historyModel from "../models/historyModel.js";

class historyController {
    async getHistory(req, res) {
        const userId = req.user.id
        const songData = await historyModel.getHistoryArtist(userId);
        res.json(songData);
    }
}

export default new historyController();