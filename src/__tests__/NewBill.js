/**
 * @jest-environment jsdom
 */

import { fireEvent, getByTestId, screen } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import router from "../app/Router"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    describe("When the form is correctly filled", () => {
      test("It is correctly submitted", () => {
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'employee'
        }));

        const html = NewBillUI();
        const container = document.createElement('div');
        container.innerHTML = html;
        document.body.appendChild(container);
        
        const expenseType = container.querySelector('[data-testid="expense-type"]');
        fireEvent.change(expenseType, { target: { value: 'Transports' } });

        const expenseName = container.querySelector('[data-testid="expense-name"]');
        fireEvent.change(expenseName, { target: { value: 'Vol Dubaï Tokyo' } });

        const expenseDate = container.querySelector('[data-testid="datepicker"]');
        fireEvent.change(expenseDate, { target: { value: '03/04/2025' } });

        const expenseAmount = container.querySelector('[data-testid="amount"]');
        fireEvent.change(expenseAmount, { target: { value: '200' } });

        const expenseVat = container.querySelector('[data-testid="vat"]');
        fireEvent.change(expenseVat, { target: { value: '70' } });

        const expensePct = container.querySelector('[data-testid="pct"]');
        fireEvent.change(expensePct, { target: { value: '20' } });

        const expenseCommentary = container.querySelector('[data-testid="commentary"]');
        fireEvent.change(expenseCommentary, { target: { value: 'Test Commentaire' } });

        const expenseFile = container.querySelector('[data-testid="file"]');
        fireEvent.change(expenseFile, { target: { files: ['file.jpg'] } });

        const form = container.querySelector('[data-testid="form-new-bill"]');
        const handleSubmit = jest.fn(container.handleSubmit);
        form.addEventListener('submit', handleSubmit);
        fireEvent.submit(form);
        expect(handleSubmit).toHaveBeenCalled();
      })
      
      test("Then, I should be redirected to the Bills page", () => {
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        };
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'employee'
        }));
        const newBillsInstance = new NewBill({ document, onNavigate, localStorage });
        const handleSubmitNewBill = jest.fn(newBillsInstance.handleSubmit)
        const form = screen.getByTestId('form-new-bill');
        form.addEventListener('submit', handleSubmitNewBill);
        /* userEvent.click(form); */
        fireEvent.submit(form);
        expect(handleClickNewBill).toHaveBeenCalled();
        expect(screen.getByText('Mes notes de frais ')).toBeTruthy();
      })
    })
  })
})
