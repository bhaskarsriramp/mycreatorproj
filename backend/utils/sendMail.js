// const nodemailer = require("nodemailer");




// const sendMail = async (options) =>{

//     const transporter = nodemailer.createTransport({
//         service: "gmail",
//         host: "smtp.gmail.com",
//         port: 587,
//         secure: false,
//         auth: {
//           user: "techiebhaskar7@gmail.com",
//           pass: "hhefwxgljgawbsck",
//         },
//       });

//     const mailOptions = {
//         from: 'techiebhaskar7@gmail.com',
//         to: options.to,
//         subject: options.subject,
//         text: options.text,

//     };
//     await transporter.sendMail(mailOptions);

// }

// module.exports = sendMail;


// // const nodemailer = require("nodemailer");

// // const sendMail = async (options) => {
// //   const transporter = nodemailer.createTransport({
// //     host: "smtp.mail.us-east-1.awsapps.com", // Update with your AWS WorkMail SMTP endpoint
// //     port: 465,
// //     secure: true, // Use secure connection (SSL/TLS)
// //     auth: {
// //       user: "support@broadreach.in",
// //       pass: "YamiRam@442218", // Replace with the actual password for support@broadreach.in
// //     },
// //   });

// //   const mailOptions = {
// //     from: "support@broadreach.in",
// //     to: options.to,
// //     subject: options.subject,
// //     text: options.text,
// //   };

// //   await transporter.sendMail(mailOptions);
// // };

// // module.exports = sendMail;


const nodemailer = require("nodemailer");

const sendMail = async (options) =>{

    console.log('Entered sendMail');

    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "billsbookcloud@gmail.com",
          pass: "oiggnzittvuiflyd",
        },
      });

    const mailOptions = {
        from: 'billsbookcloud@gmail.com',
        to: options.to,
        subject: options.subject,
        text: options.text,

    };
    await transporter.sendMail(mailOptions);

}

// module.exports =  sendMail ;
module.exports = sendMail;




// const nodemailer = require("nodemailer");

// const sendMail = async (options) => {
//   const transporter = nodemailer.createTransport({
//     host: "smtp.mail.us-east-1.awsapps.com", // Update with your AWS WorkMail SMTP endpoint
//     port: 465,
//     secure: true, // Use secure connection (SSL/TLS)
//     auth: {
//       user: "support@broadreach.in",
//       pass: "YamiRam@442218", // Replace with the actual password for support@broadreach.in
//     },
//   });

//   const mailOptions = {
//     from: "support@broadreach.in",
//     to: options.to,
//     subject: options.subject,
//     text: options.text,
//   };

//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendMail;

