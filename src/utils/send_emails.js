const nodemailer = require("nodemailer");

// 
const sendEmail = async (receiver, subject, { text, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", 
    port: 587,
    secure: false, 
    auth: {
      user: "gfxapex1@gmail.com",
      pass: process.env.GMAIL_PASSWORD 
    },
  });

  const mailOptions = {
    from: "gfxapex1@gmail.com", // sender address
    to: receiver, // list of recipients
    subject: subject, // Subject line
    text: text, // plain text body
    html: html, // html body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Export the correct function
module.exports = sendEmail;
