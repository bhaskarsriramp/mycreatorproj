const React = require("react");
const { useState } = React;

const {
  Tabs,
  Tab,
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  useMediaQuery,
  useTheme,
} = require("@mui/material");

const SentimentSatisfiedAltIcon = require("@mui/icons-material/SentimentSatisfiedAlt");
const PeopleIcon = require("@mui/icons-material/People");
const GroupWorkIcon = require("@mui/icons-material/GroupWork");
const BarChartIcon = require("@mui/icons-material/BarChart");
const TaskAltOutlinedIcon = require("@mui/icons-material/TaskAltOutlined");
const blockImage = require("../images/CreatorConsole_Dashboard.png");
const ArrowRightAltOutlinedIcon = require("@mui/icons-material/ArrowRightAltOutlined");


const tabData = [
  {
    label: "Sentiment Analysis",
    icon: <SentimentSatisfiedAltIcon />,
    title: "Sentiment Analysis for Smarter Comment Management.",
    bulletPoints: [
      "Categorizes comments by sentiment and intent instantly.",
      "Highlights important, liked, and concerning comments.",
      "Ensures you never miss key audience interactions.",
    ],
    CTA_text: "More comments features",
    redirection: "https://www.google.com",
    image: blockImage,
    bgColor: "#3F7D58",
  },
  {
    label: "Channel Health",
    icon: <PeopleIcon />,
    title: "Channel Health: Track, Improve, and Grow Effortlessly.",
    bulletPoints: [
      "Monitor key performance metrics in real time.",
      "Identify trends, growth opportunities, and potential risks.",
      "Get actionable insights to optimize your content strategy.",
    ],
    CTA_text: "More channel features",
    redirection: "https://www.google.com",
    image: blockImage,
    bgColor: "#1687A7",
  },
  {
    label: "Insights",
    icon: <GroupWorkIcon />,
    title: "Deep Insights: Unlock Data-Driven Growth.",
    bulletPoints: [
      "Discover trends and patterns in audience behavior.",
      "Uncover top-performing content and engagement drivers.",
      "Gain AI-powered recommendations for smarter decisions."
    ],
    CTA_text: "More insights here",
    redirection: "https://www.google.com",
    image: blockImage,
    bgColor: "#645CBB",
  },
  {
    label: "Metrics",
    icon: <BarChartIcon />,
    title: "Metrics That Matter: Clear, Actionable, Real-Time.",
    bulletPoints: [
      "Track detailed performance beyond basic analytics.",
      "Compare historical data to spot long-term trends.",
      "Measure audience retention, watch time, and engagement quality."
    ],    
    CTA_text: "More metrics",
    redirection: "https://www.google.com",
    image: blockImage,
    bgColor: "#CC7351",
  },
];

const mobTabData = [
  {
    label: "Sentiment Analysis",
    icon: <SentimentSatisfiedAltIcon />,
    title: "Sentiment Analysis for Smarter Comment Management.",
    bulletPoints: [
      "Categorizes comments by sentiment and intent instantly.",
      "Highlights important, liked, and concerning comments.",
      "Ensures you never miss key audience interactions.",
    ],
    CTA_text: "More comments features",
    redirection: "https://www.google.com",
    image: blockImage,
    bgColor: "#3F7D58",
  },
  {
    label: "Channel Health",
    icon: <PeopleIcon />,
    title: "Channel Health: Track, Improve, and Grow Effortlessly.",
    bulletPoints: [
      "Monitor key performance metrics in real time.",
      "Identify trends, growth opportunities, and potential risks.",
      "Get actionable insights to optimize your content strategy.",
    ],
    CTA_text: "More channel features",
    redirection: "https://www.google.com",
    image: blockImage,
    bgColor: "#1687A7",
  },
  {
    label: "Insights",
    icon: <GroupWorkIcon />,
    title: "Deep Insights: Unlock Data-Driven Growth.",
    bulletPoints: [
      "Discover trends and patterns in audience behavior.",
      "Uncover top-performing content and engagement drivers.",
      "Gain AI-powered recommendations for smarter decisions."
    ],
    CTA_text: "More insights here",
    redirection: "https://www.google.com",
    image: blockImage,
    bgColor: "#645CBB",
  },
];

const BodyBlocksTabs = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Detect mobile view

  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Box
        sx={{
          width: "90%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {/* Tabs Section (Hidden on mobile) */}
        {isMobile ? (
          <>
            {mobTabData.map((tab, index) => (
              <Card
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "column", // Image on top for mobile
                  alignItems: "flex-start",
                  mt: 2,
                  px: 1,
                  py: 4,
                  backgroundColor: tab.bgColor, // <-- Use tab.bgColor instead of tabData[selectedTab].bgColor
                }}
              >
                {/* Text Section */}
                <CardContent sx={{ textAlign: "left" }}>
                  <Typography
                    sx={{
                      fontSize: "26px",
                      color: "#FFFFFF",
                      lineHeight: 1.3,
                      mb: 3,
                      fontWeight: 400,
                    }}
                  >
                    {tab.title}{" "}
                    {/* <-- Use tab.title instead of tabData[selectedTab].title */}
                  </Typography>
                  {/* <Typography sx={{ fontSize: '16px', color: '#FFFFFF' }}>
            {tab.description} 
          </Typography> */}

                  {/* Bullet Points */}
                  {tab.bulletPoints.map((point, bulletIndex) => (
                    <Stack
                      key={bulletIndex}
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 2,
                        mt: 3,
                        justifyContent: "flex-start",
                      }}
                    >
                      <TaskAltOutlinedIcon
                        sx={{ fontSize: "22px", color: "#FFFFFF" }}
                      />
                      <Typography sx={{ fontSize: "16px", color: "#FFFFFF" }}>
                        {point}
                      </Typography>
                    </Stack>
                  ))}
                </CardContent>

                {/* Image Section */}
                <Box
                  component="img"
                  src={tab.image}
                  alt="Placeholder"
                  sx={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "4px",
                    mt: 1,
                  }}
                />

                <Box
                  mt={3}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Stack sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
                    <Typography
                      component="a"
                      href={tab.redirection}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        fontSize: "18px",
                        color: "#FFFFFF",
                        cursor: "pointer",
                        textDecoration: "none",
                        fontWeight: 500,
                      }}
                    >
                      {tab.CTA_text} {/* <-- Use tab.CTA_text */}
                    </Typography>
                    <ArrowRightAltOutlinedIcon sx={{ color: "#FFFFFF" }} />
                  </Stack>

                  <Box
                    sx={{
                      height: "2px",
                      backgroundColor: "#FFFFFF",
                      mt: 1,
                      width: "100%",
                      display: "inline-block",
                    }}
                  />
                </Box>
              </Card>
            ))}
          </>
        ) : (
          <>
         <Tabs
  value={selectedTab}
  onChange={(e, newValue) => setSelectedTab(newValue)}
  centered
  sx={{ gap: 2 }}
  TabIndicatorProps={{
    sx: { backgroundColor: tabData[selectedTab]?.bgColor } // Change underline color dynamically
  }}
>
  {tabData.map((tab, index) => (
    <Tab
      key={index}
      label={tab.label}
      icon={tab.icon}
      iconPosition="start"
      sx={{ 
        fontSize: "16px", 
        textTransform: "none",
        color: "#9AA6B2", // Default text color
        "&.Mui-selected": { 
          color: tab.bgColor // Selected tab text color
        },
        "&.Mui-selected .MuiTab-iconWrapper": { 
          color: tab.bgColor // Change icon color when selected
        }
      }}
    />
  ))}
</Tabs>



            <Card
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                mt: 2,
                px: 1,
                py: 2,
                backgroundColor: tabData[selectedTab].bgColor,
              }}
            >
              {/* Image Section */}

              <Box
                component="img"
                src={tabData[selectedTab].image}
                alt="dashboard_image"
                sx={{
                  display: "flex",
                  width: "50%",
                  height: "auto",
                  borderRadius: "4px",
                  ml: 4,
                  py: 6,
                }}
              />

              {/* Text Section */}
              <CardContent
                sx={{ textAlign: isMobile ? "center" : "left", pl: 8, py: 6 }}
              >
                <Typography
                  sx={{
                    fontSize: "32px",
                    color: "#FFFFFF",
                    lineHeight: 1.3,
                    pb: 3,
                    fontWeight: 400,
                  }}
                >
                  {tabData[selectedTab].title}
                </Typography>
                {/* <Typography sx={{ fontSize: '18px', color: '#FFFFFF' }}>
              {tabData[selectedTab].description}
            </Typography> */}

                {/* Bullet Points */}
                {tabData[selectedTab].bulletPoints.map((point, index) => (
                  <Stack
                    key={index}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 2,
                      mt: 3,
                      justifyContent: "flex-start",
                    }}
                  >
                    <TaskAltOutlinedIcon
                      sx={{ fontSize: "22px", color: "#FFFFFF" }}
                    />
                    <Typography sx={{ fontSize: "18px", color: "#FFFFFF" }}>
                      {point}
                    </Typography>
                  </Stack>
                ))}

                {/* CTA Link with Underline */}

                <Box
                  mt={4}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "fit-content",
                  }}
                >
                  <Stack sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
                    <Typography
                      component="a"
                      href={tabData[selectedTab].redirection}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        fontSize: "18px",
                        color: "#FFFFFF",
                        cursor: "pointer",
                        textDecoration: "none",
                      }}
                    >
                      {tabData[selectedTab].CTA_text}
                    </Typography>
                    <ArrowRightAltOutlinedIcon sx={{ color: "#FFFFFF" }} />
                  </Stack>

                  <Box
                    sx={{
                      height: "2px",
                      backgroundColor: "#FFFFFF",
                      mt: 1,
                      width: "100%",
                      display: "inline-block",
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </>
        )}
      </Box>
    </Box>
  );
};


module.exports = BodyBlocksTabs;

