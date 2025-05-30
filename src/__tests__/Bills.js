/**
 * @jest-environment jsdom
 */

import {screen, waitFor, fireEvent, getByTestId } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import Bills from "../containers/Bills.js"
import userEvent from '@testing-library/user-event';
import router from "../app/Router.js";
import mockStore from "../__mocks__/store";

// mock le store 
jest.mock("../app/store", () => { // remplace le store du /app par le mock de __mocks__
  const actual = jest.requireActual("../__mocks__/store"); // importe le mock du store de __mocks__
  return {
    __esModule: true, // indique que ce module utilise la syntaxe ES6 (car il utilise export default)
    default: actual.default // renvoie le mock du store de ___mocks__
  };
});


describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      expect(windowIcon.className).toContain('active-icon'); // ajout expect 

    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML);
      const chrono = (a, b) => new Date(a) - new Date(b);
      const datesSorted = [...dates].sort(chrono);
      expect(dates).toEqual(datesSorted);
    })
    // Ajout des nouveaux test 
    describe('When I click on the icon eye', () => {
      test('A modal should open', () => {
        Object.defineProperty(window, 'localStorage', { value: localStorageMock }) // simule scénario où l'utilisateur est connecté en employé
        window.localStorage.setItem('user', JSON.stringify({ 
          type: 'Employee'    
        }));
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        };
        const html = BillsUI( { data: bills } );
        document.body.innerHTML = html;
        const store = null;
        const billsInstance = new Bills({ document, onNavigate, store, bills, localStorage: window.localStorage });
        const handleClickIconEye = jest.fn(billsInstance.handleClickIconEye);
        const eyes = screen.getAllByTestId('icon-eye');
        const modaleFile = document.getElementById('modaleFile');
        $.fn.modal = jest.fn(); // mock la fonction modal de jQuery car jQuery pas dispo de base dans l'environnement de test
        const eye = eyes[0]; // cible la 1ere icone pour afficher la modale
        eye.addEventListener('click', handleClickIconEye(eye));
        userEvent.click(eye);

        expect(handleClickIconEye).toHaveBeenCalled(); // La fonction est bien appelée
        expect(modaleFile).toBeTruthy(); // La modale s'affiche bien
      })
    })
    describe('When I click on the add a new bill button', () => {
      test('Then, I should be sent the new bill page', () => {
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        };
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'employee'
        }));
        const billsInstance = new Bills({ document, onNavigate, localStorage });
        const handleClickNewBill = jest.fn(billsInstance.handleClickNewBill)
        const newBillButton = screen.getByTestId('btn-new-bill');
        newBillButton.addEventListener('click', handleClickNewBill);
        userEvent.click(newBillButton);
        expect(handleClickNewBill).toHaveBeenCalled();
        expect(screen.getByText('Envoyer une note de frais')).toBeTruthy();
      })
    })
  })
})

// test d'intégration GET Bills
describe("Given I am a user connected as an employee", () => {
  describe("When I navigate to Bills", () => {
    test("fetches bills from mock API GET and displays them", async () => {
      jest.spyOn(mockStore, "bills"); // espionne les appels au store sur bills
      
      Object.defineProperty(window, 'localStorage', { value: localStorageMock });
      window.localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));

      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.innerHTML = '';
      document.body.appendChild(root);

      router();
      window.onNavigate(ROUTES_PATH.Bills);

      await waitFor(() => screen.getByText('Mes notes de frais')); // "Mes notes de frais" apparaît bien

      expect(mockStore.bills).toHaveBeenCalled(); //store.bills().list() a bien été appelé 

      const rows = screen.getAllByRole('row'); // récupère les lignes du tableau
      expect(rows.length).toBeGreaterThan(1); // il y a plus d'un ligne dans le tableau
    });
  });
  describe("When an error occurs on API", () => {
    beforeEach(() => { // avant chacun des 2 test d'erreur
      jest.spyOn(mockStore, "bills");
      Object.defineProperty(
        window,
        "localStorage",
        { value: localStorageMock }
      );
      window.localStorage.setItem("user", JSON.stringify({
        type: "Employee",
        email: "a@a" 
      }));
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.innerHTML = "";
      document.body.appendChild(root);
      router();
    });

    test("fetches bills from an API and fails with 404 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list: () => Promise.reject(new Error("Erreur 404")), // simule erreur 404
        };
      });

      window.onNavigate(ROUTES_PATH.Bills);
      await new Promise(process.nextTick); // await pour attendre l'erreur
      const message = await screen.getByText(/Erreur 404/) // cherche le message d'erreur 
      expect(message).toBeTruthy() // le message est bien trouvé
    });

    test("fetches messages from an API and fails with 500 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list: () => Promise.reject(new Error("Erreur 500")), // simule erreur 500
        };
      });

      window.onNavigate(ROUTES_PATH.Bills);
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    });
  });
});
