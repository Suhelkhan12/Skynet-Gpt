import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

// here we are configuring our dotenv file where open ai api key is present
dotenv.config();

// to make our open ai class use the api key which is present in
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();

// cors stands for cross origin resource sharing
app.use(cors());

// letting the body of our application parse json
app.use(express.json());

// this is simply done to check if the server is running or not
app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Hello from Skynet!",
  });
});

// IMP this is main method which is sending the user prompt from the forntend to the backend and that backend sending that prompt to the openai backend and the response which was generate by the open ai that is being stored in an object which has property of bot
app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0, // Higher values means the model will take more risks.
      max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    });

    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error || "Something went wrong");
  }
});

app.listen(5001, () =>
  console.log("AI server started on http://localhost:5001")
);
