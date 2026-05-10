const router = require('./routes/routes.js');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({origin: 'http://localhost:30001'}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', router);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 30000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;