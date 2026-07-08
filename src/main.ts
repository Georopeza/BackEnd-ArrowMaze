import 'dotenv/config';
import { createServer } from './infrastructure/http/server';

/** Punto de entrada del backend: crea el servidor y lo pone a escuchar. */
const port = Number(process.env.PORT ?? 3000);
const app = createServer();

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Arrow Maze backend listening on port ${port}`);
});
