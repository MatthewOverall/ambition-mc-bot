import express, { Request, Response } from 'express';
import fs from 'fs'

const app: express.Application = express();
const port: number = 3000;


app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
});


app.get('/:name', (req: Request, res: Response) => {
    res.send(`Hello ${req.param('name', 'Mark')}`);
});


app.listen(port, () => {
    console.log(fs)
    console.log(`Server listening at port: ${port}`);
});
