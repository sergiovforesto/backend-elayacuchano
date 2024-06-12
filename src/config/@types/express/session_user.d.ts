declare namespace Express {
    interface Request {
        session_user: {
            id: string;
        };
    }
}