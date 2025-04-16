const React = require("react");
const { useState } = React;

const {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Popper,
  Paper,
  Stack,
  Collapse,
} = require("@mui/material");

const MenuIcon = require("@mui/icons-material/Menu");
const CloseIcon = require("@mui/icons-material/Close");

const { useNavigate } = require("react-router-dom");

const logo = require("../images/audioreel-logo.png");

const KeyboardArrowDownOutlinedIcon = require("@mui/icons-material/KeyboardArrowDownOutlined");
const KeyboardArrowUpOutlinedIcon = require("@mui/icons-material/KeyboardArrowUpOutlined");


const menuItems = [
  // {
  //   label: "Platform",
  //   sections: [
  //     {
  //       title: "Core Features",
  //       items: [
  //         { title: "Engagement", description: "Boost interaction with your audience.", icon: <MailOutlineOutlinedIcon sx={{ fontSize : '22px', color: '#2A004E'}} />, cardBgColor : '#E3FDFD', titleColor : '#2A004E' },
  //         { title: "Analytics", description: "Gain insights with real-time data.", icon: <AssessmentOutlinedIcon sx={{ fontSize : '22px', color: '#FF6500'}} />, cardBgColor : '#FFE2E2', titleColor : '#FF6500' },
  //         { title: "Publishing", description: "Schedule content seamlessly.", icon: <MailOutlineOutlinedIcon sx={{ fontSize : '22px', color: '#4C3BCF'}} />, cardBgColor : '#FFE2E2' , titleColor : '#4C3BCF'},
  //       ],
  //     },
  //     {
  //       title: "Premium Solutions",
  //       items: [
  //         { title: "Advanced AI", description: "Leverage AI for smarter content.", icon: <MailOutlineOutlinedIcon sx={{ fontSize : '22px', color: '#49243E'}} />, cardBgColor : '#FFE2E2', titleColor : '#49243E'},
  //         { title: "SEO Optimization", description: "Enhance discoverability.", icon: <MailOutlineOutlinedIcon sx={{ fontSize : '22px', color: '#005B41'}} />, cardBgColor : '#FFE2E2', titleColor : '#005B41' },
  //         { title: "Performance Reports", description: "Track growth effortlessly.", icon: <MailOutlineOutlinedIcon sx={{ fontSize : '22px', color: '#082032'}} />, cardBgColor : '#FFE2E2', titleColor : '#082032' },
  //       ],
  //     },
  //     {
  //       title: "Platform",
  //       items: [
  //         { title: "Integration", description: "Connect with other tools.",icon: <MailOutlineOutlinedIcon sx={{ fontSize : '22px', color: '#03506F'}} /> , cardBgColor : '#FFE2E2', titleColor : '#03506F'},
  //         { title: "Security", description: "Protect your data & privacy.", icon: <MailOutlineOutlinedIcon sx={{ fontSize : '22px', color: '#B52B65'}} /> , cardBgColor : '#FFE2E2', titleColor : '#B52B65'},
  //         { title: "Support", description: "24/7 customer assistance.", icon: <MailOutlineOutlinedIcon sx={{ fontSize : '22px', color: '#4ECCA3'}} />, cardBgColor : '#FFE2E2', titleColor : '#4ECCA3'},
  //       ],
  //     },
  //   ],
  // },
 
  { label: "Disclosure", page: "/disclosure_policy"},
  { label: "Trust Center", page: "/trust_center" },
  { label: "Security", page: "/security" },
];


export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const navigate = useNavigate();

  const toggleMenu = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };


  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: "#F5F7F8", boxShadow: "none", height: { xs: "58px", md: "76px" } }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>

        <Stack sx={{ display : 'flex', flexDirection : 'row', alignItems : 'center', gap: 16}}>

        
        <Typography variant="h2">
            <a href="/">
              <img className="img-fluid" src={logo} alt="creatorConsole" width={180} />
            </a>
          </Typography>

          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 4, mt: 1 }}>
            {menuItems.map((menu, index) => (
              <Box key={index} onMouseEnter= { menu.sections ? handleMenuOpen : null} onMouseLeave={ menu.sections ? handleMenuClose : null }>
                <Stack sx={{ display : 'flex', flexDirection : 'row', alignItems : 'center'}}>
                  
                <Button   onClick={() => navigate(menu.page)} sx={{ textTransform: "none", color : '#261FB3', fontSize : '16px', fontWeight : 500 }}>{menu.label}</Button>
                {menu.sections ? (
                  < KeyboardArrowDownOutlinedIcon sx={{ fontSize : '16px', color : '#261FB3'}}/>
                ) : ('')}

                </Stack>

                {menu.sections ?
                (
                  <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} placement="bottom-start" disablePortal>
                    <Paper sx={{ px: 8, py: 6, width: "800px", mt: 2 }}>
                      <Stack sx={{ display : 'flex', flexDirection : 'row'}}>
                        {menu.sections.map((section, idx) => (
                          <Stack item xs={4} key={idx} gap={1}>
                            <Typography  sx={{ mb: 3, fontSize : '16px', fontWeight : 400, px: 2 }}>{section.title}</Typography>
                            {section.items.map((item, i) => (
                              <Box key={i} sx={{ px: 2, py: 3, borderRadius: 2, cursor: "pointer", '&:hover': { backgroundColor: item.cardBgColor } }}>

                                <Stack sx={{ display : 'flex', flexDirection : 'row', alignItems : 'center', gap : 1, mb: 1}}>
                                 {item.icon}
                                <Typography sx={{ fontSize : '16px', fontWeight : 500, color : item.titleColor}}>{item.title}</Typography>


                                </Stack>
                                <Typography variant="body2" color="textSecondary">{item.description}</Typography>
                              </Box>
                            ))}
                          </Stack>
                        ))}
                      </Stack>
                    </Paper>
                  </Popper>
                ) : (null)}
              </Box>
            ))}
          </Box>


          </Stack>
      

          <Stack direction="row" spacing={2} sx={{ display : { xs: "none", md: "flex"}}}>
            <Button variant="outlined" color = "#261FB3" onClick={() => navigate("/login")} sx={{ textTransform: "none", px: 4, py: 1, color: '#261FB3', borderColor : '#261FB3', textAlign : 'center' }}>Login</Button>
            <Button variant="contained" color="#261FB3" onClick={() => navigate("/signup")} sx={{ textTransform: "none", px: 8, py : 1, color : '#FFFFFF', backgroundColor : '#261FB3', textAlign : 'center' }}>Try for free</Button>
          </Stack>


          <IconButton edge="end" sx={{ display: { md: "none" } }} onClick={() => setMobileOpen(true)}>
            <MenuIcon sx={{ color : '#261FB3', fontSize : '32px'}}/>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)} PaperProps={{ sx: { width: "80%" } }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
          <IconButton onClick={() => setMobileOpen(false)}>
            <CloseIcon sx={{ color : '#261FB3', fontSize : '36px'}}/>
          </IconButton>
        </Box>
        <List>
          {menuItems.map((menu, index) => (
            <React.Fragment key={index} >
              <ListItem button onClick={() => (menu.sections ? toggleMenu(index) : navigate(menu.label.toLowerCase()))}>
                <Stack sx={{ display : 'flex', flexDirection : 'row', alignItems : 'center', gap: 3, mb: 1}}>
                  
                <ListItemText primary={<Typography sx={{ color: '#261FB3', fontSize: '16px', fontWeight: 500 }}>{menu.label}</Typography>} />

                {menu.sections ? (
                  openDropdownIndex === index ? (
                    <KeyboardArrowUpOutlinedIcon sx={{ fontSize: "20px", color: "#261FB3" }} />
                  ) : (
                    <KeyboardArrowDownOutlinedIcon sx={{ fontSize: "20px", color: "#261FB3" }} />
                  )
                ) : null}

                </Stack>

              </ListItem>

              {menu.sections && (
                <Collapse in={openDropdownIndex === index} timeout="auto" unmountOnExit>
                  <List sx={{ pl: 2 }}>
                    {menu.sections.map((section, idx) => (
                      <React.Fragment key={idx}>
                        {section.items.map((item, i) => (
                          <ListItem button key={i} >
                            <Stack sx={{ display : 'flex', flexDirection : 'column', py: 1, px: 2}}> 
                            <Stack sx={{ display : 'flex', flexDirection : 'row', alignItems : 'center', gap : 1}}>
                              {item.icon}
                            <ListItemText primary={item.title} sx={{ color : item.titleColor}} />
                            </Stack>

                            <Typography sx={{fontSize : '12px', color : '#9AA6B2' }}>{item.description}</Typography>

                            </Stack>
                         

                         
                          </ListItem>
                        ))}
                      </React.Fragment>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
          <ListItem>
            <Button fullWidth variant="outlined" onClick={() => navigate("/login")} sx={{ textTransform: "none", color: '#261FB3', borderColor : '#261FB3' }}>Login</Button>
          </ListItem>
          <ListItem>
            <Button fullWidth variant="contained" color="primary" onClick={() => navigate("/signup")} sx={{ textTransform: "none", color : '#FFFFFF', backgroundColor : '#261FB3' }}>Sign up</Button>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}
