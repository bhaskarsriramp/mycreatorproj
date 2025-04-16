import React from "react";
import { Grid, Typography, IconButton, Box, Divider } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import TwitterIcon from "@mui/icons-material/Twitter";

export default function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: "#121212",
        color: "#fff",
        paddingY: 5,
        paddingX: 2,
        mt: 5,
      }}
    >
      <Grid container spacing={4} justifyContent="center">
        {/* Company Section */}
        <Grid item xs={12} sm={4} md={3}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              letterSpacing: "1px",
              color: "#f2f2f2",
              marginBottom: 2,
            }}
          >
            Company
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#ccc",
              mb: 1,
              transition: "color 0.3s",
              "&:hover": { color: "#f2f2f2" },
            }}
          >
            <a href="/google_api_disclosure" style={linkStyle}>
              Google API Disclosure
            </a>
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#ccc",
              mb: 1,
              transition: "color 0.3s",
              "&:hover": { color: "#f2f2f2" },
            }}
          >
            <a href="/disclosure_policy" style={linkStyle}>
              Disclosure Policy
            </a>
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#ccc",
              mb: 1,
              transition: "color 0.3s",
              "&:hover": { color: "#f2f2f2" },
            }}
          >
            <a href="/trust_center" style={linkStyle}>
              Trust Center
            </a>
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#ccc",
              mb: 1,
              transition: "color 0.3s",
              "&:hover": { color: "#f2f2f2" },
            }}
          >
            <a href="/about_us" style={linkStyle}>
              About Us
            </a>
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#ccc",
              mb: 1,
              transition: "color 0.3s",
              "&:hover": { color: "#f2f2f2" },
            }}
          >
            <a href="/sitemap.xml" style={linkStyle}>
              Sitemap
            </a>
          </Typography>
        </Grid>

        {/* Useful Links Section */}
        <Grid item xs={12} sm={4} md={3}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              letterSpacing: "1px",
              color: "#f2f2f2",
              marginBottom: 2,
            }}
          >
            Useful
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#ccc",
              mb: 1,
              transition: "color 0.3s",
              "&:hover": { color: "#f2f2f2" },
            }}
          >
            <a href="/youtube_api_disclosure" style={linkStyle}>
              YouTube API Disclosure
            </a>
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#ccc",
              mb: 1,
              transition: "color 0.3s",
              "&:hover": { color: "#f2f2f2" },
            }}
          >
            <a href="/terms" style={linkStyle}>
              Terms & Conditions
            </a>
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#ccc",
              mb: 1,
              transition: "color 0.3s",
              "&:hover": { color: "#f2f2f2" },
            }}
          >
            <a href="/privacy_policy" style={linkStyle}>
              Privacy Policy
            </a>
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#ccc",
              mb: 1,
              transition: "color 0.3s",
              "&:hover": { color: "#f2f2f2" },
            }}
          >
            <a href="/security" style={linkStyle}>
              Security
            </a>
          </Typography>
        </Grid>

        {/* Social Media Section */}
        <Grid item xs={12} sm={4} md={3}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              letterSpacing: "1px",
              color: "#f2f2f2",
              marginBottom: 2,
            }}
          >
            Follow Us
          </Typography>
          <Box display="flex" justifyContent="flex-start" gap={2}>
            <IconButton
              href="https://www.youtube.com/channel/UCqp363NhrpKpeGlOK2U-hWA"
              target="_blank"
              color="inherit"
              sx={{ "&:hover": { color: "#FF0000" } }}
            >
              <YouTubeIcon sx={{ fontSize: 30 }} />
            </IconButton>
            <IconButton
              href="https://www.instagram.com/audioreel/"
              target="_blank"
              color="inherit"
              sx={{ "&:hover": { color: "#E4405F" } }}
            >
              <InstagramIcon sx={{ fontSize: 30 }} />
            </IconButton>
            <IconButton
              href="https://x.com/audioreel"
              target="_blank"
              color="inherit"
              sx={{ "&:hover": { color: "#1DA1F2" } }}
            >
              <TwitterIcon sx={{ fontSize: 30 }} />
            </IconButton>
          </Box>
        </Grid>
      </Grid>

      {/* Footer Divider */}
      <Divider sx={{ my: 4, backgroundColor: "#444" }} />

      <Box textAlign="center" sx={{ mt: 2 }}>
        <Typography variant="body2" sx={{ color: "#B9B4C7" }}>
          &copy; Creator Console 2025
        </Typography>
      </Box>
    </Box>
  );
}

// Styles for links
const linkStyle = {
  textDecoration: "none",
  color: "#ccc",
  transition: "color 0.3s ease",
};

