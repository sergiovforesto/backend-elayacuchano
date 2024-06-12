import express, { Application } from 'express';
import cors from 'cors'
import helmet from 'helmet';




import { Routes } from '../interfaces';
import { RoutePath } from '../paths/routePath';

//Routes
import Route_user from '../routes/users-route'
import Route_post from '../routes/post-route'
import Route_profile from '../routes/profile-route'
import Route_comment from '../routes/comments-route'
import Route_like from '../routes/likes-route'
import Route_image from '../routes/uploads-routes'


class Server {
    app: Application;
    port: string | number;
    path: Routes

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 5000
        this.path = RoutePath

        //Siempre deben ejecutarse antes que las rutas
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.app.use(express.json()); //Siempre se debe ejecutar de primero
        this.app.use(cors({ origin: process.env.FRONTEND_URL }))
        this.app.use(helmet())
    }

    routes() {
        this.app.use(this.path.users, Route_user)
        this.app.use(this.path.posts, Route_post)
        this.app.use(this.path.profile, Route_profile)
        this.app.use(this.path.comments, Route_comment)
        this.app.use(this.path.likes, Route_like)
        this.app.use(this.path.image, Route_image)
    }

    start() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }


}

export default Server