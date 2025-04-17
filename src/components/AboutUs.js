const React = require('react');
const { Box, Typography, useMediaQuery, Grid, Card, CardContent, Avatar } = require('@mui/material');
const Navbar = require('./Navbar.js');
const Footer = require('./Footer.js');
const CodeIcon = require('@mui/icons-material/Code');
const FavoriteIcon = require('@mui/icons-material/Favorite');
const EmojiObjectsIcon = require('@mui/icons-material/EmojiObjects');

const AboutUs = () => {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <>
      <Navbar />
      <Box sx={{ padding: isMobile ? 3 : 8, mt: 10 }}>
        <Typography variant="h3" sx={{ fontWeight: 600, fontSize: isMobile ? '36px' : '48px', mb: 4 }}>
          About Us
        </Typography>

        <Typography sx={{ fontWeight: 400, fontSize: isMobile ? '20px' : '28px', mb: 6 }}>
          Creator Console was born out of passion, long hours, and the deep desire to empower content creators. I built this platform from scratch, coding late into the night, testing every feature, and constantly iterating — all with a single goal in mind: to make YouTube analytics insightful, efficient, and creator-first.
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 4, boxShadow: 3, height: '100%' }}>
              <CardContent>
                <Avatar sx={{ bgcolor: '#1976d2', mb: 2 }}>
                  <CodeIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Crafted With Code</Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  Every line of code in Creator Console was hand-written and optimized for creators. No outsourced teams — just pure dedication to build something meaningful.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 4, boxShadow: 3, height: '100%' }}>
              <CardContent>
                <Avatar sx={{ bgcolor: '#388e3c', mb: 2 }}>
                  <EmojiObjectsIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Creator-Centric Design</Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  This tool was designed by putting myself in the shoes of a content creator — removing guesswork from performance data, improving discoverability, and helping creators grow smarter.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 4, boxShadow: 3, height: '100%' }}>
              <CardContent>
                <Avatar sx={{ bgcolor: '#d32f2f', mb: 2 }}>
                  <FavoriteIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Built with Love</Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  Creator Console is more than just a tool — it’s a labor of love. Every feature was tested, improved, and shipped with care to support the creator community.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 8, maxWidth: 1000 }}>
          <Typography variant="h5" sx={{ fontWeight: 500, mb: 2 }}>
            A Message From Us
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '18px' }}>
            I know the journey of a creator isn't easy — juggling ideas, content, analytics, and growth all at once. I’ve been there. That’s why I built Creator Console: to simplify your backend so you can focus on what you love — creating. This is just the beginning, and I’m committed to making it better every day. Thank you for trusting this platform.
          </Typography>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

module.exports = AboutUs;
