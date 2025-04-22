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
