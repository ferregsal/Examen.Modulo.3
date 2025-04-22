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
    describe('getById method', () => {
        test('should call json when repo response is valid', async () => {
            (mockRepo.readById as Mock).mockResolvedValueOnce({});
            await productsController.getById(req, res, next);
            expect(mockRepo.readById).toHaveBeenCalledWith('1');
            expect(res.json).toHaveBeenCalledWith({
                results: [{}],
                error: '',
            });
        });

        test('should call next when repo throws an error', async () => {
            (mockRepo.readById as Mock).mockRejectedValueOnce(error);
            await productsController.getById(req, res, next);
            expect(next).toHaveBeenCalledWith(error);
        });
    });
    describe('create method', () => {
        test('should call json when repo response is valid', async () => {
            const newProduct = { id: 2, name: 'Producto 2' };
            req.body = { name: 'Producto 2' };
            (mockRepo.create as Mock).mockResolvedValueOnce(newProduct);

            await productsController.create(req, res, next);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                results: [newProduct],
                error: '',
            });
        });

        test('should call next when repo throws an error', async () => {
            (mockRepo.create as Mock).mockRejectedValueOnce(error);
            await productsController.create(req, res, next);
            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('update method', () => {
        test('should call json when repo response is valid', async () => {
            const updatedProduct = { id: 1, name: 'Producto Actualizado' };
            req.body = { name: 'Producto Actualizado' };
            (mockRepo.update as Mock).mockResolvedValueOnce(updatedProduct);

            await productsController.update(req, res, next);

            expect(res.json).toHaveBeenCalledWith({
                results: [updatedProduct],
                error: '',
            });
        });

        test('should call next when repo throws an error', async () => {
            (mockRepo.update as Mock).mockRejectedValueOnce(error);
            await productsController.update(req, res, next);
            expect(next).toHaveBeenCalledWith(error);
        });
    });
});
