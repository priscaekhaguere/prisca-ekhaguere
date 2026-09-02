import nodemailer from "nodemailer";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed",
    });
  }

  try {
    const {
      name,
      email,
      organization,
      service,
      message,
    } = req.body;

    if (!name || !email || !service || !message) {
      return res.status(400).json({
        message: "Please complete all required fields.",
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Prisca Ekhaguere Website" <${process.env.GMAIL_USER}>`,
      to: "blockchaingoddess@gmail.com",
      replyTo: email,
      subject: `New Website Inquiry — ${service}`,
      text: `
New inquiry from your personal website.

Name: ${name}
Email: ${email}
Organization / Brand: ${organization || "Not provided"}
Service: ${service}

Message:
${message}
      `,
      html: `
        <h2>New Website Inquiry</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Organization / Brand:</strong> ${
          organization || "Not provided"
        }</p>
        <p><strong>Service:</strong> ${service}</p>

        <hr />

        <h3>Message</h3>
        <p>${message.replace(/\n/g, "<br />")}</p>
      `,
    });

    return res.status(200).json({
      message: "Your inquiry has been sent successfully.",
    });
  } catch (error) {
    console.error("Email error:", error);

    return res.status(500).json({
      message: "Something went wrong while sending your inquiry.",
    });
  }
}