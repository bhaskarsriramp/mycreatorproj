import React from "react";
import { Typography, Box, Grid, Stack, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Navbar from "./Navbar.js";
import imgBanner from "../images/CreatorConsole_Dashboard.png";
import ScatterPlotOutlinedIcon from "@mui/icons-material/ScatterPlotOutlined";

function IndiSentimentAnalysis() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const gridData = [
    {
      image: imgBanner,
      title: "Accelerate quality care",
      description:
        "Enhance care team efficiency with AI-driven summaries and needs response detection.",
    },
    {
      image: imgBanner,
      title: "Accelerate quality care",
      description:
        "Enhance care team efficiency with AI-driven summaries and needs response detection.",
    },
    {
      image: imgBanner,
      title: "Accelerate quality care",
      description:
        "Enhance care team efficiency with AI-driven summaries and needs response detection.",
    },
  ];

  return (
    <>
      <Navbar />

      <Grid
        container
        spacing={2}
        alignItems="center"
        direction={isSmallScreen ? "column" : "row"} // Column for mobile, row for desktop
        px={2}
        mt={isSmallScreen ? 4 : 14}
      >
        {/* Text Section */}
        <Grid item xs={12} sm={6}>
          <Box>
            <Stack spacing={2} px={2}>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  width: "fit-content",
                  borderRadius: "16px",
                  px: 2,
                  py: 0.5,
                  backgroundColor: "#3F7D58",
                  alignItems: "center",
                }}
              >
                <ScatterPlotOutlinedIcon
                  sx={{ fontSize: "16px", color: "#EFEFEF" }}
                />

                <Typography sx={{ fontSize: "16px", color: "#FFFFFF" }}>
                  Sentiment Analysis
                </Typography>
              </Box>
              <Typography sx={{ fontSize: "44px", fontWeight: 600 }}>
                Optimize your customer experience with AI-powered solutions.
              </Typography>
            </Stack>
          </Box>
        </Grid>

        {/* Image Section */}
        <Grid item xs={12} sm={6}>
          <img
            src={imgBanner}
            alt="Sentiment Analysis"
            style={{ width: "100%", height: "auto", maxWidth: "100%" }}
          />
        </Grid>
      </Grid>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          px: 12,
          gap: 2,
          mt: 12,
          py: 2,
        }}
      >
        <Typography
          sx={{ fontSize: "36px", fontWeight: 500, color: "#255F38" }}
        >
          Automate your efforts for more efficiency
        </Typography>
        <Typography sx={{ fontSize: "22px", px: "15%", textAlign: "center" }}>
          Humanize customer connections and elevate your customer care. Sprout's
          engagement tools eliminate your team's manual tasks by handling large
          volumes of social messages through AI and automation.
        </Typography>
      </Box>

      {gridData.map((tab, index) => (
        <Grid
          container
          spacing={2}
          alignItems="center"
          direction={{ xs: "column", sm: "row" }} // Column for mobile, row for larger screens
          px={2}
          mt={{ xs: 4, sm: 14 }}
          mb={6}
          key={index}
        >
          {/* Image Section (Alternates for Desktop) */}
          <Grid
            item
            xs={12}
            sm={6}
            order={{ xs: 1, sm: index % 2 === 0 ? 1 : 2 }} // Image first for mobile, alternates for desktop
          >
            <Box
              sx={{
                border: "1px solid green",
                borderRadius: "12px",
                p: 6,
                backgroundColor: "#3F7D58",
              }}
            >
              <img
                src={tab.image}
                alt={tab.title}
                style={{ width: "100%", height: "auto", maxWidth: "100%" }}
              />
            </Box>
          </Grid>

          {/* Text Section (Alternates for Desktop) */}
          <Grid
            item
            xs={12}
            sm={6}
            order={{ xs: 2, sm: index % 2 === 0 ? 2 : 1 }} // Text below image for mobile, alternates for desktop
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.6,
                alignItems: "center",
                px: 12,
                textAlign: "center",
              }}
            >
              <Typography sx={{ fontSize: "34px", fontWeight: 500 }}>
                {tab.title}
              </Typography>
              <Typography sx={{ fontSize: "18px" }}>
                {tab.description}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      ))}

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          px: 12,
          borderRadius: "12px",
          py: 3,
          backgroundColor: "#3F7D58",
          alignItems: "center",
          mx: 2,
          mt: 8,
          mb: 12
        }}
      >
        <Typography sx={{ fontSize: "26px", fontWeight: 400, color: '#FFFFFF' }}>
          See how your team can easily engage with customers.
        </Typography>

        <Button variant="contained"  sx={{ textTransform : 'none', px: 4, backgroundColor : '#123524', color: '#FFFFFF', py: 1.6}} >Start your free trial</Button>
      </Box>

      <Box sx={{ pl: '8%', mb: 12}}>
        <Typography sx={{ fontSize : '32px', fontWeight : 400, textAlign: 'left', paddingRight : '60%'}}>
        Get ahead of customer inquiries with these features
        </Typography>
      </Box>
    </>
  );
}

export default IndiSentimentAnalysis;
