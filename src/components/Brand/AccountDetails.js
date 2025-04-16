const React = require("react");
const { useState } = React;
const { Box, Tab, Tabs } = require("@mui/material");
const AccountDetailsPage1 = require("./AccountDetailsPage1");


// const Billing = () => (
//   <Box p={2}>
//     <Typography variant="h6">Billing</Typography>
//     <Typography>Here are your billing details...</Typography>
//   </Box>
// );


// Main Component
const AccountDetails = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };



  return (
    <Box sx={{ paddingX : '5rem'}}>
      {/* Sticky Header */}
      <div sx={{ position: "sticky", top: 0, zIndex: 1000 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{ alignItems : 'self-start'}}
        >
          <Tab
            label="Account"
            sx={{
              fontSize: "16px", // Custom font size
              fontWeight: "400", // Custom font weight
              textTransform: "none", // Remove uppercase transformation
              color: activeTab === 0 ? "primary.main" : "text.secondary", // Change color based on active tab
             
            }}
          />
          {/* <Tab
            label="Billing"
            sx={{
              fontSize: "16px",
              fontWeight: "400",
              textTransform: "none",
              color: activeTab === 1 ? "primary.main" : "text.secondary",
            
            }}
          /> */}
        </Tabs>
      </div>

      {/* Content Area */}
      <Box mt={2}>
        {activeTab === 0 && <AccountDetailsPage1 />}
        {/* {activeTab === 1 && <Billing />} */}
      </Box>
    </Box>
  );
};


module.exports = AccountDetails;

