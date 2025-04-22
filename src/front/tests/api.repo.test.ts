import { describe, test, expect, vi } from 'vitest';
import { ApiRepo } from '../services/api.repo';
import { Product } from '../types/product';
import { Category } from '../types/category';

const mockProducts: Product[] = [
    {
        id: 1,
        name: 'Portátil MAC',
        description: 'Apple computer',
        category: 'computer',
        price: 1500,
        hasPromo: false,
    },
    {
        id: 2,
        name: 'Smartphone Xiaomi',
        description: 'Xiaomi g34',
        category: 'mobile',
        price: 400,
        hasPromo: true,
    },
];

global.fetch = vi.fn();

describe('ApiRepo - Test con manejo de errores', () => {
    const apiRepo = new ApiRepo();

    test('Debe obtener productos correctamente', async () => {
        vi.mocked(fetch).mockResolvedValue({
            ok: true,
            json: async () => mockProducts,
        } as Response);

        const products = await apiRepo.getProducts();
        expect(products).toEqual(mockProducts);
    });

    test('Debe lanzar error si la API falla en getProducts', async () => {
        vi.mocked(fetch).mockResolvedValue({
            ok: false,
            status: 500,
            statusText: 'Server Error',
        } as Response);

        await expect(apiRepo.getProducts()).rejects.toThrow('500 Server Error');
    });

    test('Debe crear un producto correctamente', async () => {
        const newProduct = {
            name: 'Tablet',
            category: 'mobile' as Category,
            price: 600,
            hasPromo: false,
        };

        vi.mocked(fetch).mockResolvedValue({
            ok: true,
            json: async () => ({ id: 3, ...newProduct }),
        } as Response);

        const createdProduct = await apiRepo.createProduct(newProduct);
        expect(createdProduct).toEqual({ id: 3, ...newProduct });
    });

    test('Debe lanzar error si la API falla en createProduct', async () => {
        vi.mocked(fetch).mockResolvedValue({
            ok: false,
            status: 400,
            statusText: 'Bad Request',
        } as Response);

        await expect(apiRepo.createProduct({ name: 'Tablet' })).rejects.toThrow(
            '400 Bad Request',
        );
    });

    test('Debe actualizar un producto correctamente', async () => {
        const updatedProduct = { price: 1000 };

        vi.mocked(fetch).mockResolvedValue({
            ok: true,
            json: async () => ({ ...mockProducts[0], ...updatedProduct }),
        } as Response);

        const result = await apiRepo.updateProduct(1, updatedProduct);
        expect(result.price).toBe(1000);
    });

    test('Debe lanzar error si la API falla en updateProduct', async () => {
        vi.mocked(fetch).mockResolvedValue({
            ok: false,
            status: 404,
            statusText: 'Not Found',
        } as Response);

        await expect(
            apiRepo.updateProduct(999, { price: 1000 }),
        ).rejects.toThrow('404 Not Found');
    });

    test('Debe eliminar un producto correctamente', async () => {
        vi.mocked(fetch).mockResolvedValue({
            ok: true,
            json: async () => mockProducts.filter((p) => p.id !== 1),
        } as Response);

        const remainingProducts = await apiRepo.deleteProduct(1);
        expect(remainingProducts).toHaveLength(1);
        expect(remainingProducts[0].id).toBe(2);
    });

    test('Debe lanzar error si la API falla en deleteProduct', async () => {
        vi.mocked(fetch).mockResolvedValue({
            ok: false,
            status: 500,
            statusText: 'Internal Server Error',
        } as Response);

        await expect(apiRepo.deleteProduct(1)).rejects.toThrow(
            '500 Internal Server Error',
        );
    });
});
