import React from "react";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default function Accordian() {
  return (
    <>

      <div className="display-5 text-center mb-5">FAQ</div>



        {/* Accordian-1 */}

      <div>
      <Accordion className="my-accordion-item my-3 mx-auto">
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography component="span">How Inboxe is different from others?</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <div className="accordion-body">
              <strong>
                Signup &#8594; Create Campaign &#8594; Design Template &#8594;
                Publish Campaign &#8594; View Results
              </strong>{" "}
              <br />
              Upload contatcs in Bulk and can be categorized into custom tags. Done publishing campaign? Sit back and check analytics.
            </div>        </AccordionDetails>
      </Accordion>
      </div>

        {/* Accordian-2 */}

      <div>
      <Accordion className="my-accordion-item my-3 mx-auto">
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography component="span">How Inboxe works for Realtors?</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <div className="accordion-body">
             A very simplest process to send marketing or promotional emails in just 4 steps.
              NO coding knowledge is required.
              &#128512;
            </div>
       </AccordionDetails>
      </Accordion>
      </div>

        {/* Accordian-3 */}

        <div>
      <Accordion className="my-accordion-item my-3 mx-auto mb-5">
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography component="span">How we verify Brands ?</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <div className="accordion-body">
             
              <strong>Brands:</strong> Brands signups with official mail IDs and we follow certain verification process 
              before onboarding a Brand.
            </div>
       </AccordionDetails>
      </Accordion>
      </div>

    </>
  );
}
