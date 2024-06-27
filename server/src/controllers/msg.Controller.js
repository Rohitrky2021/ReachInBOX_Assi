const axios = require("axios");
const express = require("express");
const {
  connection,
  redisGetToken,
} = require("../middlewares/redis.middleware");
const { createConfig } = require("../Util/utils");
const { google } = require("googleapis");
require("dotenv").config();
const OpenAI = require("openai");
const { Queue } = require("bullmq");
const { OAuth2Client } = require("google-auth-library");

const oAuth2Client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
});

oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_SECRECT_KEY });

const getDrafts = async (req, res) => {
  try {
    const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/drafts`;
    const token = await redisGetToken(req.params.email);

    if (!token) {
      return res.send("Token not found. Please login again to get the token.");
    }

    const config = createConfig(url, token);
    const response = await axios(config);

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching drafts:", error.message);
    res.status(500).send(error.message);
  }
};

const readMail = async (req, res) => {
  try {
    const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/messages/${req.params.message}`;
    const token = await redisGetToken(req.params.email);

    if (!token) {
      return res.send("Token not found. Please login again to get the token.");
    }

    const config = createConfig(url, token);
    const response = await axios(config);

    res.json(response.data);
  } catch (error) {
    console.error("Error reading mail:", error.message);
    res.status(500).send(error.message);
  }
};

const createLabel = async (req, res) => {
  try {
    const token = await redisGetToken(req.params.email);
    const label = req.body;

    const response = await axios.post(
      `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/labels`,
      label,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error creating label:", error.message);
    res.status(400).json({ error: error.message });
  }
};

const getLabel = async (req, res) => {
  try {
    const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/labels/${req.params.id}`;
    const token = await redisGetToken(req.params.email);

    if (!token) {
      return res.status(400).send("Token not found. Please login again to get the token.");
    }

    const config = {
      method: "get",
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios(config);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching label:", error.message);
    res.status(500).send(error.message);
  }
};

const getMails = async (req, res) => {
  try {
    const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/messages?maxResults=50`;
    const token = await redisGetToken(req.params.email);

    if (!token) {
      return res.send("Token not found. Please login again to get the token.");
    }

    const config = createConfig(url, token);
    const response = await axios(config);

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching emails:", error.message);
    res.status(500).send(error.message);
  }
};

const parseAndSendMail = async (data1) => {
  try {
    const { from, to } = data1;
    const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
    const message = await gmail.users.messages.get({
      userId: "me",
      id: data1.id,
      format: "full",
    });

    const payload = message.data.payload;
    const headers = payload.headers;
    const subject = headers.find((header) => header.name === "Subject")?.value;
    let textContent = "";

    if (payload.parts) {
      const textPart = payload.parts.find((part) => part.mimeType === "text/plain");
      if (textPart) {
        textContent = Buffer.from(textPart.body.data, "base64").toString("utf-8");
      }
    } else {
      textContent = Buffer.from(payload.body.data, "base64").toString("utf-8");
    }

    const snippet = message.data.snippet;
    const emailContext = `${subject} ${snippet} ${textContent}`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0301",
      max_tokens: 60,
      temperature: 0.5,
      messages: [
        {
          role: "user",
          content: `Based on the following text, categorize the content with one word label from the options - Interested, Not Interested, More information. Text: ${emailContext}`,
        },
      ],
    });

    const prediction = response.choices[0]?.message.content;
    let label;
    switch (prediction) {
      case "Interested":
        label = "Interested";
        break;
      case "Not Interested":
        label = "Not Interested";
        break;
      case "More information.":
        label = "More information";
        break;
      default:
        label = "Not Sure";
    }

    const data = {
      subject,
      textContent,
      snippet,
      label,
      from,
      to,
    };
    await sendMail(data);
  } catch (error) {
    console.error("Error parsing and sending mail:", error.message);
  }
};

module.exports = {
  getDrafts,
  readMail,
  getMails,
  parseAndSendMail,
  createLabel,
  getLabel,
};
