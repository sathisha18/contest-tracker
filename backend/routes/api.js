const express = require('express');
const axios = require('axios');
const Bookmark = require('../models/Bookmark');
const Solution = require('../models/Solution');
const router = express.Router();

const platformMap = {
  'codeforces': 'Codeforces',
  'codechef': 'CodeChef',
  'leetcode': 'LeetCode',
};

router.get('/contests', async (req, res) => {
  try {
    const response = await axios.get('https://kontests.net/api/v1/all');
    const supportedPlatforms = ['codeforces', 'codechef', 'leetcode'];
    const contests = response.data
      .filter(contest => supportedPlatforms.includes(contest.site.toLowerCase()))
      .map(contest => {
        const startTime = new Date(contest.start_time);
        const endTime = new Date(contest.end_time);
        const currentTime = new Date();
        let status;
        if (currentTime < startTime) {
          status = 'upcoming';
        } else if (currentTime >= startTime && currentTime <= endTime) {
          status = 'ongoing';
        } else {
          status = 'past';
        }
        const timeRemaining = currentTime < startTime ? Math.ceil((startTime - currentTime) / (1000 * 60 * 60)) : 0; // Hours remaining
        const platform = platformMap[contest.site.toLowerCase()];
        return {
          id: contest.url, // Using URL as a unique identifier
          platform,
          name: contest.name,
          startTime,
          status,
          timeRemaining,
          url: contest.url,
        };
      });
    res.json(contests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contests' });
  }
});

router.post('/bookmarks', async (req, res) => {
  const { contestId, platform, name, startTime } = req.body;
  const bookmark = new Bookmark({ contestId, platform, name, startTime });
  await bookmark.save();
  res.status(201).json(bookmark);
});

router.get('/bookmarks', async (req, res) => {
  const bookmarks = await Bookmark.find();
  res.json(bookmarks);
});

router.post('/solutions', async (req, res) => {
  const { contestId, platform, youtubeLink } = req.body;
  const solution = new Solution({ contestId, platform, youtubeLink });
  await solution.save();
  res.status(201).json(solution);
});

router.get('/solutions', async (req, res) => {
  const solutions = await Solution.find();
  res.json(solutions);
});

module.exports = router;