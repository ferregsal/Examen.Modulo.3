import { ProductsController } from './products.controller';
import { NextFunction, Request, Response } from 'express';
import { vi, Mock } from 'vitest';
import { ProductCreateDTO } from './dto/products.dto.js';

vi.mock('../dto/products.dto');

const mockRepo = {
    read: vi.fn().mockResolvedValueOnce([]),
    readById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
};

describe('ProductsController', () => {
    ProductCreateDTO.parse = vi.fn();
    ProductCreateDTO.partial = vi.fn().mockReturnValue(ProductCreateDTO.parse);

    const productsController = new ProductsController(mockRepo);

    const req = {
        params: { id: '1' },
        body: {},
    } as unknown as Request;
    const res = {
        json: vi.fn(),
        status: vi.fn().mockReturnThis(),
    } as unknown as Response;
    const next = vi.fn() as NextFunction;

    const error = new Error('Error');

    test('should be defined', () => {
        expect(productsController).toBeDefined();
        expect(productsController).toBeInstanceOf(ProductsController);
    });

    describe('getAll method', () => {
        test('should call json when repo response is valid', async () => {
            await productsController.getAll(req, res, next);
            expect(mockRepo.read).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({
                results: [],
                error: '',
            });
        });

        test('should call next when repo throws an error', async () => {
            (mockRepo.read as Mock).mockRejectedValueOnce(error);
            await productsController.getAll(req, res, next);
            expect(next).toHaveBeenCalledWith(error);
        });
    });
});
