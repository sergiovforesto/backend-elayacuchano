import { initialData } from "./seed-data-fake";
import prisma from "../lib/client";



export async function main() {


    await prisma.images.deleteMany()
    await prisma.likes.deleteMany()
    await prisma.comments.deleteMany()
    await prisma.post.deleteMany()
    await prisma.profile.deleteMany()
    await prisma.user.deleteMany()


    const { users, posts } = initialData


    await prisma.user.createMany({
        data: users
    })

    const allUser = await prisma.user.findMany()

    //One post for each user
    await prisma.post.create({
        data: {
            title: posts![0].title,
            description: posts![0].description,
            author: {
                connect: {
                    id: allUser[0].id
                }
            }
        }
    })

    await prisma.post.create({
        data: {
            title: posts![1].title,
            description: posts![1].description,
            author: {
                connect: {
                    id: allUser[1].id
                }
            }
        }
    })

    await prisma.post.create({
        data: {
            title: posts![2].title,
            description: posts![2].description,
            author: {
                connect: {
                    id: allUser[2].id
                }
            }
        }
    })

    await prisma.post.create({
        data: {
            title: posts![3].title,
            description: posts![3].description,
            author: {
                connect: {
                    id: allUser[3].id
                }
            }
        }
    })





    console.log('Seed ejecutado correctamente')

}



main()