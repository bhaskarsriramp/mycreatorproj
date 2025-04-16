const express = require('express');
import cookieParser from "cookie-parser";
const router = express.Router();
import bcrypt from "bcryptjs";
import moment from "moment";
import VideoComments from "../models/Comments.js";
import USER from "../models/User.js";
import USER_TEMP from "../models/TempUser.js";
import VIDEO_DETAILS from "../models/VideoDetails.js";
import sendMail from "../utils/sendMail.js";
router.use(cookieParser());
import axios from "axios";
import authenticateToken from "../middleware/authenticateToken.js";
import generateJWTtoken  from "../middleware/generateJWTtoken.js";



const generatePin = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "https://creatorconsole.co/creator/connect_youtube";
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const bufferTime = 5 * 60 * 1000; // 5 minutes buffer



async function getValidYouTubeAccessToken(user) {
    const currentTime = Date.now();
    const { youtube_access_token, youtube_access_token_expiry, youtube_refresh_token } = user;

    // Check if existing token is still valid (with at least 5 minutes left)
    if (
        youtube_access_token &&
        youtube_access_token_expiry instanceof Date &&
        youtube_access_token_expiry.getTime() > currentTime + bufferTime
    ) {
        return youtube_access_token; // No need to refresh
    }

    // If token is expired or about to expire, refresh it
    console.log("Refreshing YouTube access token...");

    try {
        const tokenResponse = await axios.post(GOOGLE_TOKEN_URL, null, {
            params: {
                client_id: CLIENT_ID,  // Use from env
                client_secret: CLIENT_SECRET,  // Use from env
                refresh_token: youtube_refresh_token,
                grant_type: "refresh_token",
            },
        });

        if (tokenResponse.data.access_token) {
            const newAccessToken = tokenResponse.data.access_token;
            const newExpiryTime = new Date(Date.now() + tokenResponse.data.expires_in * 1000);

            // Update user in DB
            await USER.findByIdAndUpdate(user._id, {
                youtube_access_token: newAccessToken,
                youtube_access_token_expiry: newExpiryTime,
            });

            console.log("New access token generated and updated in DB");
            return newAccessToken;  // Return the new token
        } else {
            throw new Error("Failed to refresh access token");
        }
    } catch (error) {
        console.error("Error refreshing YouTube access token:", error.response?.data || error.message);
        throw error;  // Propagate error to calling function
    }
}

function parseDuration(duration) {
  const match = duration.match(/PT(\d+M)?(\d+S)?/);

  const minutes = match[1] ? parseInt(match[1].replace('M', '')) : 0;
  const seconds = match[2] ? parseInt(match[2].replace('S', '')) : 0;

  return minutes * 60 + seconds;
}


router.get("/verify-login-token-refresh-token", authenticateToken, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ valid: false, channelConnected : false, message: "Invalid token" });
        }

        const user = await USER.findById(req.user.user_id);

        if (!user) {
            return res.status(404).json({ valid: false, channelConnected : false, message: "User not found" });
        }

        if (!user.youtube_channel_linked) {
            return res.status(400).json({ valid: true, channelConnected : false, message: "No linked YouTube channel" });
        }


        return res.status(200).json({ valid: true, channelConnected : true });

    } catch (error) {
        console.error("Unexpected error:", error.response?.data || error.message);
        return res.status(500).json({ valid: false, channelConnected : false, message: "Internal Server Error" });
    }
});

router.post("/check-email-exists-sendMail", async function (req, res) {

  const { email } = req.body;
  const pin = generatePin();

  
  USER.findOne({ email : email}).then( async (result)=>{

    if(result){

      const options = {
        to: email,
        subject: "Password Reset PIN - CreatorConsole",
        text: `Your 6-digit PIN: ${pin}`,
    }

    await USER.findByIdAndUpdate(result._id, { reset_pin: pin });
    await sendMail(options);

    res.status(200).send({ exists : true, emailSent: true});
    res.end();


    }

    else{

      res.status(200).send({ exists: false});
      res.end();


    }

  }).catch((err) =>{

    return res.status(500).send({
      error: "Internal server error",
      data: null,
      message: "An error occurred",
    });

  })


});

router.post("/delete-account-permanently-with-code", authenticateToken, async (req, res) => {
  try {
    if (!req.user || !req.user.user_id) {
      return res.status(401).json({ emailSent: false, error: "Invalid token" });
    }

    const user = await USER.findById(req.user.user_id);

    if (!user) {
      return res.status(404).json({ emailSent: false, error: "User does not exist" });
    }

    const pin = generatePin();

    const options = {
      to: user.email,
      subject: "Account Delete Code - CreatorConsole",
      text: `Your 6-digit PIN: ${pin}`,
    };

    await Promise.all([
      USER.findByIdAndUpdate(user._id, { account_delete_code: pin }),
      sendMail(options),
    ]);

    return res.status(200).json({ emailSent: true });

  } catch (error) {
    console.error("Delete code error:", error);
    return res.status(500).json({
      emailSent: false,
      error: "Internal server error. Please try again later.",
    });
  }
});


router.post("/connect_youtube", authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ valid: false, message: "Invalid token" });
    }

    const userId = req.user.user_id;
    const { code } = req.body;

    if (!code || !userId) {
      return res.status(400).json({ error: "Authorization code or userId missing" });
    }

    try {
      // Step 1 - Exchange Authorization Code for Tokens
      const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", null, {
        params: {
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code,
          grant_type: "authorization_code",
          redirect_uri: REDIRECT_URI,
        },
      });

      const { access_token, refresh_token, expires_in } = tokenResponse.data;

      if (!access_token || !refresh_token) {
        return res.status(400).json({ error: "Failed to retrieve tokens" });
      }

      // Step 2 - Fetch Channel ID (Get the user's channel details)
      const channelResponse = await axios.get("https://www.googleapis.com/youtube/v3/channels", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        params: {
          part: "id,snippet",
          mine: true,  // Get authenticated user's channel
        },
      });


      const channel = channelResponse.data.items?.[0];
      console.log('channel:::::::::::', channel);
      if (!channel) {
        return res.status(400).json({ error: "Failed to fetch channel information" });
      }

      const channelId = channel.id;

      // Step 3 - Save tokens & channel info to DB
      const accessTokenExpiry = new Date(Date.now() + expires_in * 1000);
      const refreshTokenExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Assuming refresh token expiry 30 days

      await USER.findByIdAndUpdate(
        userId,
        {
          youtube_access_token: access_token,
          youtube_refresh_token: refresh_token,
          youtube_access_token_expiry: accessTokenExpiry,
          youtube_refresh_token_expiry: refreshTokenExpiry,
          youtube_channel_linked: true,
          youtube_channel_id: channelId, 
          youtube_channel_title: channel.snippet.title,
          youtube_channel_description: channel.snippet.description,
          youtube_channel_profile_img: channel.snippet.thumbnails.medium.url,
          youtube_channel_username: channel.snippet.customUrl,
          youtube_channel_publishedAt: channel.snippet.publishedAt,
          youtube_channel_country: channel.snippet?.country || '',
        },
        { new: true, upsert: true }
      );

      return res.status(200).json({ valid: true, channelId });
    } catch (error) {
      console.error("Error during YouTube connection:", error.response?.data || error.message);
      return res.status(500).json({ valid: false, error: "Failed to connect YouTube channel" });
    }
  } catch (error) {
    console.error("Unexpected error:", error.message);
    return res.status(500).json({ valid: false, message: "Internal Server Error" });
  }
});

router.get("/get_subscribers_data", authenticateToken, async (req, res) => {

    try {
        if (!req.user) {
            return res.status(401).json({ valid: false, message: "Invalid token" });
        }

        const userId = req.user.user_id;

        const user = await USER.findById(userId);

        let access_token_for = user.youtube_access_token;

        if (!user || !user.youtube_channel_id) {
            return res.status(400).json({ valid: false, message: "User not found or YouTube channel not linked" });
        }

        const { youtube_access_token_expiry } = user;

        const currentTime = Date.now();
        const bufferTime = 5 * 60 * 1000; // 5 minutes buffer

        const isTokenExpiring = youtube_access_token_expiry instanceof Date &&
                                youtube_access_token_expiry.getTime() <= currentTime + bufferTime;

        if (isTokenExpiring) {
          access_token_for = await getValidYouTubeAccessToken(user);
        
        }

        const channelId = user.youtube_channel_id;

        // ===================
        // 1️⃣ Fetch Total Subscribers (YouTube Data API v3)
        // ===================
        const youtubeResponse = await axios.get("https://www.googleapis.com/youtube/v3/channels", {
            headers: { Authorization: `Bearer ${access_token_for}` },
            params: {
                part: "statistics",
                id: channelId,
            },
        });

        const totalSubscribers = parseInt(youtubeResponse.data?.items?.[0]?.statistics?.subscriberCount || "0");

        // ===================
        // 2️⃣ Fetch Last 28 Days Subscribers Gained (YouTube Analytics API)
        // ===================
        const today = new Date();
        const startDate = new Date();
        startDate.setDate(today.getDate() - 28);

        const formattedStartDate = startDate.toISOString().split('T')[0];
        const formattedEndDate = today.toISOString().split('T')[0];

        const analyticsResponse = await axios.get(`https://youtubeanalytics.googleapis.com/v2/reports`, {
            headers: { Authorization: `Bearer ${access_token_for}` },
            params: {
                ids: 'channel==MINE',
                startDate: formattedStartDate,
                endDate: formattedEndDate,
                metrics: 'subscribersGained,subscribersLost',
                dimensions: 'day',
            },
        });

        let subscribersGained = 0;
        let subscribersLost = 0;

        analyticsResponse.data?.rows?.forEach(row => {
            subscribersGained += row[1];  // row[1] = subscribersGained for the day
            subscribersLost += row[2];    // row[2] = subscribersLost for the day
        });

        const netSubscribersLast28Days = subscribersGained - subscribersLost;

        return res.status(200).json({
            valid: true,
            totalSubscribers,
            last28DaysCount: netSubscribersLast28Days,
        });

    } catch (error) {
        console.error("Error fetching YouTube subscriber data:", error.response?.data || error.message);
        return res.status(500).json({ valid: false, message: "Failed to fetch subscriber data" });
    }
});



async function fetchYouTubeAnalytics(startDate, endDate, access_token, channel_id) {

    const metrics = 'views,estimatedMinutesWatched,subscribersGained,subscribersLost';

    const url = `https://youtubeanalytics.googleapis.com/v2/reports?` +
        `ids=channel==${channel_id}&` +
        `startDate=${startDate}&endDate=${endDate}&` +
        `metrics=${metrics}`;

    const headers = {
        Authorization: `Bearer ${access_token}`
    };

    const response = await axios.get(url, { headers });
    console.log('RESSSSSSSSSSS:::::::::', response.data);
    return response.data;
}

// Helper to sum the metrics for multiple days
async function aggregateMetrics(rows) {
    const total = {
        views: 0,
        watchTimeMinutes: 0,
        subscribersGained: 0,
        subscribersLost: 0
    };

    rows.forEach(row => {
        total.views += row[0];
        total.watchTimeMinutes += row[1];
        total.subscribersGained += row[2];
        total.subscribersLost += row[3];
    });

    return total;
}


router.post('/channel-analytics', authenticateToken, async (req, res) => {
    const { range } = req.body;

    try {
        if (!req.user) {
          console.log('true');
            return res.status(401).json({ valid: false, message: "Invalid token" });
            
        }

        const userId = req.user.user_id;
        const user = await USER.findById(userId);
        let currentStartDate, prevStartDate, prevEndDate;

        const today = moment().format('YYYY-MM-DD');
        if (range === 'last7days') {
            currentStartDate = moment().subtract(6, 'days').format('YYYY-MM-DD');  // Current 7 days
            prevStartDate = moment().subtract(13, 'days').format('YYYY-MM-DD');    // Previous 7 days
            prevEndDate = moment().subtract(7, 'days').format('YYYY-MM-DD');       // End day for previous period
        } else if (range === 'last28days') {
            currentStartDate = moment().subtract(27, 'days').format('YYYY-MM-DD');  // Current 28 days
            prevStartDate = moment().subtract(55, 'days').format('YYYY-MM-DD');     // Previous 28 days
            prevEndDate = moment().subtract(28, 'days').format('YYYY-MM-DD');       // End day for previous period
        } else {
            return res.status(400).json({ error: "Invalid range provided" });
        }

        // Handle token refresh if necessary
        let access_token_for = user.youtube_access_token;
        const currentTime = Date.now();
        const bufferTime = 5 * 60 * 1000; // 5 minutes buffer

        const isTokenExpiring = user.youtube_access_token_expiry instanceof Date &&
            user.youtube_access_token_expiry.getTime() <= currentTime + bufferTime;

        if (isTokenExpiring) {
            access_token_for = await getValidYouTubeAccessToken(user);
        }

        // Fetch data for current and previous periods
        const currentPeriod = await fetchYouTubeAnalytics(currentStartDate, today, access_token_for, user.youtube_channel_id);
        const prevPeriod = await fetchYouTubeAnalytics(prevStartDate, prevEndDate, access_token_for, user.youtube_channel_id);

        const currentMetrics = await aggregateMetrics(currentPeriod.rows || []);
        const prevMetrics = await aggregateMetrics(prevPeriod.rows || []);

        // Helper to calculate percentage change
        const calculatePercentageChange = (current, prev) => {
            if (prev === 0) {
                return current === 0 ? 0 : 100; // If both are 0, no change; otherwise, 100% increase
            }
            return ((current - prev) / prev * 100).toFixed(2);
        };

        const response = {
            views: {
                current: currentMetrics.views,
                previous: prevMetrics.views,
                changePercent: calculatePercentageChange(currentMetrics.views, prevMetrics.views)
            },
            watchTime: {
                current: currentMetrics.watchTimeMinutes,
                previous: prevMetrics.watchTimeMinutes,
                changePercent: calculatePercentageChange(currentMetrics.watchTimeMinutes, prevMetrics.watchTimeMinutes)
            },
            subscribers: {
                // gained: currentMetrics.subscribersGained,
                // lost: currentMetrics.subscribersLost,
                current: currentMetrics.subscribersGained - currentMetrics.subscribersLost,
                previous: prevMetrics.subscribersGained - prevMetrics.subscribersLost,
                changePercent: calculatePercentageChange(
                    currentMetrics.subscribersGained - currentMetrics.subscribersLost,
                    prevMetrics.subscribersGained - prevMetrics.subscribersLost
                )
            }
        };      

        return res.status(200).json({
            valid: true,
            data: response
        });

    } catch (error) {
        console.error("YouTube Analytics Fetch Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch analytics data" });
    }
});

router.post('/subscribers_gained_user_date_range', authenticateToken, async (req, res) => {
  
  const { range } = req.body;

  console.log('Range :', range);

  try {
      if (!req.user) {
        console.log('true');
          return res.status(401).json({ valid: false, message: "Invalid token" });
          
      }

      const userId = req.user.user_id;
      const user = await USER.findById(userId);


      let currentStartDate, prevStartDate, prevEndDate;

      const today = moment().format('YYYY-MM-DD');
      if (range === 'last7days') {
          currentStartDate = moment().subtract(6, 'days').format('YYYY-MM-DD');  // Current 7 days
        
      } else if (range === 'last28days') {
          currentStartDate = moment().subtract(27, 'days').format('YYYY-MM-DD');  // Current 28 days
        
      }
      else if (range === 'last90days') {
        currentStartDate = moment().subtract(89, 'days').format('YYYY-MM-DD');  // Current 28 days
      
    }

      // Handle token refresh if necessary
      let access_token_for = user.youtube_access_token;
      console.log('Access_token :', access_token_for);
      const currentTime = Date.now();
      const bufferTime = 5 * 60 * 1000; // 5 minutes buffer
      const channelId = user.youtube_channel_id;


      const isTokenExpiring = user.youtube_access_token_expiry instanceof Date &&
          user.youtube_access_token_expiry.getTime() <= currentTime + bufferTime;

      if (isTokenExpiring) {
          access_token_for = await getValidYouTubeAccessToken(user);
      }

      const myResponse = await getAllVideoDetails(access_token_for, channelId, '2025-02-24T00:00:00Z');

      console.log('myResponse:::::::', myResponse);

      // const currentPeriod = await fetchYouTubeAnalytics(currentStartDate, today, access_token_for, user.youtube_channel_id);
      // const prevPeriod = await fetchYouTubeAnalytics(prevStartDate, prevEndDate, access_token_for, user.youtube_channel_id);

      // const currentMetrics = await aggregateMetrics(currentPeriod.rows || []);
      // const prevMetrics = await aggregateMetrics(prevPeriod.rows || []);

    
      // const calculatePercentageChange = (current, prev) => {
      //     if (prev === 0) {
      //         return current === 0 ? 0 : 100; // If both are 0, no change; otherwise, 100% increase
      //     }
      //     return ((current - prev) / prev * 100).toFixed(2);
      // };

      // const response = {
      //     views: {
      //         current: currentMetrics.views,
      //         previous: prevMetrics.views,
      //         changePercent: calculatePercentageChange(currentMetrics.views, prevMetrics.views)
      //     },
      //     watchTime: {
      //         current: currentMetrics.watchTimeMinutes,
      //         previous: prevMetrics.watchTimeMinutes,
      //         changePercent: calculatePercentageChange(currentMetrics.watchTimeMinutes, prevMetrics.watchTimeMinutes)
      //     },
      //     subscribers: {
      //         // gained: currentMetrics.subscribersGained,
      //         // lost: currentMetrics.subscribersLost,
      //         current: currentMetrics.subscribersGained - currentMetrics.subscribersLost,
      //         previous: prevMetrics.subscribersGained - prevMetrics.subscribersLost,
      //         changePercent: calculatePercentageChange(
      //             currentMetrics.subscribersGained - currentMetrics.subscribersLost,
      //             prevMetrics.subscribersGained - prevMetrics.subscribersLost
      //         )
      //     }
      // };      

      // return res.status(200).json({
      //     valid: true,
      //     data: response
      // });

  } catch (error) {
      console.error("YouTube Analytics Fetch Error:", error.response?.data || error.message);
      res.status(500).json({ error: "Failed to fetch analytics data" });
  }
});

async function getAllVideoDetails(access_token, channel_id, startDate) {
    let videoDetails = [];
    let nextPageToken = null;
    const headers = { Authorization: `Bearer ${access_token}` };

    try {
        // Step 1: Get the "Uploads" playlist ID (where all uploaded videos are stored)
        const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channel_id}`;
        const channelResponse = await axios.get(channelUrl, { headers });
        const uploadsPlaylistId = channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;

        // Step 2: Fetch all video IDs from the "Uploads" playlist (with pagination)
        do {
            const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${uploadsPlaylistId}&maxResults=50${nextPageToken ? `&pageToken=${nextPageToken}` : ""}`;
            const playlistResponse = await axios.get(playlistUrl, { headers });

            console.log('playlistResponse : ', playlistResponse.data.items[0].contentDetails);

        
            playlistResponse.data.items
            .filter(item => new Date(item.contentDetails.videoPublishedAt) >= new Date(startDate))
            .map(item => { 
                const video_id = item.contentDetails.videoId;
                const published_at = item.contentDetails.videoPublishedAt;
                videoDetails.push({ video_id, video_published_at: published_at });
            });
        
          

            // Get next page token (if exists)
            nextPageToken = playlistResponse.data.nextPageToken || null;
        } while (nextPageToken);

        console.log('Total Videos Found: ', JSON.stringify(videoDetails));

        const subscriberDetails = await fetchVideoAnalytics(videoDetails, channel_id, access_token);

        return subscriberDetails;
    } catch (error) {
        console.error("❌ Error fetching video details:", error.response?.data || error.message);
        throw error;
    }
}

async function fetchVideoAnalytics(videoDetails, channelId, access_token) {
  const headers = { Authorization: `Bearer ${access_token}` };
  const currentDate = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
  let analyticsResults = [];

  for (const { video_id, video_published_at } of videoDetails) {
      const startDate = video_published_at.split("T")[0]; // Extract YYYY-MM-DD from publishedAt

      // const analyticsUrl = `https://youtubeanalytics.googleapis.com/v2/reports?ids=channel==${channelId}&startDate=${startDate}&endDate=${currentDate}&metrics=audienceWatchRatio,relativeRetentionPerformance&dimensions=elapsedVideoTimeRatio&filters=video==${video_id}&audienceType==ORGANIC`;
      // const analyticsUrl = `https://youtubeanalytics.googleapis.com/v2/reports?ids=channel==${channelId}&startDate=2025-01-01&endDate=${currentDate}&metrics=views&dimensions=country&filters=country==US`;
      // const analyticsUrl = `https://youtubeanalytics.googleapis.com/v2/reports?ids=channel==${channelId}&startDate=2025-01-01&endDate=${currentDate}&metrics=viewerPercentage&dimensions=ageGroup,gender&filters=claimedStatus==claimed;province==IN-TG&sort=gender,ageGroup`;
      const analyticsUrl = `https://youtubeanalytics.googleapis.com/v2/reports?ids=channel==${channelId}&startDate=2025-01-01&endDate=${currentDate}&metrics=viewerPercentage&dimensions=ageGroup,gender`;

      const countryData = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${YOUTUBE_API_KEY}`






      try {
          const response = await axios.get(analyticsUrl, { headers });

          console.log('respose:::::::', response.data);

          let subscribersGained = 0;

          if (response.data.rows) {
              response.data.rows.forEach(row => {
                  const [video, gained] = row;
                  if (gained !== undefined) subscribersGained = gained;
              });
          }

          analyticsResults.push({ video_id, subscribersGained });
      } catch (error) {
          console.error(`❌ Error fetching analytics for video ${video_id}:`, error.response?.data || error.message);
      }
  }

  return analyticsResults;
}


router.get("/get_latestVideo_data", authenticateToken, async (req, res) => {
    try {

      if (!req.user) {
        console.log('true');
          return res.status(401).json({ valid: false, message: "Invalid token" });
          
      }

      const userId = req.user.user_id;
      const user = await USER.findById(userId);

      let access_token = user.youtube_access_token;
      const currentTime = Date.now();
      const bufferTime = 5 * 60 * 1000; // 5 minutes buffer

      const isTokenExpiring = user.youtube_access_token_expiry instanceof Date &&
          user.youtube_access_token_expiry.getTime() <= currentTime + bufferTime;

      if (isTokenExpiring) {
          access_token = await getValidYouTubeAccessToken(user);
      }

      const channel_id = user.youtube_channel_id;

        const headers = { Authorization: `Bearer ${access_token}` };

        // Step 1: Get the latest video from YouTube Data API
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channel_id}&order=date&maxResults=1&type=video`;
        const searchResponse = await axios.get(searchUrl, { headers });

        if (!searchResponse.data.items.length) {
            return res.status(404).json({ error: "No videos found" });
        }

        const latestVideo = searchResponse.data.items[0];
        const videoId = latestVideo.id.videoId;

        // Step 2: Fetch video details including hashtags
        const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}`;
        const detailsResponse = await axios.get(detailsUrl, { headers });
        const videoData = detailsResponse.data.items[0];

        const videoDetails = {
            video_id: videoId,
            title: videoData.snippet.title,
            description: videoData.snippet.description,
            thumbnail: videoData.snippet.thumbnails.high.url,
            publishedAt: videoData.snippet.publishedAt,
            views: videoData.statistics.viewCount || 0,
            likes: videoData.statistics.likeCount || 0,
            dislikes: videoData.statistics.dislikeCount || 0,
            shares: videoData.statistics.shareCount || 0,
            commentsCount: videoData.statistics.commentCount || 0,
            hashtags: videoData.snippet.tags || [],
        };

        // Step 3: Fetch video analytics (watch time, impressions, subscribers gained/lost)
        const startDate = videoDetails.publishedAt.split("T")[0]; // Extract YYYY-MM-DD
        const endDate = new Date().toISOString().split("T")[0];
        console.log('StartDate, endDate : ', startDate, endDate);

        const analyticsUrl = `https://youtubeanalytics.googleapis.com/v2/reports?metrics=estimatedMinutesWatched,subscribersGained,subscribersLost&ids=channel==${channel_id}&filters=video==${videoId}&startDate=${startDate}&endDate=${endDate}`;

        let analyticsData = { watchTime: 0, subscribersGained: 0, subscribersLost: 0 };

        try {

        const headers = { Authorization: `Bearer ${access_token}` }; // Use access_token

        const analyticsResponse = await axios.get(analyticsUrl, { headers });

            if (analyticsResponse.data.rows && analyticsResponse.data.rows.length > 0) {
                const row = analyticsResponse.data.rows[0]; // Extract first row
                analyticsData = {
                    watchTime: row[0] || 0,
                    subscribersGained: row[1] || 0,
                    subscribersLost: row[2] || 0,
                };
            }
        } catch (error) {
            console.error("⚠️ Error fetching analytics data:", error.message);
        }

        // Step 4: Merge analytics data with video details
        Object.assign(videoDetails, analyticsData);

        // Step 5: Update or Insert in MongoDB
        const updatedVideo = await VIDEO_DETAILS.findOneAndUpdate(
            { video_id: videoId },
            { $set: videoDetails }, // Always update fields, missing values are stored as 0
            { upsert: true, new: true }
        );

        console.log("✅ Latest video details updated:", updatedVideo);
        return res.json(updatedVideo);

    } catch (error) {
        console.error("❌ Error fetching latest video:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/get_latest_videos", authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ valid: false, message: "Invalid token" });
    }

    const userId = req.user.user_id;
    const user = await USER.findById(userId);
    let access_token = user.youtube_access_token;
    const currentTime = Date.now();
    const bufferTime = 5 * 60 * 1000; // 5-minute buffer

    if (
      user.youtube_access_token_expiry instanceof Date &&
      user.youtube_access_token_expiry.getTime() <= currentTime + bufferTime
    ) {
      access_token = await getValidYouTubeAccessToken(user);
    }

    const channel_id = user.youtube_channel_id;
    const headers = { Authorization: `Bearer ${access_token}` };

    // Step 1: Get the latest 10 videos
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channel_id}&order=date&maxResults=10&type=video`;
    const searchResponse = await axios.get(searchUrl, { headers });


    if (!searchResponse.data.items.length) {
      return res.status(404).json({ error: "No videos found" });
    }

    const videoIds = searchResponse.data.items.map((video) => video.id.videoId).join(",");

    // Step 2: Fetch video details
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds}`;
    const detailsResponse = await axios.get(detailsUrl, { headers });

    const videos = detailsResponse.data.items.map((video) => ({
      video_id: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnail: video.snippet.thumbnails.high.url,
      views: video.statistics.viewCount || 0,
      likes: video.statistics.likeCount || 0,
      commentsCount: video.statistics.commentCount || 0,
    }));

    return res.json({ videos });
  } catch (error) {
    console.error("❌ Error fetching latest videos:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/get_video_details_by_id", authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ valid: false, message: "Invalid token" });
    }

    const startDate = '2025-03-31';
    const endDate = '2025-04-04';

    const { video_id } = req.body;
    console.log("video_id:", video_id, "startDate:", startDate, "endDate:", endDate);

    if (!video_id || !startDate || !endDate) {
      return res.status(400).json({ error: "Video ID, startDate, and endDate are required" });
    }

    // Get user access token
    const userId = req.user.user_id;
    const user = await USER.findById(userId);
    let access_token = user.youtube_access_token;

    // Refresh token if expired
    const currentTime = Date.now();
    const bufferTime = 5 * 60 * 1000; // 5-minute buffer
    if (user.youtube_access_token_expiry instanceof Date && user.youtube_access_token_expiry.getTime() <= currentTime + bufferTime) {
      access_token = await getValidYouTubeAccessToken(user);
    }

    const headers = { Authorization: `Bearer ${access_token}` };

    // 1️⃣ Fetch Video Details
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${video_id}`;
    const detailsResponse = await axios.get(detailsUrl, { headers });

    if (!detailsResponse.data.items.length) {
      return res.status(404).json({ error: "Video not found" });
    }

    const video = detailsResponse.data.items[0];

    const videoDetails = {
      video_id,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnail: video.snippet.thumbnails.high.url,
      publishedAt: video.snippet.publishedAt,
      views: video.statistics.viewCount || 0,
      likes: video.statistics.likeCount || 0,
      commentsCount: video.statistics.commentCount || 0,
      hashtags: video.snippet.tags || [],
    };


    // 2️⃣ Fetch Video Analytics (Average View Duration, Subscribers Gained/Lost, etc.)
    const analyticsUrl = `https://youtubeanalytics.googleapis.com/v2/reports?metrics=views,averageViewDuration,subscribersGained,subscribersLost&filters=video==${video_id}&startDate=${startDate}&endDate=${endDate}&ids=channel==MINE`;
    // const analyticsUrl = `https://youtubeanalytics.googleapis.com/v2/reports?dimensions=country&metrics=averageViewPercentage,averageViewDuration,subscribersGained,subscribersLost&filters=video==${video_id}&startDate=${startDate}&endDate=${endDate}&ids=channel==MINE`;
    // const analyticsUrl = `https://youtubeanalytics.googleapis.com/v2/reports?dimensions=ageGroup,gender&metrics=viewerPercentage&filters=video==${video_id}&startDate=${startDate}&endDate=${endDate}&ids=channel==MINE`;
    
    const analyticsResponse = await axios.get(analyticsUrl, { headers });

    console.log('YOYOOOOOOOO::::::::::', analyticsResponse.data);

    let videoAnalytics = {
      averageViewDuration: 0,
      subscribersGained: 0,
      subscribersLost: 0,
      viewerPercentageByCountry: {},
    };

    if (analyticsResponse.data.rows && analyticsResponse.data.rows.length > 0) {
      analyticsResponse.data.rows.forEach((row) => {
        const [country, avgDuration, subGained, subLost] = row;
        videoAnalytics.subscribersGained += subGained || 0;
        videoAnalytics.subscribersLost += subLost || 0;
        videoAnalytics.averageViewDuration += avgDuration || 0;
      });

      // Calculate average view duration
      videoAnalytics.averageViewDuration = Math.round(videoAnalytics.averageViewDuration / analyticsResponse.data.rows.length);
    }

    console.log('Analytics::::::::', videoAnalytics);

    // 🔥 Combine & Return Response
    return res.json({ ...videoDetails, analytics: videoAnalytics });

  } catch (error) {
    console.error("❌ Error fetching video details & analytics:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});


// 🔹 Batch Translation Function
const batchTranslateToEnglish = async (texts) => {
  try {
    const { Translate } = await import("@google-cloud/translate").then((m) => m.v2);
    const translate = new Translate({ keyFilename: "./creator-console-project-75b3a37ca8d5.json" });

    const [translations] = await translate.translate(texts, "en");
    return translations;  // Returns an array of translated texts
  } catch (error) {
    console.error("Batch Translation Error:", error);
    return texts;  // Return original if translation fails
  }
};

// 🔹 Batch Sentiment Analysis Function
const batchAnalyzeSentiment = async (texts) => {
  try {
    const { LanguageServiceClient } = await import("@google-cloud/language").then((m) => m.v1);
    const client = new LanguageServiceClient({ keyFilename: "./creator-console-project-75b3a37ca8d5.json" });

    // Analyze sentiment for each text separately
    const results = await Promise.all(
      texts.map(async (text) => {
        const [result] = await client.analyzeSentiment({
          document: { content: text, type: "PLAIN_TEXT" },
        });
        return {
          score: result.documentSentiment.score,  // -1 to 1 (Negative to Positive)
          magnitude: result.documentSentiment.magnitude,  // Strength of emotion
        };
      })
    );

    return results;
  } catch (error) {
    console.error("Batch Sentiment Analysis Error:", error);
    return texts.map(() => ({ score: 0, magnitude: 0 }));  // Default neutral sentiment if fails
  }
};


// 🔹 Sentiment Classification
const classifySentiment = (score, magnitude) => {
  if (score > 0.25) return "Positive";
  if (score < -0.25) return "Negative";
  return "Neutral";
};

// Hugging Face API details
const HF_API_URL = "https://router.huggingface.co/hf-inference/models/facebook/bart-large-mnli";
const HF_API_TOKEN = process.env.HF_API_TOKEN;

// Retry Configuration
const MAX_RETRIES = 5;

async function classifyBatch(texts, labels) {
  return await Promise.all(texts.map((text) => classifyText(text, labels)));
}

// Function to classify a single comment
async function classifyText(text, labels) {
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
      try {
          console.log(`Attempt ${attempt + 1}: Classifying text...`);

          const response = await axios.post(
              HF_API_URL,
              {
                  inputs: text,
                  parameters: { candidate_labels: labels },
              },
              {
                  headers: {
                      Authorization: `Bearer ${HF_API_TOKEN}`,
                      "Content-Type": "application/json",
                  },
                  timeout: 10000,
              }
          );

          return response.data;

      } catch (error) {
          attempt++;
          console.error(`Error (Attempt ${attempt}/${MAX_RETRIES}):`, error.message);

          if (attempt >= MAX_RETRIES) {
              throw new Error(`Failed classification after ${MAX_RETRIES} attempts.`);
          }

          // Exponential backoff with jitter
          const backoffTime = Math.pow(2, attempt) * 1000 + Math.random() * 1500;
          console.log(`Retrying after ${backoffTime.toFixed(0)} ms...`);
          await new Promise((resolve) => setTimeout(resolve, backoffTime));
      }
  }
}


const updateOrInsertComments = async (video_id, classifiedComments) => {
  try {
    const video = await VideoComments.findOne({ video_id });

    if (!video) {
      console.log(`Video with ID ${video_id} not found. Skipping update.`);
      return;
    }

    let bulkOperations = [];
    let updatedCategories = new Set(); // Track modified categories for sorting
    let likeCountUpdated = false;

    for (const comment of classifiedComments) {
      const { commentId, classificationLabel, likeCount, updatedAt } = comment;

      if (!classificationLabel) {
        console.log(`Skipping comment ${commentId} due to missing classification label.`);
        continue;
      }

      // Find the current category where the comment exists
      let previousCategory = null;
      let existingComment = null;

      for (const category of [
        "positive",
        "negative",
        "mostLiked",
        "feedback",
        "hate",
        "collaboration",
        "question",
        "offensive"
      ]) {
        existingComment = video[category]?.find((c) => c.commentId === commentId);
        if (existingComment) {
          previousCategory = category;
          break;
        }
      }

      // If only likeCount changed, update it separately and continue
      if (existingComment && existingComment.updatedAt === updatedAt && existingComment.likeCount !== likeCount) {
        bulkOperations.push({
          updateOne: {
            filter: { video_id, [`${previousCategory}.commentId`]: commentId },
            update: { $set: { [`${previousCategory}.$.likeCount`]: likeCount } },
          },
        });
        likeCountUpdated = true;
        continue;
      }

      // If the classification has changed, remove from old category
      if (previousCategory && previousCategory !== classificationLabel) {
        bulkOperations.push({
          updateOne: {
            filter: { video_id },
            update: { $pull: { [previousCategory]: { commentId } } },
          },
        });
        updatedCategories.add(previousCategory);
      }

      // Insert or update the comment in the new category
      bulkOperations.push({
        updateOne: {
          filter: { video_id },
          update: { $addToSet: { [classificationLabel]: comment } }, // Ensures no duplicate
        },
      });
      updatedCategories.add(classificationLabel);
    }

    // Recompute "mostLiked" only if like counts were updated
    if (likeCountUpdated) {
      let allComments = [];
      for (const category of [
        "positive",
        "negative",
        "feedback",
        "hate",
        "collaboration",
        "question",
        "offensive"
      ]) {
        if (video[category]) {
          allComments.push(...video[category]);
        }
      }

      // Find the Top 10 Most Liked Comments
      const topLikedComments = allComments
        .filter((c) => c.likeCount > 0)
        .sort((a, b) => b.likeCount - a.likeCount)
        .slice(0, 10);

      bulkOperations.push({
        updateOne: {
          filter: { video_id },
          update: { $set: { mostLiked: topLikedComments } },
        },
      });
      updatedCategories.add("mostLiked");
    }

    // Execute bulk update
    if (bulkOperations.length > 0) {
      await VideoComments.bulkWrite(bulkOperations);
      console.log("Video comments updated successfully!");

      // Sort the updated categories
      let sortOperations = [];
      updatedCategories.forEach((category) => {
        sortOperations.push({
          updateOne: {
            filter: { video_id },
            update: {
              $push: {
                [category]: {
                  $each: [],
                  $sort: category === "mostLiked" ? { likeCount: -1 } : { sentimentScore: -1, sentimentMagnitude: -1 },
                },
              },
            },
          },
        });
      });

      if (sortOperations.length > 0) {
        await VideoComments.bulkWrite(sortOperations);
        console.log("Sorted updated comment categories.");
      }
    } else {
      console.log("No updates needed.");
    }
  } catch (error) {
    console.error("Error updating comments:", error);
  }
};

router.post("/get_more_20_comments_details", authenticateToken, async (req, res) => { 
  try {
    if (!req.user) {
      return res.status(401).json({ valid: false, message: "Invalid token" });
    }

    const { video_id, category, page } = req.body;
    const pageSize = 1; // Number of comments per request
    const skip = (page - 1) * pageSize;

    // Find the video comments
    const existingVideo = await VideoComments.findOne({ video_id });

    if (!existingVideo || !existingVideo[category]) {
      return res.status(404).json({ message: "No comments found for this category." });
    }

    // Get the next set of comments
    const comments = existingVideo[category].slice(skip, skip + pageSize);

    // Check if there are more comments left
    const hasMore = existingVideo[category].length > skip + pageSize;

    res.json({
      [category]: comments,
      [`${category}_hasMore`]: hasMore
    });

  } catch (error) {
    console.error("Error fetching more comments:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});


const fetchReplies = async (parentId, access_token, username) => {
  let nextPageToken = "";

  do {
      const replyResponse = await axios.get(
          `https://www.googleapis.com/youtube/v3/comments?part=snippet&parentId=${parentId}&maxResults=100&pageToken=${nextPageToken}`,
          { headers: { Authorization: `Bearer ${access_token}` } }
      );

      const replies = replyResponse.data.items || [];

      // Check if our reply exists in this batch
      const myReply = replies.find(reply => reply.snippet.authorDisplayName === username);

      if (myReply) {
          return myReply; // Stop fetching further pages
      }

      nextPageToken = replyResponse.data.nextPageToken || "";
  } while (nextPageToken);

  return null; // No reply found
};


router.post("/get_video_comments_details", authenticateToken, async (req, res) => { 
    try {
        if (!req.user) {
            return res.status(401).json({ valid: false, message: "Invalid token" });
        }

        const { video_id } = req.body;
        const userId = req.user.user_id;
        const user = await USER.findById(userId);
        let access_token = user.youtube_access_token;
        const myUsername = user.youtube_channel_username;

        // Refresh token if expired
        const currentTime = Date.now();
        const bufferTime = 5 * 60 * 1000; // 5-minute buffer
        if (user.youtube_access_token_expiry instanceof Date && user.youtube_access_token_expiry.getTime() <= currentTime + bufferTime) {
            access_token = await getValidYouTubeAccessToken(user);
        }

        const existingVideo = await VideoComments.findOne({ video_id });

        const videoResponse = await axios.get(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${video_id}&key=${YOUTUBE_API_KEY}`
      );

     if (existingVideo) {
    console.log(':::::::::::::Video Exists:::::::::::::::::');


    if (!videoResponse.data.items.length) {
        return res.status(404).json({ error: "Video not found" });
    }

    let existingCommentsMap = new Map();
    let categories = ["positive", "negative", "mostLiked", "collaboration", "question", "feedback", "offensive", "hate"];

    // Map all existing comments in MongoDB
    for (const category of categories) {
        for (const comment of existingVideo[category] || []) {
            existingCommentsMap.set(comment.commentId, { category, comment });
        }
    }

    let nextPageToken = "";
    let commentsToAnalyze = [];
    let fetchedCommentIds = new Set(); // Track fetched comments

    do {
        const commentsResponse = await axios.get(
            `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${video_id}&maxResults=100&pageToken=${nextPageToken}`,
            { headers: { Authorization: `Bearer ${access_token}` } }
        );

        const commentItems = commentsResponse.data.items || [];

        const formattedComments = await Promise.all(commentItems.map(async (c) => {
            const topLevelCommentId = c.snippet.topLevelComment.id;
            const topLevelComment = c.snippet.topLevelComment.snippet;
            const topLevelCommentUpdatedAt = topLevelComment.updatedAt;
            const topLevelCommentLikeCount = topLevelComment.likeCount || 0;
            const replyCount = c.snippet.totalReplyCount || 0;

            fetchedCommentIds.add(topLevelCommentId); // Add to fetched list

            let existingCommentData = existingCommentsMap.get(topLevelCommentId);
            let needsProcessing = false;
            let myReplyUpdatedAt = null;
            let myReplyLikeCount = 0;
            let myReply;

            // Fetch replies if available
            if (replyCount > 0) {
              myReply = await fetchReplies(topLevelCommentId, access_token, myUsername);
          
              if (myReply) {
                  myReplyUpdatedAt = myReply.snippet.updatedAt;
                  myReplyLikeCount = myReply.snippet.likeCount || 0;
          
                  for (const category of categories) {
                      if (!existingVideo[category]) continue;
          
                      const existingComment = existingVideo[category].find(comment => comment.commentId === topLevelCommentId);
                      if (!existingComment) continue;
          
                      const replyIndex = existingComment.replies?.findIndex(reply => reply.replyId === myReply.id);
          
                      if (replyIndex !== -1) {
                          const existingReply = existingComment.replies[replyIndex];
          
                          // ✅ Only update if reply content has changed
                          if (
                              existingReply.textDisplay !== myReply.snippet.textDisplay ||
                              existingReply.updatedAt !== myReplyUpdatedAt ||
                              existingReply.likeCount !== myReplyLikeCount
                          ) {
                              console.log(`Reply updated in category: ${category}, updating MongoDB...`);
                              needsProcessing = true;
          
                              const updateQuery = {
                                  $set: {
                                      [`${category}.$[comment].replies.${replyIndex}`]: {
                                          replyId: myReply.id,
                                          textDisplay: myReply.snippet.textDisplay,
                                          updatedAt: myReplyUpdatedAt,
                                          likeCount: myReplyLikeCount,
                                          authorDisplayName: myReply.snippet.authorDisplayName,
                                          authorProfileImageUrl: myReply.snippet.authorProfileImageUrl,
                                          authorChannelUrl: myReply.snippet.authorChannelUrl,
                                          publishedAt: myReply.snippet.publishedAt,
                                      }
                                  }
                              };
          
                              await VideoComments.updateOne(
                                  { video_id, [`${category}.commentId`]: topLevelCommentId },
                                  updateQuery,
                                  { arrayFilters: [{ "comment.commentId": topLevelCommentId }] }
                              );
                          }
                      } else {
                          console.log(`Adding new reply to category: ${category}`);
          
                          await VideoComments.updateOne(
                              { video_id, [`${category}.commentId`]: topLevelCommentId },
                              {
                                  $push: {
                                      [`${category}.$.replies`]: {
                                          replyId: myReply.id,
                                          textDisplay: myReply.snippet.textDisplay,
                                          updatedAt: myReplyUpdatedAt,
                                          likeCount: myReplyLikeCount,
                                          authorDisplayName: myReply.snippet.authorDisplayName,
                                          authorProfileImageUrl: myReply.snippet.authorProfileImageUrl,
                                          authorChannelUrl: myReply.snippet.authorChannelUrl,
                                          publishedAt: myReply.snippet.publishedAt,
                                      }
                                  },
                                  $inc: { [`${category}.$.replyCount`]: 1 },
                                  $set: { [`${category}.$.replied`]: true }
                              }
                          );
                      }
                  }
              } else {
                  // Reply was deleted
                  for (const category of categories) {
                      if (!existingVideo[category]) continue;
          
                      const existingComment = existingVideo[category].find(comment => comment.commentId === topLevelCommentId);
                      if (!existingComment || !existingComment.replies || existingComment.replies.length === 0) continue;
          
                      console.log(`🗑️ Deleting reply for comment: ${topLevelCommentId} from category: ${category}`);
          
                      await VideoComments.updateOne(
                          { video_id, [`${category}.commentId`]: topLevelCommentId },
                          {
                              $pull: { [`${category}.$.replies`]: { replyId: existingComment.replies[0].replyId } },
                              $inc: { [`${category}.$.replyCount`]: -1 },
                              $set: { [`${category}.$.replied`]: false }
                          }
                      );
                  }
              }
          }
          
            // If comment doesn't exist, mark for processing
            if (!existingCommentData) {
                needsProcessing = true;
                return {
                    commentId: topLevelCommentId,
                    originalCommentText: topLevelComment.textDisplay,
                    displayName: topLevelComment.authorDisplayName,
                    displayImage: topLevelComment.authorProfileImageUrl,
                    authorChannelUrl: topLevelComment.authorChannelUrl || "",
                    publishedAt: new Date(topLevelComment.publishedAt),
                    updatedAt: topLevelCommentUpdatedAt,
                    likeCount: topLevelCommentLikeCount,
                    replyCount,
                    needsProcessing
                };
            } else if (existingCommentData.comment.updatedAt !== topLevelCommentUpdatedAt) {
                needsProcessing = true;
                return {
                    commentId: topLevelCommentId,
                    originalCommentText: topLevelComment.textDisplay,
                    displayName: topLevelComment.authorDisplayName,
                    displayImage: topLevelComment.authorProfileImageUrl,
                    authorChannelUrl: topLevelComment.authorChannelUrl || "",
                    publishedAt: new Date(topLevelComment.publishedAt),
                    updatedAt: topLevelCommentUpdatedAt,
                    likeCount: topLevelCommentLikeCount,
                    replyCount,
                    needsProcessing
                };
            } else if (existingCommentData.comment.likeCount !== topLevelCommentLikeCount) {
                return {
                    commentId: topLevelCommentId,
                    likeCount: topLevelCommentLikeCount,
                    needsProcessing: false
                };
            }

            return null;
        }));

        commentsToAnalyze.push(...formattedComments.filter(comment => comment));
        nextPageToken = commentsResponse.data.nextPageToken || "";
    } while (nextPageToken);

    // Identify comments that need full processing
    const commentsNeedingFullProcessing = commentsToAnalyze.filter(c => c.needsProcessing);
    const commentsWithLikeChangesOnly = commentsToAnalyze.filter(c => !c.needsProcessing);

    // Batch update likes
    if (commentsWithLikeChangesOnly.length > 0) {
        const bulkOps = [];

        for (const comment of commentsWithLikeChangesOnly) {
            for (const category of categories) {
                bulkOps.push({
                    updateOne: {
                        filter: { video_id, [`${category}.commentId`]: comment.commentId },
                        update: { $set: { [`${category}.$.likeCount`]: comment.likeCount } }
                    }
                });
            }
        }

        if (bulkOps.length > 0) {
            await VideoComments.bulkWrite(bulkOps, { ordered: false });
        }
    }

    for (const category of categories) {
      if (!existingVideo[category]) continue;

      for (const comment of existingVideo[category]) {
          if (!fetchedCommentIds.has(comment.commentId)) {
              console.log(`🗑️ Deleting removed comment: ${comment.commentId} from category: ${category}`);
              await VideoComments.updateOne(
                  { video_id },
                  { $pull: { [category]: { commentId: comment.commentId } } }
              );
          }
      }
  }

    // Process new/updated comments
    if (commentsNeedingFullProcessing.length > 0) {
        const translatedComments = await batchTranslateToEnglish(commentsNeedingFullProcessing.map(c => c.originalCommentText));
        const sentimentResults = await batchAnalyzeSentiment(translatedComments);
        const classificationLabels = ["collaboration", "hate", "abusive", "question", "feedback", "offensive"];
        const classificationResults = await classifyBatch(translatedComments, classificationLabels);

        const formattedProcessedComments = commentsNeedingFullProcessing.map((c, index) => ({
            commentId: c.commentId,
            commentText: translatedComments[index],
            originalCommentText: c.originalCommentText,
            displayName: c.displayName,
            displayImage: c.displayImage,
            authorChannelUrl: c.authorChannelUrl || "",
            publishedAt: new Date(c.publishedAt),
            updatedAt: c.updatedAt,
            likeCount: c.likeCount || 0,
            replyCount: c.replyCount || 0,
            sentimentScore: sentimentResults[index].score,
            sentimentMagnitude: sentimentResults[index].magnitude,
            sentimentCategory: classifySentiment(sentimentResults[index].score, sentimentResults[index].magnitude),
            classificationLabel: classificationResults[index].labels[0],
            classificationScore: classificationResults[index].scores[0]
        }));

        await updateOrInsertComments(video_id, formattedProcessedComments);
    }

            const commentsDataFromDB = await VideoComments.findOne(
              { video_id },
              { positive: 1, negative: 1, mostLiked: 1, feedback: 1, hate: 1, collaboration: 1, question: 1, offensive: 1, firstComment: 1 }
          );

          const processCategory = (category) => ({
              [category]: commentsDataFromDB[category]?.slice(0, 20) || [],
              [`${category}_hasMore`]: (commentsDataFromDB[category]?.length || 0) > 20
          });

          const finalResponse = {
              ...processCategory("positive"),
              ...processCategory("negative"),
              ...processCategory("mostLiked"),
              ...processCategory("feedback"),
              ...processCategory("hate"),
              ...processCategory("collaboration"),
              ...processCategory("question"),
              ...processCategory("offensive"),
              firstComment: commentsDataFromDB.firstComment || null
          };

          res.json(finalResponse);
}

      


 
      else {
     
     
        if (!videoResponse.data.items.length) {
            return res.status(404).json({ error: "Video not found" });
        }
    
        const videoData = videoResponse.data.items[0];
    
        // Initialize videoDetails object
        const videoDetails = {
            video_id,
            userId,
            title: videoData.snippet.title,
            thumbnail: videoData.snippet.thumbnails.default.url,
            commentsCount: videoData.statistics.commentCount || 0,
            positive: [],
            negative: [],
            mostLiked: [],
            firstComment: [],
            hate: [],
            collaboration: [],
            question: [],
            feedback: [],
            offensive: []
        };
    
        let allComments = [];
        let nextPageToken = "";
    
        do {
            const commentsResponse = await axios.get(
                `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&videoId=${video_id}&maxResults=100&pageToken=${nextPageToken}`,
                {
                    headers: { Authorization: `Bearer ${access_token}` },
                }
            );
    
            const commentItems = commentsResponse.data.items || [];

            console.log('commentItems:::::::::', commentItems[8].replies);
    
            if (commentItems.length !== 0) {
                // Extract top-level comments
                const topLevelComments = commentItems.map((c) => c.snippet.topLevelComment.snippet.textDisplay);
    
                // 🔹 Step 1: Batch Translate all comments
                const translatedComments = await batchTranslateToEnglish(topLevelComments);
    
                // 🔹 Step 2: Batch Sentiment Analysis
                const sentimentResults = await batchAnalyzeSentiment(translatedComments);
    
                // 🔹 Step 3: Batch Classify Comments
                const classificationLabels = ["collaboration", "hate", "abusive", "question", "feedback", "offensive"];
                const classificationResults = await classifyBatch(translatedComments, classificationLabels);
    
                // 🔹 Step 4: Format the comments with results
                const formattedComments = await Promise.all(commentItems.map(async (c, index) => {
                    const topLevelComment = c.snippet.topLevelComment.snippet;
                    const topLevelCommentId = c.snippet.topLevelComment.id;
                    const classification = classificationResults[index];
    
                    // Fetch all replies (handling pagination)
                    let replied = false;
                    let replies = [];
                    if (c.replies) {

                            const replyResponse = await axios.get(
                              `https://www.googleapis.com/youtube/v3/comments?part=snippet&parentId=${topLevelCommentId}&maxResults=100`,
                              { headers: { Authorization: `Bearer ${access_token}` } }
                          );


                          const replyItems = replyResponse.data.items;
                        
    
                        // Extract only replies from "audioreel_io"
                        replies = replyItems
                                  .filter((reply) => reply.snippet.authorDisplayName === myUsername)
                                  .map((reply) => ({
                                      replyId: reply.id,  // Fix: Use reply.id directly
                                      textDisplay: reply.snippet.textDisplay,
                                      authorDisplayName: reply.snippet.authorDisplayName,
                                      authorProfileImageUrl: reply.snippet.authorProfileImageUrl,
                                      publishedAt: reply.snippet.publishedAt,
                                      updatedAt: reply.snippet.updatedAt,
                                      likeCount: reply.snippet.likeCount || 0,
                                  }));

    
                        if (replies.length > 0) {
                            replied = true;
                        }

                    }
    
                    return {
                        commentId: topLevelCommentId,
                        commentText: translatedComments[index],
                        originalCommentText: topLevelComment.textDisplay,
                        displayName: topLevelComment.authorDisplayName,
                        displayImage: topLevelComment.authorProfileImageUrl,
                        authorChannelUrl: topLevelComment?.authorChannelUrl || "",
                        publishedAt: new Date(topLevelComment.publishedAt),
                        updatedAt: topLevelComment.updatedAt,
                        likeCount: topLevelComment.likeCount || 0,
                        replyCount: c.snippet.totalReplyCount || 0,
                        replies, // Include filtered replies
                        replied, // Mark if user replied
                        sentimentScore: sentimentResults[index].score,
                        sentimentMagnitude: sentimentResults[index].magnitude,
                        sentimentCategory: classifySentiment(sentimentResults[index].score, sentimentResults[index].magnitude),
                        classificationLabel: classification.labels[0],
                        classificationScore: classification.scores[0],
                    };
                }));
    
                allComments.push(...formattedComments);
            }
            nextPageToken = commentsResponse.data.nextPageToken || "";
        } while (nextPageToken);
    
        // 🔹 Step 5: Categorize Comments
        let oldestComment = null;
    
        if (allComments.length !== 0) {
            allComments.forEach((comment) => {
                const { sentimentScore, likeCount, publishedAt, classificationLabel, classificationScore } = comment;
    
                // Check if classification is strong (>0.5 confidence)
                if (classificationScore > 0.5) {
                    if (["hate", "abusive", "hate speech"].includes(classificationLabel)) {
                        videoDetails.hate.push(comment);
                        return;
                    }
                    if (classificationLabel === "collaboration") {
                        videoDetails.collaboration.push(comment);
                        return;
                    }
                    if (classificationLabel === "question") {
                        videoDetails.question.push(comment);
                        return;
                    }
                    if (classificationLabel === "feedback") {
                        videoDetails.feedback.push(comment);
                        return;
                    }
                    if (classificationLabel === "offensive") {
                        videoDetails.offensive.push(comment);
                        return;
                    }
                }
    
                // Sentiment-based categorization
                if (sentimentScore > 0) {
                    videoDetails.positive.push(comment);
                } else {
                    videoDetails.negative.push(comment);
                }
    
                // 🔹 Step 1: Collect all comments with likes
                const likedComments = allComments.filter((comment) => comment.likeCount > 0);
    
                // 🔹 Step 2: Sort by likeCount in descending order
                likedComments.sort((a, b) => b.likeCount - a.likeCount);
    
                // 🔹 Step 3: Store only the Top 10 Most Liked Comments
                videoDetails.mostLiked = likedComments.slice(0, 10);
    
                // Track the oldest comment for "First Comment"
                if (!oldestComment || publishedAt < oldestComment.publishedAt) {
                    oldestComment = comment;
                }
            });
    
            // 🔹 Step 6: Sort Categories
            videoDetails.positive.sort((a, b) => (b.sentimentScore + b.likeCount) - (a.sentimentScore + a.likeCount));
            videoDetails.negative.sort((a, b) => b.sentimentScore - a.sentimentScore);
            videoDetails.mostLiked.sort((a, b) => b.likeCount - a.likeCount);
    
            // Only store the absolute first comment
            if (oldestComment) {
                videoDetails.firstComment.push(oldestComment);
            }
    
            // 🔹 Step 7: Save All Comments to MongoDB Before Limiting
            const saveCommentscloudFunctionUrl = "https://savecommentstodb-1065806162563.us-central1.run.app";
    
            const payload = { videoDetails };
    
            fetch(saveCommentscloudFunctionUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            })
            .then(response => {
                if (!response.ok) {
                    console.error("Failed to save comments to Cloud Run:", response.statusText);
                } else {
                    console.log("Comments successfully sent to Cloud Run.");
                }
            })
            .catch(error => console.error("Error calling Cloud Run function:", error));
    
            // 🔹 Step 8: Limit to 20 Comments Per Category
            Object.keys(videoDetails).forEach((key) => {
                if (Array.isArray(videoDetails[key]) && key !== "firstComment") { 
                    videoDetails[key] = videoDetails[key].slice(0, 20);
                }
            });
    
            res.json(videoDetails);
        }
    
        if (allComments.length === 0) {
            res.json([]);
        }
    }
    
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error", details: error.message });
    }
});


const fetchVideoComments = async (videoId, accessToken) => {

    try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/commentThreads', {
            params: {
                part: 'snippet',
                videoId: videoId,
                maxResults: 50, // Adjust if needed
                access_token: accessToken
            }
        });

        const comments = response.data.items.map(item => {
            const commentSnippet = item.snippet.topLevelComment.snippet;
            return {
                commentId: item.snippet.topLevelComment.id,
                author: commentSnippet?.authorDisplayName ?? 'null',
                authorProfileImage: commentSnippet?.authorProfileImageUrl ?? 'null',
                commentText: commentSnippet?.textDisplay ?? 'null',
                publishedAt: commentSnippet?.publishedAt ?? 'null',
                likeCount: commentSnippet?.likeCount ?? 0,
                totalReplyCount: item.snippet.totalReplyCount
            };
        });

        const realtimeResponse = await axios.get("https://www.googleapis.com/youtube/v3/videos", {
          params: {
            part: "snippet,statistics,contentDetails",
            id: videoId,
            key: YOUTUBE_API_KEY,
          },
        });
    
        // console.log('Video Snippet : ', realtimeResponse.data.items[0].snippet);
        // console.log('Video Statistics : ', realtimeResponse.data.items[0].statistics);
        // console.log('Video Details : ', realtimeResponse.data.items[0]);
        const duration = realtimeResponse.data.items[0].contentDetails.duration;
        const totalSeconds = parseDuration(duration);
        const isShort = totalSeconds <= 60;
        // console.log('isShort: ', isShort);

        const videos = realtimeResponse.data.items.map((video) => ({
          videoId: video.id,
          title: video.snippet.title,
          description: video.snippet.description,
          thumbnail: video.snippet.thumbnails.high.url,
          views: video.statistics.viewCount || 0,
          likes: video.statistics.likeCount || 0,
          comments: video.statistics.commentCount || 0,
          shortVideo: isShort
        }));

        return { comments, videos };

    } catch (error) {
        // If comments are disabled or video has no comments, it will throw an error — handle gracefully
        if (error.response) {
            console.log(`Comments disabled or unavailable for video ${videoId}`);
            console.log(`Error ${error}`);
            return []; // Return empty array if no comments available
        }

        console.error(`Failed to fetch comments for video ${videoId}:`, error.response?.data || error.message);
        return [];
    }
};



router.post("/change-password", authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const { password, newPassword } = req.body;
    if (!password || !newPassword) {
      return res.status(400).json({ success: false, message: "Both passwords are required" });
    }

    const userId = req.user.user_id;
    const user = await USER.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if old password is correct
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Wrong current password" });
    }

    // Hash the new password
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    await USER.findByIdAndUpdate(userId, { password: hashedPassword });

    res.status(200).json({ success: true, message: "Password updated successfully" });

  } catch (error) {
    console.error("Password update error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

router.post("/unlink-youtube-channel", authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const { unlinkYouTubeChannel } = req.body;
    const userId = req.user.user_id;

    if (!unlinkYouTubeChannel) {
      return res.status(400).json({ success: false, message: "Invalid request" });
    }

    const user = await USER.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update only if needed
    if (user.youtube_channel_linked) {
      await USER.findByIdAndUpdate(userId, { youtube_channel_linked: false });
      return res.status(200).json({ success: true, message: "Unlinked successfully" });
    }

    res.status(400).json({ success: false, message: "YouTube channel already unlinked" });

  } catch (error) {
    console.error("Unlink channel error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});



router.post("/signup-brand", async (req, res, next) => {

  try {

    const { email, password } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 10);
    const lowerCaseEmail = email.toLowerCase();
    const pin = generatePin();

    if (!email || !password ) {
      return res.status(400).send({
         error: "All fields are mandatory",
         data: null,
         message: "Please provide all fields",
       });
     }


    const options = {
      to: email,
      subject: "Verify Account - Creator Console",
      text: `Your 6-digit PIN: ${pin}`,
  }


    const existingUser = await USER.findOne({ email: lowerCaseEmail });
    const existingUserInTemp = await USER_TEMP.findOne({ email : lowerCaseEmail});


    if (existingUser) {
      return res.status(400).send({
        error: "User already exists",
        data: null,
        message: "User already exists with the same email address. Please login to continue.",
      });
    }

    else if(existingUserInTemp){

      existingUserInTemp.password = hashedPassword;
      existingUserInTemp.reset_pin = pin;
      existingUserInTemp.save();
      await sendMail(options);
     return res.status(200).send({ success: true });

    }

    else{

    await USER_TEMP.create({
      email: lowerCaseEmail,
      password: hashedPassword,
      reset_pin : pin
    });
    await sendMail(options);

    return res.status(200).send({ success: true });
  }
  } catch (error) {
    // return next(new ErrorHandler(error.message, 500));
  }
});



router.post("/brand-login", async (req, res, next) => {

  try {
    const { email, password } = req.body;

    if (!email || !password) {
     return res.status(400).send({
        error: "All fields are mandatory",
        data: null,
        message: "Please provide all fields",
      });
    }

    const user = await USER.findOne({ email }).select("+hashPassword");

    if (!user) {
      return res.status(400).send({
        error: "User does not exists!",
        data: null,
        message: "User does not exists!",
      });
    }

    const token = await generateJWTtoken(user._id, user.email);


    bcrypt.compare(password, user.password, function async (err1, result) {
      if (result === true) {


      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "Strict", 
      });
  
      return res.status(200).json({
        success: true,
        user: {
          user_id: user._id,
          user_email: user.email,
          channel_connected : user.youtube_channel_linked,
        },
        token,
      });


      } else {
        return res.status(400).send({
          error: "email, password mismatch",
          data: null,
          message: "Wrong Email or Password",
        });
      }

    });
  } catch (error) {
    return res.status(500).send({
      error: "Internal server error",
      data: null,
      message: "An error occurred",
    });
  }
});

router.post("/check-resetPin-withDb-brandTemps", async function (req, res) {

  const { email, pin } = req.body;
  const lowerCaseEmail = email.toLowerCase();
  const pinAsInt = parseInt(pin);
  
  USER_TEMP.findOne({ email : lowerCaseEmail}).then(async (result)=>{

    if(result.reset_pin === pinAsInt){

      await USER.create({
        email: lowerCaseEmail,
        password: result.password,
        reset_pin : pin,
      });

      await USER_TEMP.deleteOne({ email: lowerCaseEmail  });


  res.status(200).send({ matching: true, email: email});
  res.end();

    }

    else{

      res.status(200).send({ matching: false});
      res.end();

    }

  }).catch((err) =>{

    return res.status(502).send({
      error: "Internal Server Error",
      data: null,
      message: "Internal Server Error",
    });

  })

});


router.post("/check-resetPin-withDb", async function (req, res) {

  const { email, pin } = req.body;
  const pinAsInt = parseInt(pin);
  
  USER.findOne({ email : email}).then(async (result)=>{

    if(result.reset_pin === pinAsInt){

  res.status(200).send({ matching: true, email: email});
  res.end();

    }

    else{

      res.status(200).send({ matching: false});
      res.end();

    }

  }).catch((err) =>{

  })

});

router.post("/check-deleteCode-withDb", authenticateToken, async function (req, res) {


  const userId = req.user?.user_id; //user_id from authenticated token

  if (!userId) {
    return res.status(400).json({ message: "Username is invalid." });
  }

  const { pin } = req.body;
  const pinAsInt = parseInt(pin);
  
  USER.findById(userId).then(async (result)=>{

    if (result.account_delete_code === pinAsInt) {
      await USER.findByIdAndDelete(userId);
      return res.status(200).json({ matching: true, deleted: true, message: "Account successfully deleted." });
    } else {
      return res.status(200).json({ matching: false, deleted: false, message: "Incorrect PIN." });
    }

  }).catch((err) =>{

  })

});


router.post("/post-reply-to-a-comment", authenticateToken, async function (req, res) {
  const userId = req.user?.user_id;

  if (!userId) {
    return res.status(400).json({ message: "User is invalid." });
  }

  const { selectedCommentId, replyText, selectedVideo } = req.body;
const video_id = selectedVideo.video_id;
  if (!selectedCommentId || !replyText || !video_id) {
    return res.status(400).json({ message: "Missing comment ID, reply text, or video ID." });
  }

  try {
    // 🔐 Fetch user + token
    const user = await USER.findById(userId);
    let access_token_for = user.youtube_access_token;

    const { youtube_access_token_expiry } = user;
    const currentTime = Date.now();
    const bufferTime = 5 * 60 * 1000;

    const isTokenExpiring = youtube_access_token_expiry instanceof Date &&
      youtube_access_token_expiry.getTime() <= currentTime + bufferTime;

    if (isTokenExpiring) {
      access_token_for = await getValidYouTubeAccessToken(user);
    }

    if (!access_token_for) {
      return res.status(403).json({ message: "Access token not found. Please reconnect your YouTube account." });
    }

    // 📡 YouTube API request
    const requestUrl = `https://www.googleapis.com/youtube/v3/comments?part=snippet`;
    const payload = {
      snippet: {
        parentId: selectedCommentId,
        textOriginal: replyText
      }
    };

    const youtubeResponse = await axios.post(requestUrl, payload, {
      headers: {
        Authorization: `Bearer ${access_token_for}`,
        "Content-Type": "application/json"
      }
    });

    const replyData = youtubeResponse.data;
    console.log("✅ YouTube API replied:", replyData);

    // 🧠 Extract and construct reply object for DB
    const replyObj = {
      replyId: replyData.id,
      textDisplay: replyData.snippet.textOriginal,
      authorDisplayName: replyData.snippet.authorDisplayName,
      authorProfileImageUrl: replyData.snippet.authorProfileImageUrl,
      authorChannelId: replyData.snippet.authorChannelId?.value,
      likeCount: replyData.snippet.likeCount,
      publishedAt: replyData.snippet.publishedAt,
      updatedAt: replyData.snippet.updatedAt
    };

    // 🧩 Detect which category contains this comment
    const categories = [
      "positive",
      "negative",
      "mostLiked",
      "hate",
      "collaboration",
      "question",
      "feedback",
      "firstComment"
    ];
    
    let updated = false;
    
    for (const category of categories) {
      let result;
    
      if (category === "firstComment") {
        result = await VideoComments.updateOne(
          { video_id: video_id, [`${category}.commentId`]: selectedCommentId },
          {
            $push: { [`${category}.replies`]: replyObj },
            $set: {
              [`${category}.replied`]: true
            },
            $inc: { [`${category}.replyCount`]: 1 }
          }
        );
      } else {
        result = await VideoComments.updateOne(
          { video_id: video_id, [`${category}.commentId`]: selectedCommentId },
          {
            $push: { [`${category}.$.replies`]: replyObj },
            $set: { [`${category}.$.replied`]: true },
            $inc: { [`${category}.$.replyCount`]: 1 }
          }
        );
      }
    
      if (result.modifiedCount > 0) {
        updated = true;
        break;
      }
    }
    

    if (!updated) {
      console.warn("⚠️ Comment ID not found in any category for update.");
    }

    return res.status(200).json({
      message: "Reply posted and saved successfully.",
      repliedSuccess: true
    });
  } catch (err) {
    console.error("❌ Error posting reply:", err?.response?.data || err.message);
    return res.status(500).json({
      message: "Failed to post reply.",
      error: err?.response?.data || err.message
    });
  }
});

router.post("/update-a-reply", authenticateToken, async function (req, res) {
  const userId = req.user?.user_id;

  if (!userId) {
    return res.status(400).json({ message: "User is invalid." });
  }

  const { selectedCommentId, selectedReplyId, editedReplyText, selectedVideo } = req.body;
  const video_id = selectedVideo.video_id;

  if (!selectedCommentId || !selectedReplyId || !editedReplyText || !video_id) {
    return res.status(400).json({ message: "Missing comment ID, reply ID, updated text, or video ID." });
  }

  try {
    // 🔐 Fetch user + token
    const user = await USER.findById(userId);
    let access_token_for = user.youtube_access_token;

    const { youtube_access_token_expiry } = user;
    const currentTime = Date.now();
    const bufferTime = 5 * 60 * 1000;

    const isTokenExpiring =
      youtube_access_token_expiry instanceof Date &&
      youtube_access_token_expiry.getTime() <= currentTime + bufferTime;

    if (isTokenExpiring) {
      access_token_for = await getValidYouTubeAccessToken(user);
    }

    if (!access_token_for) {
      return res.status(403).json({ message: "Access token not found. Please reconnect your YouTube account." });
    }

    // 📡 YouTube API request
    const updateUrl = `https://www.googleapis.com/youtube/v3/comments?part=snippet`;
    const payload = {
      id: selectedReplyId,
      snippet: {
        textOriginal: editedReplyText
      }
    };

    const youtubeResponse = await axios.put(updateUrl, payload, {
      headers: {
        Authorization: `Bearer ${access_token_for}`,
        "Content-Type": "application/json"
      }
    });

    const updatedReply = youtubeResponse.data;

    console.log('updatedReply:::::::::: ', updatedReply);

    // 🧩 Build new reply object
    const newReplyObject = {
      replyId: updatedReply.id,
      textDisplay: updatedReply.snippet.textDisplay,
      textOriginal: updatedReply.snippet.textOriginal,
      authorDisplayName: updatedReply.snippet.authorDisplayName,
      authorProfileImageUrl: updatedReply.snippet.authorProfileImageUrl,
      authorChannelId: updatedReply.snippet.authorChannelId?.value,
      likeCount: updatedReply.snippet.likeCount,
      publishedAt: updatedReply.snippet.publishedAt,
      updatedAt: updatedReply.snippet.updatedAt
    };

    const categories = [
      "positive",
      "negative",
      "mostLiked",
      "hate",
      "collaboration",
      "question",
      "feedback",
      "firstComment"
    ];

    let updated = false;

    for (const category of categories) {
      let result;

      if (category === "firstComment") {
        result = await VideoComments.updateOne(
          {
            video_id: video_id,
            [`${category}.commentId`]: selectedCommentId,
            [`${category}.replies.replyId`]: selectedReplyId
          },
          {
            $set: {
              [`${category}.replies.$`]: newReplyObject
            }
          },
          { strict: false } // ✅ Allow nested dynamic path
        );
      } else {
        result = await VideoComments.updateOne(
          {
            video_id: video_id,
            [`${category}.commentId`]: selectedCommentId,
            [`${category}.replies.replyId`]: selectedReplyId
          },
          {
            $set: {
              [`${category}.$[outer].replies.$[inner]`]: newReplyObject
            }
          },
          {
            arrayFilters: [
              { "outer.commentId": selectedCommentId },
              { "inner.replyId": selectedReplyId }
            ],
            strict: false // ✅ Allow nested dynamic path
          }
        );
      }

      if (result.modifiedCount > 0) {
        updated = true;
        break;
      }
    }

    if (!updated) {
      console.warn("⚠️ Reply ID not found in any category for update.");
    }

    return res.status(200).json({
      message: "Reply updated successfully.",
      updatedSuccess: true
    });
  } catch (err) {
    console.error("❌ Error updating reply:", err?.response?.data || err.message);
    return res.status(500).json({
      message: "Failed to update reply.",
      error: err?.response?.data || err.message
    });
  }
});


router.post("/delete-a-comment", authenticateToken, async function (req, res) {
  const userId = req.user?.user_id;

  if (!userId) {
    return res.status(400).json({ message: "User is invalid." });
  }

  const { selectedCommentId, selectedVideo } = req.body;
  const video_id = selectedVideo.video_id;

  console.log('selectedCommentId: ', selectedCommentId);
  console.log('video_id: ', video_id);

  if (!selectedCommentId || !video_id) {
    return res.status(400).json({ message: "Missing comment ID or video ID." });
  }

  try {
    // 🔐 Get user's access token
    const user = await USER.findById(userId);
    let access_token_for = user.youtube_access_token;

    const { youtube_access_token_expiry } = user;
    const currentTime = Date.now();
    const bufferTime = 5 * 60 * 1000;

    const isTokenExpiring =
      youtube_access_token_expiry instanceof Date &&
      youtube_access_token_expiry.getTime() <= currentTime + bufferTime;

    if (isTokenExpiring) {
      access_token_for = await getValidYouTubeAccessToken(user);
    }

    if (!access_token_for) {
      return res.status(403).json({ message: "Access token not found. Please reconnect your YouTube account." });
    }

    // 📡 Delete from YouTube
    const deleteUrl = `https://www.googleapis.com/youtube/v3/comments?id=${selectedCommentId}`;
    await axios.delete(deleteUrl, {
      headers: {
        Authorization: `Bearer ${access_token_for}`,
      },
    });

    // 🧩 Remove from MongoDB
    const categories = [
      "positive",
      "negative",
      "mostLiked",
      "hate",
      "collaboration",
      "question",
      "feedback",
      "firstComment"
    ];

    let deleted = false;

    for (const category of categories) {
      let result;

      if (category === "firstComment") {
        result = await VideoComments.updateOne(
          { video_id: video_id, [`${category}.commentId`]: selectedCommentId },
          { $unset: { [category]: "" } }
        );
      } else {
        result = await VideoComments.updateOne(
          { video_id: video_id },
          { $pull: { [category]: { commentId: selectedCommentId } } }
        );
      }

      if (result.modifiedCount > 0) {
        deleted = true;
        break;
      }
    }

    if (!deleted) {
      console.warn("⚠️ Comment not found in any category for deletion.");
    }

    return res.status(200).json({
      message: "Comment deleted successfully.",
      deletedSuccess: true,
    });
  } catch (err) {
    console.error("❌ Error deleting comment:", err?.response?.data || err.message);
    return res.status(500).json({
      message: "Failed to delete comment.",
      error: err?.response?.data || err.message,
    });
  }
});


router.post("/update-password", async function (req, res) {

  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  
  USER.findOne({email : email}).then(async (result)=>{

    if(result){

      await USER.findByIdAndUpdate(result._id, { password: hashedPassword });
 
  res.status(200).send({ success: true});
  res.end();


    }

    else{

      res.status(200).send({ success: false});
      res.end();


    }

  }).catch((err) =>{

  })

});


router.get("/verify-login-token", authenticateToken, async (req, res) => {
  return res.status(200).json({ valid: true, user: req.user });
});




router.post("/logout", authenticateToken, (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, // Set to true in production with HTTPS
    sameSite: "Strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

  
  router.post('/get-user-details', authenticateToken, async function (req, res){

    const userId = req.user?.user_id; //user_id from authenticated token

        if (!userId) {
          return res.status(400).json({ message: "Username is invalid." });
        }
  
    USER.findById(userId).then((result)=>{
  
      if(result){
  
      res.status(200).send({ success: true, data: {
        email : result.email,
        channelConnected : result.youtube_channel_linked,
        channelName : result.youtube_channel_title,
        profile_img : result.youtube_channel_profile_img,
      }});
      res.end();

  
      }
  
      else{
      res.status(200).send({ success: false, data: null });
      res.end();
  
      }
  
    }).catch(e2=>{
  
      console.error("❌ Error fetching campaign details:", e2);
      return res.status(500).json({ error: "Internal Server Error" });
  
    })
  });




export default router;
