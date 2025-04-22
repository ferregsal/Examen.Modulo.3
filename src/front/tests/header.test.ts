import { describe, test, expect } from 'vitest';
import { createHeader } from '../components/header';
import { screen } from '@testing-library/dom';

describe('createHeader function', () => {
    test('Debe insertar el Header en el DOM', () => {
        document.body.innerHTML = '<div id="root"></div>';
        const headerElement = createHeader('#root');

        expect(headerElement).toBeInstanceOf(HTMLElement);
        expect(screen.getByRole('banner')).not.toBeNull();
    });

    test('Debe contener el título Productos', () => {
        document.body.innerHTML = '<div id="root"></div>';
        createHeader('#root');

        expect(screen.getByText('Productos')).not.toBeNull();
    });

    test('El botón de navegación debe tener el aria-expanded correcto', () => {
        document.body.innerHTML = '<div id="root"></div>';
        createHeader('#root');

        const button = screen.getByRole('button', { name: 'Add' });
        expect(button.getAttribute('aria-expanded')).toBe('false');
    });
});
