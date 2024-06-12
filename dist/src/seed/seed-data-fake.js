"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialData = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
exports.initialData = {
    users: [
        {
            name: 'sergio',
            lastName: 'ventura',
            email: 'sergiovforesto@gmail.com',
            password: bcryptjs_1.default.hashSync('123456', 10),
            role: 'admin',
        },
        {
            name: 'Luis',
            lastName: 'Baloa',
            email: 'luisbaloa@gmail.com',
            password: bcryptjs_1.default.hashSync('123456', 10),
            role: 'user',
        },
        {
            name: 'roberto',
            lastName: 'alvarez',
            email: 'roberto@gmail.com',
            password: bcryptjs_1.default.hashSync('123456', 10),
            role: 'user',
        },
        {
            name: 'Mike',
            lastName: 'Lauren',
            email: 'mikelauren@gmail.com',
            password: bcryptjs_1.default.hashSync('123456', 10),
            role: 'user',
        },
    ],
    posts: [
        {
            title: 'Puerto Ayacucho sin gasolina',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ultrices malesuada ligula nec feugiat. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin sed arcu lacus. Nunc ultricies, augue sed egestas tempor, lorem nulla placerat orci, non facilisis libero orci a sapien. Fusce feugiat, leo et faucibus tincidunt, ex enim lacinia ipsum, eu hendrerit lectus sapien quis ante. Praesent sed posuere leo, ac faucibus velit. Aliquam vel magna fringilla, interdum diam ut, posuere erat.'
        },
        {
            title: 'España, un nuevo comienzo',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ultrices malesuada ligula nec feugiat. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin sed arcu lacus. Nunc ultricies, augue sed egestas tempor, lorem nulla placerat orci, non facilisis libero orci a sapien. Fusce feugiat, leo et faucibus tincidunt, ex enim lacinia ipsum, eu hendrerit lectus sapien quis ante. Praesent sed posuere leo, ac faucibus velit. Aliquam vel magna fringilla, interdum diam ut, posuere erat.'
        },
        {
            title: 'EE.UU nuevos retos que enfrentar',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ultrices malesuada ligula nec feugiat. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin sed arcu lacus. Nunc ultricies, augue sed egestas tempor, lorem nulla placerat orci, non facilisis libero orci a sapien. Fusce feugiat, leo et faucibus tincidunt, ex enim lacinia ipsum, eu hendrerit lectus sapien quis ante. Praesent sed posuere leo, ac faucibus velit. Aliquam vel magna fringilla, interdum diam ut, posuere erat.'
        },
        {
            title: '28 de Julio - Elecciones',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ultrices malesuada ligula nec feugiat. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin sed arcu lacus. Nunc ultricies, augue sed egestas tempor, lorem nulla placerat orci, non facilisis libero orci a sapien. Fusce feugiat, leo et faucibus tincidunt, ex enim lacinia ipsum, eu hendrerit lectus sapien quis ante. Praesent sed posuere leo, ac faucibus velit. Aliquam vel magna fringilla, interdum diam ut, posuere erat.'
        },
    ]
};
