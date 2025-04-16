const React = require('react');
const { useEffect } = React;

const {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  useMediaQuery,
  useTheme,
} = require("@mui/material");

const AOS = require('aos'); // Import AOS
require('aos/dist/aos.css'); // Import AOS CSS

const SecurityOutlinedIcon = require('@mui/icons-material/SecurityOutlined');
const InsightsOutlinedIcon = require('@mui/icons-material/InsightsOutlined');
const TroubleshootOutlinedIcon = require('@mui/icons-material/TroubleshootOutlined');
const AutoAwesomeOutlinedIcon = require('@mui/icons-material/AutoAwesomeOutlined');
const blockImage = require("../images/CreatorConsole_Dashboard.png");
const TaskAltOutlinedIcon = require("@mui/icons-material/TaskAltOutlined");
const ArrowRightAltOutlinedIcon = require("@mui/icons-material/ArrowRightAltOutlined");
const youtube = require("../images/youtube_3991722.png");


const tabData = [
  {
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
];

function BodyBlocks() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Detect mobile view

  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in ms
      once: true, // Animation will run once
    });
  }, []);

  return (
    <div>
      {/* Main Body Tab Section (Mobile/Tablet) */}
      <div className="body-tab-card">
        {isMobile ? (
          <>
            {tabData.map((tab, index) => (
              <Card
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  mt: 2,
                  px: 1,
                  py: 4,
                  backgroundColor: tab.bgColor,
                }}
                data-aos="fade-up" // Animation for fade-in effect
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
                    {tab.title}
                  </Typography>

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
                      <TaskAltOutlinedIcon sx={{ fontSize: "22px", color: "#FFFFFF" }} />
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
                  data-aos="fade-in" // Fade-in animation for image
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
                      {tab.CTA_text}
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
          <Card
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              mt: 2,
              px: 1,
              py: 2,
              backgroundColor: tabData[0].bgColor,
              borderRadius: "18px",
            }}
            data-aos="fade-left" // Animation for slide-in effect
          >
            {/* Image Section */}
            <Box
              component="img"
              src={tabData[0].image}
              alt="dashboard_image"
              sx={{
                display: "flex",
                width: "45%",
                height: "auto",
                borderRadius: "4px",
                ml: 6,
                py: 8,
              }}
              data-aos="fade-right" // Fade-in animation for image
            />

            {/* Text Section */}
            <CardContent sx={{ textAlign: isMobile ? "center" : "left", pl: 8, py: 6 }}>
              <Typography
                sx={{
                  fontSize: "32px",
                  color: "#FFFFFF",
                  lineHeight: 1.3,
                  pb: 3,
                  fontWeight: 400,
                }}
              >
                {tabData[0].title}
              </Typography>

              {/* Bullet Points */}
              {tabData[0].bulletPoints.map((point, index) => (
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
                  <TaskAltOutlinedIcon sx={{ fontSize: "22px", color: "#FFFFFF" }} />
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
                    href={tabData[0].redirection}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      fontSize: "18px",
                      color: "#FFFFFF",
                      cursor: "pointer",
                      textDecoration: "none",
                    }}
                  >
                    {tabData[0].CTA_text}
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
        )}
      </div>

      {/* Features Section with AOS Animations */}
      <div className="col-12 col-md-12 features-blocks">
        <div className="col-12 col-md-6 features-blocks-indi-1">
          <div data-aos="fade-up">
            <div className="icon-featurename-div">
              <SecurityOutlinedIcon sx={{ fontSize: "38px", marginTop: "2px", color: "#343131" }} />
              <div className="feature-name" style={{ color: '#343131' }}>Real-Time Analysis</div>
            </div>
            <div className="feature-description">
              Comments are analyzed instantly and categorized into helpful buckets like Positive, Negative, Questions, Collaboration, Feedback, and more, helping you focus only on what matters — without compromising your privacy.
            </div>
          </div>

          <div className="second-feature-dimen">
            <div className="icon-featurename-div" data-aos="fade-up">
              <AutoAwesomeOutlinedIcon sx={{ fontSize: "38px", marginTop: "2px", color: "#261FB3" }} />
              <div className="feature-name" style={{ color: '#261FB3' }}>AI-powered Sentiment</div>
            </div>
            <div className="feature-description">
              We use Google's Natural Language Processing (NLP) to detect sentiment — like positive, negative, questions, and more — so you can create content that truly resonates with your audience.
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 features-blocks-indi-2">
          <div data-aos="fade-up">
            <div className="icon-featurename-div">
              <TroubleshootOutlinedIcon sx={{ fontSize: "38px", marginTop: "2px", color: "#3A7D44" }} />
              <div className="feature-name" style={{ color: '#3A7D44' }}>Effortless Management</div>
            </div>
            <div className="feature-description">
              Manage comments with ease, track the most-liked ones, discover positive and negative feedback, and prioritize what’s important for you — all in a streamlined dashboard.
            </div>
          </div>

          <div className="second-feature-dimen">
            <div className="icon-featurename-div" data-aos="fade-up">
              <InsightsOutlinedIcon sx={{ fontSize: "38px", marginTop: "2px", color: "#12A7B0" }} />
              <div className="feature-name" style={{ color: '#12A7B0' }}>AI Insights</div>
            </div>
            <div className="feature-description">
              Our tool delivers AI-powered insights to help you understand your audience's true sentiments. You can fine-tune your content strategy based on real-time feedback.
            </div>
          </div>
        </div>
      </div>

      <div className='col-12 col-md-12 integrations-main-container'>

      <div className='integrations-box' data-aos="fade-up" data-aos-delay="200">  {/* Fade-up effect for the entire section */}

<div className='integration-text-header' data-aos="fade-up" data-aos-delay="400"> {/* Fade-up effect with a delay for the header */}
  Integrations We Support
</div>

<img  
  className="img-fluid rounded icon-image-integrations" 
  src={youtube} 
  alt="youtube-icon" 
  data-aos="zoom-in"  // Zoom-in effect for the image
  data-aos-delay="600" // Delay to make it appear after the header
/>

</div>


</div>

    </div>
  );
}


module.exports = BodyBlocks;

