import express from 'express';

const app = express();

app.use(express.json());

// Health Endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: "API is running"
  });
});

export default app;
