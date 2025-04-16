const React = require("react");
const { useState, useEffect } = React;

const {
  MenuItem,
  Select,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  Stack,
  Avatar,
  Box,
  Tooltip,
  Button,
  Skeleton,
  ClickAwayListener,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  TextField,
  DialogActions,
} = require("@mui/material");

const axios = require("axios");
const { toast, ToastContainer } = require("react-toastify");
require("react-toastify/dist/ReactToastify.css");

const { useNavigate } = require("react-router-dom");
const { formatDistanceToNow } = require("date-fns");

const ThumbUpOffAltOutlinedIcon = require("@mui/icons-material/ThumbUpOffAltOutlined");
const ReplyOutlinedIcon = require("@mui/icons-material/ReplyOutlined");
const BorderColorOutlinedIcon = require("@mui/icons-material/BorderColorOutlined");


const CommentAnalyzer = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  const [commentsData, setCommentsData] = useState({});
  const [filteredComments, setFilteredComments] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(0);
  const [commentPages, setCommentPages] = useState({});
  const [visibleReplies, setVisibleReplies] = useState({});
  const [replyDialog, setReplyDialog] = useState(false);
  const [deleteCommentDialog, setDeleteCommentDialog] = useState(false);
  const [replyEditDialog, setReplyEditDialog] = useState(false);
  const [sendingReplyLoading, setSendingReplyLoading] = useState(false);
  const [deleteCommentLoading, setDeleteCommentLoading] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [editedReplyText, setEditedReplyText] = useState('');
  const [selectedComment, setSelectedComment] = useState("");
  const [selectedReply, setSelectedReply] = useState("");
  const [selectedReplyId, setSelectedReplyId] = useState("");
  const [selectedCommentId, setSelectedCommentId] = useState("");


  
  const navigate = useNavigate();
  const baseUrl = "http://localhost:8001/usersOn";


  const handleDialogReplyClose = () => {
    setReplyDialog(false);
  };

  const handleDialogReplyEditClose = () => {
    setReplyEditDialog(false);
  };

  const handleDialogReplyDeleteClose = () => {
    setDeleteCommentDialog(false);
  };

  const handleClickAway = () => {
    //this function keeps the dialogue open, even when user clicks outside the dialogue. dont delete this function
  };


 

  // Filter categories
  const filterMappings = [
    { label: "🔥 Most Liked", key: "mostLiked" },
    { label: "😊 Positive", key: "positive" },
    { label: "😒 Negative", key: "negative" },
    { label: "❓ Questions", key: "question" },
    { label: "📢 Feedback", key: "feedback" },
    { label: "🤝 Collaboration", key: "collaboration" },
    { label: "🚨 Hate Speech", key: "hate" },
    { label: "⚠️ Offensive", key: "offensive" },
  ];


  const toggleReplies = (commentId) => {
    setVisibleReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const postReply = async (e) => {
    e.preventDefault();
    setSendingReplyLoading(true);
  
    try {
      const res = await axios.post(
        "/api/usersOn/post-reply-to-a-comment",
        { selectedCommentId, replyText, selectedVideo },
        { withCredentials: true }
      );
  
      if (res.data.repliedSuccess) {
        toast.success("Comment has been posted!");
        setReplyDialog(false);
  
        // ✅ Update local comment data
        const updatedComments = filteredComments.map((comment) => {
          if (comment.commentId === selectedCommentId) {
            return {
              ...comment,
              replied: true,
              replyCount: comment.replyCount + 1,
              replies: [
                ...(comment.replies || []),
                {
                  textDisplay: replyText,
                  publishedAt: new Date().toISOString(), // or use value from res.data if available
                },
              ],
            };
          }
          return comment;
        });
  
        setFilteredComments(updatedComments);
  
        // Optionally update the whole dataset
        const categoryKey = filterMappings[selectedFilter].key;
        setCommentsData((prev) => ({
          ...prev,
          [categoryKey]: updatedComments,
        }));
  
        // Reset
        setReplyText('');
      } else {
        toast.error("Technical Error. Please try again!");
      }
    } catch (err) {
      if (err.response?.data?.error === "User does not exists!") {
        toast.warning("User does not exist");
      } else if (err.response?.data?.error === "email, password mismatch") {
        toast.warning("Invalid email or password");
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    } finally {
      setSendingReplyLoading(false);
    }
  };

  const updateReply = async (e) => {
    e.preventDefault();
    setSendingReplyLoading(true);
  
    try {
      const res = await axios.post(
        "/api/usersOn/update-a-reply",
        {
          selectedCommentId,         // parent comment ID
          selectedReplyId,                   // the ID of the reply to edit
          editedReplyText,          // the new reply text
          selectedVideo              // includes video_id
        },
        { withCredentials: true }
      );
  
      if (res.data.updatedSuccess) {
        toast.success("Reply has been updated!");
        setReplyEditDialog(false);
  
        // ✅ Update local comment data
        const updatedComments = filteredComments.map((comment) => {
          if (comment.commentId === selectedCommentId) {
            const updatedReplies = (comment.replies || []).map((reply) =>
              reply.replyId === selectedReplyId
                ? {
                    ...reply,
                    textDisplay: editedReplyText,
                    updatedAt: new Date().toISOString(), // or use res.data.updatedAt
                  }
                : reply
            );
  
            return {
              ...comment,
              replies: updatedReplies,
            };
          }
          return comment;
        });
  
        setFilteredComments(updatedComments);
  
        // Optionally update full dataset
        const categoryKey = filterMappings[selectedFilter].key;
        setCommentsData((prev) => ({
          ...prev,
          [categoryKey]: updatedComments,
        }));
  
        // Reset
        setEditedReplyText('');
      } else {
        toast.error("Technical error while updating reply. Please try again.");
      }
    } catch (err) {
      if (err.response?.data?.error === "User does not exists!") {
        toast.warning("User does not exist");
      } else if (err.response?.data?.error === "email, password mismatch") {
        toast.warning("Invalid email or password");
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    } finally {
      setSendingReplyLoading(false);
    }
  };
  

  const deleteComment = async (e) => {

    e.preventDefault();
    setDeleteCommentLoading(true);
  
    try {
      const res = await axios.post(
        "/api/usersOn/delete-a-comment",
        { selectedCommentId, selectedVideo },
        { withCredentials: true }
      );
  
      if (res.data.deletedSuccess) {
        setDeleteCommentDialog(false);
        toast.success("Comment deleted!");
  
  
        // ✅ Update local comment data
        const updatedComments = filteredComments.filter(
          (comment) => comment.commentId !== selectedCommentId
        );
  
        setFilteredComments(updatedComments);
  
        const categoryKey = filterMappings[selectedFilter].key;
        setCommentsData((prev) => ({
          ...prev,
          [categoryKey]: updatedComments,
        }));

      } else {
        toast.error("Technical Error. Please try again!");
      }
    } catch (err) {
      if (err.response?.data?.error === "User does not exists!") {
        toast.warning("User does not exist");
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    } finally {
    setDeleteCommentLoading(false);
      setSelectedComment(null); // reset loading state
    }
  };
  
  

  

  // Fetch latest videos on load
  useEffect(() => {
    async function fetchLatestVideoData() {
      try {
        setLoading(true);
    
        const res = await axios.get('/api/usersOn/verify-login-token', { withCredentials: true });

        // console.log('BACKENDDDDDDDD::::::::', res);
    
        if (res.data.valid) {
          try {
            const userRes = await axios.post(
              '/api/usersOn/get-user-details',
              {},
              { withCredentials: true }
            );
    
            if (userRes.data.success && userRes.data.data.channelConnected) {
              try {
                const videoRes = await axios.get('/api/usersOn/get_latest_videos', {
                  withCredentials: true,
                });
    
                setVideos(videoRes.data.videos || []);
              } catch (videoErr) {
                if (videoErr.response?.status === 401) {
                  toast.error("Session expired. Please log in again.");
                  setTimeout(() => navigate("/login"), 2000);
                } else {
                  handleError(videoErr);
                }
              }
            } else {
              setLoading(false);
              toast.error("Please Connect YouTube Channel.");
              setTimeout(() => navigate("/creator/connect_youtube"), 2000);
            }
          } catch (userErr) {
            if (userErr.response?.status === 401) {
              toast.error("Session expired. Please log in again.");
              setTimeout(() => navigate("/login"), 2000);
            } else {
              handleError(userErr);
            }
          }
        } else {
          setLoading(false);
          toast.error("Session expired. Please log in again.");
          setTimeout(() => navigate("/login"), 2000);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          setTimeout(() => navigate("/login"), 2000);
        } else {
          handleError(error);
        }
      } finally {
        setLoading(false);
      }
    }
    
    fetchLatestVideoData();
  }, []);

  // Handle video selection
  const handleChange = async (event) => {
    const video_id = event.target.value;
    const selected = videos.find((v) => v.video_id === video_id);
    setSelectedVideo(selected);
    await getCommentDetails(video_id);
  };

  // Handle API errors
  const handleError = (error) => {
    console.error("❌ Axios Error:", error); // Add this line to see the root cause
  
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        toast.warning("Session expired, please login again!");
        setTimeout(() => navigate('/login'), 2500);
      } else if (status === 400) {
        toast.warning("Re-connect YouTube Channel");
        setTimeout(() => navigate('/creator/connect_youtube'), 2000);
      } 
      else if (status === 403) {
        toast.warning("Session expired, please login again!");
        setTimeout(() => navigate('/login'), 2500);
      }
      else {
        toast.warning("Something went wrong, please try again!");

      }
    } else {
      // You can be more specific here
      if (error.message === "Network Error") {
        toast.error("Network Error: Could not connect to server.");
      } else {
        toast.error(`Unexpected error: ${error.message}`);
      }
    }
  };
  

  // Fetch comments for selected video
  const getCommentDetails = async (video_id) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/usersOn/get_video_comments_details", { video_id }, { withCredentials: true });

      if (response.data) {
        setCommentsData(response.data);
        // console.log('Data:::::::::', response.data);
        const defaultCategoryIndex = filterMappings.findIndex(cat => response.data[cat.key]?.length > 0);
        setFilteredComments(response.data[filterMappings[defaultCategoryIndex]?.key] || []);
        setSelectedFilter(defaultCategoryIndex >= 0 ? defaultCategoryIndex : 0);

        // Initialize pagination tracking
        const initialPages = {};
        filterMappings.forEach(({ key }) => {
          initialPages[key] = 1;
        });
        setCommentPages(initialPages);
      } else {
        setCommentsData({});
        setFilteredComments([]);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch more comments for a specific category
  const getMoreComments = async (video_id, category) => {
    try {
      setLoading(true);
      const nextPage = (commentPages[category] || 1) + 1;
      const response = await axios.post("/api/usersOn/get_more_20_comments_details", { video_id, category, page: nextPage }, { withCredentials: true });

      if (response.data && response.data[category]) {
        setCommentsData((prevData) => ({
          ...prevData,
          [category]: [...prevData[category], ...response.data[category]],
          [`${category}_hasMore`]: response.data[`${category}_hasMore`],
        }));

        setFilteredComments((prevComments) => [...prevComments, ...response.data[category]]);
        setCommentPages((prevPages) => ({ ...prevPages, [category]: nextPage }));
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Apply selected filter
  const applyFilter = (index) => {
    setSelectedFilter(index);
    setFilteredComments(commentsData[filterMappings[index].key] || []);
  };

  return (
    <>
      {/* Video Selection */}
      <div>
        <Select value={selectedVideo?.video_id || ""} onChange={handleChange} displayEmpty fullWidth>
          <MenuItem value="" disabled>Select a Video</MenuItem>
        
          {loading ? (

<MenuItem key="skeletonKey">
<Stack sx={{ display: "flex", flexDirection: "column" }}>
  {Array.from({ length: 7 }).map((_, index) => (
    <div key={index} style={{ display: "flex", alignItems: "center" }}>
      <Skeleton variant="rectangular" width={50} height={30} />

      <Stack sx={{ display: "flex", flexDirection: "row", gap: 1, ml: 2 }}>
        {/* Title */}
        <Skeleton variant="text" width={600} height={40} />
        <Skeleton variant="text" width={60} height={40} />
        <Skeleton variant="text" width={60} height={40} />
        <Skeleton variant="text" width={100} height={40} />
      </Stack>
    </div>
  ))}
</Stack>


</MenuItem>


) : videos?.length > 0 ? (
  videos.map((video) => (
    <MenuItem key={video.video_id} value={video.video_id}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src={video.thumbnail}
          alt={video.title}
          width={50}
          height={30}
          style={{ marginRight: 10 }}
        />
        <Typography>
          {video.title} | {video.commentsCount} comments
        </Typography>
      </div>
    </MenuItem>
  ))
) : (
  <MenuItem disabled>No videos available</MenuItem>
)}

        </Select>
      </div>

      {/* Comment Filters as Buttons */}
      {selectedVideo && (
        <Box sx={{ display: "flex", gap: 2, mt: 3, flexWrap: "wrap", justifyContent: 'center' }}>
          {filterMappings.map((filter, index) => (
            <Button
              key={index}
              variant="contained"
              onClick={() => applyFilter(index)}
              sx={{
                backgroundColor: selectedFilter === index ? "#4D55CC" : "#FFFFFF",
                color: selectedFilter === index ? "#FFFFFF" : "#1D1616",
                borderRadius: "20px",
                textTransform: "none",
                ":hover": { backgroundColor: selectedFilter === index ? "" : "#D6D6D6" }
              }}
            >
              {filter.label}
            </Button>
          ))}
        </Box>
      )}

      {/* Comment Display */}
      {selectedVideo && (
        <Card style={{ marginTop: 20, padding: 10, overflowY: "auto" }}>
          <CardContent>
            <List>
            {loading ? (
  // Show Skeleton when loading is true
  <Stack spacing={2}>
    {Array.from({ length: 5 }).map((_, index) => (
      <ListItem key={index}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Stack direction="row" spacing={1}>
            {/* Circular Skeleton for Avatar */}
            <Skeleton variant="circular" width={28} height={28} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {/* Name & Time */}
              <Stack direction="row" spacing={2}>
                <Skeleton variant="text" width={100} height={16} />
                <Skeleton variant="text" width={80} height={16} />
              </Stack>

              {/* Comment Text */}
              <Skeleton variant="text" width={300} height={20} />
              <Skeleton variant="text" width={250} height={20} />

              {/* Likes, Replies, Delete, and Reply Button */}
              <Stack direction="row" spacing={2} mt={1} alignItems="center">
                <Skeleton variant="rectangular" width={20} height={20} />
                <Skeleton variant="text" width={30} height={16} />
                <Skeleton variant="rectangular" width={20} height={20} />
                <Skeleton variant="text" width={30} height={16} />
                <Skeleton variant="rectangular" width={20} height={20} />
                <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: "12px" }} />
              </Stack>
            </Box>
          </Stack>
        </Box>
      </ListItem>
    ))}
  </Stack>
) : (
  // Show actual comments when loading is false
  filteredComments.length > 0 ? (
    filteredComments.map((comment, index) => (
      <ListItem key={index}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Stack direction="row" spacing={1}>


            <Avatar alt="User Avatar" src={comment.displayImage} sx={{ width: 28, height: 28 }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Stack direction="row" spacing={2}>
                <Typography sx={{ fontSize: "14px", color: "grey" }}>{comment.displayName}</Typography>
                <Typography sx={{ fontSize: "14px", color: "grey" }}>
                  {formatDistanceToNow(new Date(comment.publishedAt), { addSuffix: true })}
                </Typography>
              </Stack>
              <Typography sx={{ fontSize: "16px", color: "#222222" }}>{comment.originalCommentText}</Typography>
              <Stack direction="row" spacing={2} mt={1} alignItems="center">
                <Tooltip title="Likes">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <ThumbUpOffAltOutlinedIcon sx={{ fontSize: 18, color: "grey" }} />
                    <Typography>{comment.likeCount}</Typography>
                  </Stack>
                </Tooltip>
                <Tooltip title="Replies">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <ReplyOutlinedIcon sx={{ fontSize: 18, color: "grey" }} />
                    <Typography>{comment.replyCount}</Typography>
                  </Stack>
                </Tooltip>
              
                <Box
              onClick={() => {
                if (comment.replied) {
                  toggleReplies(comment.commentId); // Toggle reply view
                } else {
                  setSelectedComment(comment.originalCommentText); // 👈 Add this
                  setSelectedCommentId(comment.commentId); // 👈 Add this
                  setReplyDialog(true);                            // 👈 Add this
                }
              }}
              sx={{
                border: "1px solid #387478",
                px: 2,
                py: "2px",
                borderRadius: "18px",
                cursor: "pointer",
                backgroundColor: visibleReplies[comment.commentId] ? "#4D55CC" : "transparent",
                color: visibleReplies[comment.commentId] ? "#FFFFFF" : "inherit",
                ":hover": { backgroundColor: "#4D55CC", color: "#FFFFFF" },
              }}
            >
              <Typography sx={{ fontSize: "14px" }}>
                {comment.replied ? "Replied" : "Reply"}
              </Typography>
            </Box>


                {visibleReplies[comment.commentId] && comment.replies?.length > 0 && (
                  <Box sx={{ ml: 5, backgroundColor: "#F3F3F3", px: 2, paddingTop : '6px', borderRadius: "8px" }}>
                    {comment.replies.map((reply, idx) => (
                      <Box key={idx} sx={{ mb: 1, display : 'flex', flexDirection : 'column' }}>
                        <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
                          {reply.textDisplay}
                        </Typography>
                      
                      <Stack sx={{ display : 'flex', flexDirection : 'row', gap: 2, mt: 1}}>
                     
                      <Typography sx={{ fontSize: "12px", color: "grey" }}>
                  {formatDistanceToNow(new Date(reply.publishedAt), { addSuffix: true })}
                </Typography>

                {/* <Tooltip title="Delete">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <DeleteOutlineOutlinedIcon sx={{ fontSize: 20, color: "grey" }} />
                  </Stack>
                </Tooltip> */}

                <Tooltip title="Edit"  sx={{ cursor : 'pointer'}}   onClick={() => {
              
                  setSelectedReplyId(reply.replyId); // 👈 Add this
                  setSelectedReply(reply.textDisplay); // 👈 Add this
                  setEditedReplyText(reply.textDisplay);
                  setSelectedCommentId(comment.commentId); // 👈 Add this
                  setSelectedComment(comment.originalCommentText); // 👈 Add this
                  setReplyEditDialog(true);                            // 👈 Add this
              }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <BorderColorOutlinedIcon sx={{ fontSize: 20, color: "grey" }} />
                  </Stack>
                </Tooltip>

                      </Stack>
                      </Box>
                    ))}
                  </Box>
                )}



              </Stack>
            </Box>
          </Stack>
        </Box>
      </ListItem>
    ))
  ) : (
    <Typography>No comments available</Typography>
  )
)}

            </List>

            {/* Show More Button */}
            {commentsData[`${filterMappings[selectedFilter].key}_hasMore`] && (
              <Button
                variant="outlined"
                size="small"
                color="success"
                sx={{ mt: 3, ml: 2, textTransform : 'none' }}
                onClick={() => getMoreComments(selectedVideo.video_id, filterMappings[selectedFilter].key)}
                disabled={loading}
              >
                {loading ? "Loading..." : "Show More"}
              </Button>
            )}
          </CardContent>
        </Card>
      )}

{replyDialog && (
  <ClickAwayListener onClickAway={handleClickAway}>
    <Dialog
      open={replyDialog}
      onClose={handleDialogReplyClose}
      disableEscapeKeyDown
      keepMounted
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Reply to a comment</DialogTitle>
      <DialogContent dividers>
        {sendingReplyLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 150 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Display the comment being replied to */}
            <Box sx={{ mb: 2, p: 2, backgroundColor: "#f0f0f0", borderRadius: 1 }}>
              <Typography sx={{ fontSize: "15px", color: "#444" }}>
                {selectedComment}
              </Typography>
            </Box>

            {/* Reply Input */}
            <TextField
              fullWidth
              type="text"
              id="text"
              onChange={(e) => setReplyText(e.target.value)}
              margin="normal"
              variant="outlined"
              label="Type reply"
              value={replyText}
            />

            {/* Emoji Picker */}
            <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
              {["😀", "😂", "😍", "🙌", "👍", "🤔", "😎", "😢", "🥳", "🤯", "👀", "😡", "👏", "🤷‍♂️", "🙏"].map((emoji) => (
                <Box
                  key={emoji}
                  onClick={() => setReplyText((prev) => prev + emoji)}
                  sx={{
                    fontSize: "20px",
                    cursor: "pointer",
                    px: 1,
                    py: 0.5,
                    borderRadius: "8px",
                    ":hover": {
                      backgroundColor: "#eee",
                    },
                  }}
                >
                  {emoji}
                </Box>
              ))}
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setReplyDialog(false)} color="primary">
          Cancel
        </Button>
        <Button color="success" onClick={postReply} sx={{ borderRadius : '18px', backgroundColor : '#67AE6E', color : '#FFFFFF', px: 3, textTransform : 'none'}}>
          Reply
        </Button>
      </DialogActions>
    </Dialog>
  </ClickAwayListener>
)}

{replyEditDialog && (
  <ClickAwayListener onClickAway={handleClickAway}>
    <Dialog
      open={replyEditDialog}
      onClose={handleDialogReplyEditClose}
      disableEscapeKeyDown
      keepMounted
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Edit Reply to a comment</DialogTitle>
      <DialogContent dividers>
        {sendingReplyLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 150 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Display the comment being replied to */}
            <Box sx={{ mb: 2, p: 2, backgroundColor: "#f0f0f0", borderRadius: 1 }}>
              <Typography sx={{ fontSize: "15px", color: "#444" }}>
                {selectedComment}
              </Typography>
            </Box>

            {/* Reply Input */}
            <TextField
  fullWidth
  type="text"
  id="text"
  onChange={(e) => setEditedReplyText(e.target.value)}
  margin="normal"
  variant="outlined"
  label="Edit reply"
  value={editedReplyText} // ✅ not selectedReply
/>


            {/* Emoji Picker */}
            <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
              {["😀", "😂", "😍", "🙌", "👍", "🤔", "😎", "😢", "🥳", "🤯", "👀", "😡", "👏", "🤷‍♂️", "🙏"].map((emoji) => (
                <Box
                  key={emoji}
                  onClick={() => setEditedReplyText((prev) => prev + emoji)}
                  sx={{
                    fontSize: "20px",
                    cursor: "pointer",
                    px: 1,
                    py: 0.5,
                    borderRadius: "8px",
                    ":hover": {
                      backgroundColor: "#eee",
                    },
                  }}
                >
                  {emoji}
                </Box>
              ))}
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setReplyEditDialog(false)} color="primary">
          Cancel
        </Button>
        <Button color="success" onClick={updateReply} sx={{ borderRadius : '18px', backgroundColor : '#67AE6E', color : '#FFFFFF', px: 3, textTransform : 'none'}}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  </ClickAwayListener>
)}

{deleteCommentDialog && (
  <ClickAwayListener onClickAway={handleClickAway}>
    <Dialog
      open={deleteCommentDialog}
      onClose={handleDialogReplyDeleteClose}
      disableEscapeKeyDown
      keepMounted
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Delete a comment</DialogTitle>
      <DialogContent dividers>
        {deleteCommentLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 150 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Display the comment being replied to */}
            <Box sx={{ mb: 2, p: 2, backgroundColor: "#f0f0f0", borderRadius: 1 }}>
              <Typography sx={{ fontSize: "15px", color: "#444" }}>
                {selectedComment}
              </Typography>
            </Box>

            <Typography sx={{ fontSize: "15px", color: "#444" }}>
               Delete comment permanently ?
              </Typography>

        
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setDeleteCommentDialog(false)} color="primary">
          Cancel
        </Button>
        <Button color="success" onClick={deleteComment}>
          DELETE
        </Button>
      </DialogActions>
    </Dialog>
  </ClickAwayListener>
)}




                 <ToastContainer autoClose= {2000}/>
      
    </>
  );
};


module.exports = CommentAnalyzer;

