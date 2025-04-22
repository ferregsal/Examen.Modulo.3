import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { screen, fireEvent } from '@testing-library/dom';
import { createFormAdd } from '../components/form.add';

describe('createFormAdd - Formulario de añadir producto', () => {
    test('Debe renderizar el formulario', () => {
        document.body.innerHTML = '<div id="root"></div>';
        const formElement = createFormAdd([], '#root');

        expect(formElement).toBeInstanceOf(HTMLFormElement);
        expect(screen.getByLabelText('add_form')).toBeInTheDocument();
    });

    test('Debe permitir escribir en los campos de entrada', () => {
        document.body.innerHTML = '<div id="root"></div>';
        createFormAdd([], '#root');

        const nameInput = screen.getByLabelText('Name') as HTMLInputElement;
        fireEvent.change(nameInput, { target: { value: 'Producto Test' } });

        expect(nameInput.value).toBe('Producto Test');
    });

    test('Debe manejar el evento submit correctamente', () => {
        document.body.innerHTML = '<div id="root"></div>';
        const formElement = createFormAdd([], '#root');

        // Espiar console.log
        const consoleSpy = vi
            .spyOn(console, 'log')
            .mockImplementation(() => {});

        fireEvent.submit(formElement);

        expect(consoleSpy).toHaveBeenCalledWith(
            'Form submitted:',
            expect.objectContaining({
                id: expect.any(Number),
                name: expect.any(String),
                description: expect.any(String),
                category: expect.any(String),
                price: expect.any(Number),
                hasPromo: expect.any(Boolean),
            }),
        );

        consoleSpy.mockRestore();
    });
});
