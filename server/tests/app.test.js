const request = require('supertest');
const app = require('../src/app');

// Mock prisma so tests don't hit the real SQLite DB
jest.mock('../src/prismaClient', () => ({
    user: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
    product: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
}));

const prisma = require('../src/prismaClient');

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------
describe('GET /api/health', () => {
    it('should return 200 and status ok', async () => {
        const res = await request(app).get('/api/health');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status', 'ok');
    });

    it('should return a timestamp', async () => {
        const res = await request(app).get('/api/health');
        expect(res.body).toHaveProperty('timestamp');
        expect(new Date(res.body.timestamp).toString()).not.toBe('Invalid Date');
    });
});

// ---------------------------------------------------------------------------
// Users CRUD
// ---------------------------------------------------------------------------
describe('Users API', () => {
    const mockUser = { id: 1, name: 'Alice', email: 'alice@example.com' };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/users', () => {
        it('should create a user and return 201', async () => {
            prisma.user.create.mockResolvedValue(mockUser);

            const res = await request(app)
                .post('/api/users')
                .send({ name: 'Alice', email: 'alice@example.com' });

            expect(res.statusCode).toBe(201);
            expect(res.body).toMatchObject({ name: 'Alice', email: 'alice@example.com' });
        });

        it('should return 400 when creation fails', async () => {
            prisma.user.create.mockRejectedValue(new Error('DB error'));

            const res = await request(app)
                .post('/api/users')
                .send({ name: 'Bob' });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error');
        });
    });

    describe('GET /api/users', () => {
        it('should return an array of users', async () => {
            prisma.user.findMany.mockResolvedValue([mockUser]);

            const res = await request(app).get('/api/users');

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body[0]).toMatchObject(mockUser);
        });
    });

    describe('GET /api/users/:id', () => {
        it('should return a user when found', async () => {
            prisma.user.findUnique.mockResolvedValue(mockUser);

            const res = await request(app).get('/api/users/1');

            expect(res.statusCode).toBe(200);
            expect(res.body).toMatchObject(mockUser);
        });

        it('should return 404 when user is not found', async () => {
            prisma.user.findUnique.mockResolvedValue(null);

            const res = await request(app).get('/api/users/999');

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('error');
        });
    });

    describe('PUT /api/users/:id', () => {
        it('should update and return the user', async () => {
            const updated = { ...mockUser, name: 'Alice Updated' };
            prisma.user.update.mockResolvedValue(updated);

            const res = await request(app)
                .put('/api/users/1')
                .send({ name: 'Alice Updated' });

            expect(res.statusCode).toBe(200);
            expect(res.body.name).toBe('Alice Updated');
        });
    });

    describe('DELETE /api/users/:id', () => {
        it('should delete user and return 204', async () => {
            prisma.user.delete.mockResolvedValue(mockUser);

            const res = await request(app).delete('/api/users/1');

            expect(res.statusCode).toBe(204);
        });
    });
});

// ---------------------------------------------------------------------------
// Products CRUD
// ---------------------------------------------------------------------------
describe('Products API', () => {
    const mockProduct = { id: 1, name: 'Widget', price: 9.99 };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/products', () => {
        it('should create a product and return 201', async () => {
            prisma.product.create.mockResolvedValue(mockProduct);

            const res = await request(app)
                .post('/api/products')
                .send({ name: 'Widget', price: 9.99 });

            expect(res.statusCode).toBe(201);
            expect(res.body).toMatchObject(mockProduct);
        });
    });

    describe('GET /api/products', () => {
        it('should return an array of products', async () => {
            prisma.product.findMany.mockResolvedValue([mockProduct]);

            const res = await request(app).get('/api/products');

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });

    describe('GET /api/products/:id', () => {
        it('should return 404 for missing product', async () => {
            prisma.product.findUnique.mockResolvedValue(null);

            const res = await request(app).get('/api/products/999');

            expect(res.statusCode).toBe(404);
        });
    });
});
