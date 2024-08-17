import app from './app.js';

const port = 3000;


app.listen(port, () => {
  console.log(`Server is listening on port ${process.env.SERVER_PORT || port}`);
});