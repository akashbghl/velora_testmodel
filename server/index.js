import express from 'express';
import cors from 'cors';
const app = express()
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
}); 

// Example route to send your assistantId or API key securely
app.get("/config", (req, res) => {
  res.json({
    publicKey: "64d4656c-39c1-458a-b7d4-7a3a1cb40128",
    assistantId: "2742c6ed-01b0-48df-bae2-94b2b9d5523b",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});