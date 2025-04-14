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
    /* describe("When I try to upload a wrong file type", () => {
      test("it should display an alert", () => {
      })
    }) */
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
        fireEvent.submit(form);
        expect(handleSubmitNewBill).toHaveBeenCalled();
        expect(screen.getByText('Mes notes de frais')).toBeTruthy();
      })
    })
    describe("When the file type of the image uploaded is not supported", () => {
      test("It should display an alert", () => {
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'employee',
          email: 'test@email.com'
        }));
        const html = NewBillUI();
        document.body.innerHTML = html;
    
        const onNavigate = jest.fn();
        const store = null;
        const newBill = new NewBill({ document, onNavigate, store, localStorage: window.localStorage });
        window.alert = jest.fn(); //mock l'alert de handleChangeFile
    
        const fileInput = screen.getByTestId('file'); // va chercher l'input où l'utilisateur upload le fichier
        // crée un fichier avec mauvais format
        const file = new File(["dummy content"], "test-file.pdf", { type: "application/pdf" });
        userEvent.upload(fileInput, file);
    
        expect(window.alert).toHaveBeenCalledWith('Seuls les fichiers jpg, jpeg et png sont acceptés'); // vérifie que l'alerte est bien déclenchée
      })
    })
    // Test POST pour upload le file 
    describe("When I upload a correct file type", () => {
      test("Then it should update the bill with the uploaded file", async () => {
        // Mock store
        const mockCreate = jest.fn().mockResolvedValue({}); //
        const mockStore = { // Mock le store
          bills: () => ({
            create: mockCreate // renvoie bien une promesse résolue
          })
        };
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'employee',
          email: 'test@email.com'
        }));
        document.body.innerHTML = NewBillUI();
        const onNavigate = jest.fn();
        // nouvelle instance de NewBill avec tous les mocks
        const newBill = new NewBill({ document, onNavigate, store: mockStore, localStorage: window.localStorage });
  
        const file = new File(["image"], "image.jpg", { type: "image/jpg" }); // Simule un un fichier avec un format valide
        const fileInput = screen.getByTestId("file"); // va chercher l'input où l'utilisateur upload le fichier

        Object.defineProperty(fileInput, 'value', {
          value: 'C:\\fakepath\\image.jpg', // value de l'input que handleChangeFile va lire
          writable: true
        });
  
        fireEvent.change(fileInput, { // déclenche l'événement handleChangeFile au change de l'input
          target: {
            files: [file],
          }
        });
  
        await new Promise(process.nextTick); // await pour que la promesse se termine 
  
        expect(mockCreate).toHaveBeenCalled(); // le create() a bien été appelé 
        expect(newBill.fileName).toBe("image.jpg"); // le fileName a bien été mis à jour avec le fichier donné
      })
    })
  })
})
