"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const seed_data_fake_1 = require("./seed-data-fake");
const client_1 = __importDefault(require("../lib/client"));
async function main() {
    await client_1.default.images.deleteMany();
    await client_1.default.likes.deleteMany();
    await client_1.default.comments.deleteMany();
    await client_1.default.post.deleteMany();
    await client_1.default.profile.deleteMany();
    await client_1.default.user.deleteMany();
    const { users, posts } = seed_data_fake_1.initialData;
    await client_1.default.user.createMany({
        data: users
    });
    const allUser = await client_1.default.user.findMany();
    //One post for each user
    await client_1.default.post.create({
        data: {
            title: posts[0].title,
            description: posts[0].description,
            author: {
                connect: {
                    id: allUser[0].id
                }
            }
        }
    });
    await client_1.default.post.create({
        data: {
            title: posts[1].title,
            description: posts[1].description,
            author: {
                connect: {
                    id: allUser[1].id
                }
            }
        }
    });
    await client_1.default.post.create({
        data: {
            title: posts[2].title,
            description: posts[2].description,
            author: {
                connect: {
                    id: allUser[2].id
                }
            }
        }
    });
    await client_1.default.post.create({
        data: {
            title: posts[3].title,
            description: posts[3].description,
            author: {
                connect: {
                    id: allUser[3].id
                }
            }
        }
    });
    console.log('Seed ejecutado correctamente');
}
exports.main = main;
main();
