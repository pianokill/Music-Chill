import songModel from "../models/songModel.js";
import axios from 'axios';

class songController {
    async createSong(req, res) {
        const songId = parseInt(await songModel.getCurrentSongMaxId()) + 1;
        console.log(songId);
        try {
            // Read the file and encode it to base64
            const fileContent1 = req.files.songFile[0].buffer.toString('base64');
            const fileContent2 = req.files.imgFile[0].buffer.toString('base64');
            const fileName1 = songId + ".mp3";
            const fileName2 = songId + ".jpg";

            // GitHub API details
            const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
            const REPO_OWNER = process.env.REPO_OWNER;
            const REPO_NAME = process.env.REPO_NAME;
            const TARGET_PATH1 = `audio/${fileName1}`;
            const TARGET_PATH2 = `image/${fileName2}`;

            // GitHub API URL
            const url1 = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${TARGET_PATH1}`;
            const url2 = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${TARGET_PATH2}`;
            const headers = {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            };
            const body1 = {
                message: `Upload ${fileName1}`,
                content: fileContent1
            };

            const body2 = {
                message: `Upload ${fileName2}`,
                content: fileContent2
            };

            // Send the request to GitHub API
            const response1 = await axios.put(url1, body1, { headers: headers});
            const response2 = await axios.put(url2, body2, { headers: headers});
            const songName = req.body.songName;
            const artistId = req.user.id;
            const releaseDate = req.body.releaseDate;
            let categoryIds = req.body.categories;
            await songModel.createSong(songName, artistId, releaseDate);
            if (categoryIds.constructor !== Array) {
                categoryIds = [categoryIds];
            }
            categoryIds.forEach(async (categoryId) => {
                await songModel.addCategoryToSong(songId, parseInt(categoryId));
            });
            if (response1.status === 201 && response2.status === 201) {
                // Send back the GitHub file URL
                res.json({ message: `File uploaded successfully! URL1: ${response1.data.content.html_url}, URL2:
                    ${response2.data.content.html_url}`});
            } else if (response1.status !== 201) {
                res.json({ message: `Failed to upload file: ${response1.data.message}`});
            } else {
                res.json({ message: `Failed to upload file: ${response2.data.message}`});
            }
        } catch (error) {
            res.json({ message: `Error: ${error.message}` });
        }
    }

    async getSongs(req, res) {
        const songData = await songModel.getAllSongs();
        console.log(songData);
        res.json(songData);
    }
}

export default new songController();