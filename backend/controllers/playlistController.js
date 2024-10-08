import playlistModel from "../models/playlistModel.js";

class playlistController {
    async createPlaylist(req, res) {
        const userId = req.user.id;
        const { name, is_public } = req.body;
        const newPlaylist = await playlistModel.createPlaylist(name, is_public, userId);
        console.log(newPlaylist);
        res.json(newPlaylist);
    }

    async getUserPlaylist(req, res) {
        const userId = req.user.id;
        const playlists = await playlistModel.getAllUserPlaylist(userId);
        res.json(playlists);
    }

    async addSongToPlaylist(req, res) {
        const { playlistId, songId } = req.body;
        await playlistModel.addSongToPlaylist(playlistId, songId);
        res.json({ message: "Song added to playlist successfully" });
    }

    async getPlaylistSongs(req, res) {
        const playlistId = req.params.playlistId;
        const songs = await playlistModel.getPlaylistSongs(playlistId);
        res.json(songs);
    }
}

export default new playlistController();