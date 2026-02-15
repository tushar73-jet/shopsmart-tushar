require('dotenv').config();
const { PrismaClient } = require("@prisma/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
const sqlite = require("better-sqlite3");

const db = new sqlite("dev.db");
const adapter = new PrismaBetterSqlite3(db, { url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
    const products = [
        {
            name: "Wireless Mouse",
            description: "Ergonomic wireless mouse with adjustable DPI.",
            price: 25.99,
            stock: 50,
        },
        {
            name: "Mechanical Keyboard",
            description: "RGB backlit mechanical keyboard with blue switches.",
            price: 79.99,
            stock: 30,
        },
        {
            name: "USB-C Hub",
            description: "7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader.",
            price: 34.99,
            stock: 100,
        },
        {
            name: "Monitor Stand",
            description: "Durable aluminum monitor stand with built-in storage.",
            price: 45.0,
            stock: 20,
        },
        {
            name: "Webcam 1080p",
            description: "Full HD webcam with built-in microphone and privacy cover.",
            price: 59.99,
            stock: 15,
        },
    ];

    console.log("Start seeding...");

    for (const product of products) {
        const createdProduct = await prisma.product.create({
            data: product,
        });
        console.log(`Created product with id: ${createdProduct.id}`);
    }

    console.log("Seeding finished.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
