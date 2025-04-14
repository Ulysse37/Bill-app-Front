"use strict";

var _dom = require("@testing-library/dom");

var _userEvent = _interopRequireDefault(require("@testing-library/user-event"));

var _NewBillUI = _interopRequireDefault(require("../views/NewBillUI.js"));

var _NewBill = _interopRequireDefault(require("../containers/NewBill.js"));

var _localStorage = require("../__mocks__/localStorage.js");

var _routes = require("../constants/routes");

var _Router = _interopRequireDefault(require("../app/Router"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * @jest-environment jsdom
 */
describe("Given I am connected as an employee", function () {
  describe("When I am on NewBill Page", function () {
    /* describe("When I try to upload a wrong file type", () => {
      test("it should display an alert", () => {
      })
    }) */
    describe("When the form is correctly filled", function () {
      test("It is correctly submitted", function () {
        Object.defineProperty(window, 'localStorage', {
          value: _localStorage.localStorageMock
        });
        window.localStorage.setItem('user', JSON.stringify({
          type: 'employee'
        }));
        var html = (0, _NewBillUI["default"])();
        var container = document.createElement('div');
        container.innerHTML = html;
        document.body.appendChild(container);
        var expenseType = container.querySelector('[data-testid="expense-type"]');

        _dom.fireEvent.change(expenseType, {
          target: {
            value: 'Transports'
          }
        });

        var expenseName = container.querySelector('[data-testid="expense-name"]');

        _dom.fireEvent.change(expenseName, {
          target: {
            value: 'Vol Dubaï Tokyo'
          }
        });

        var expenseDate = container.querySelector('[data-testid="datepicker"]');

        _dom.fireEvent.change(expenseDate, {
          target: {
            value: '03/04/2025'
          }
        });

        var expenseAmount = container.querySelector('[data-testid="amount"]');

        _dom.fireEvent.change(expenseAmount, {
          target: {
            value: '200'
          }
        });

        var expenseVat = container.querySelector('[data-testid="vat"]');

        _dom.fireEvent.change(expenseVat, {
          target: {
            value: '70'
          }
        });

        var expensePct = container.querySelector('[data-testid="pct"]');

        _dom.fireEvent.change(expensePct, {
          target: {
            value: '20'
          }
        });

        var expenseCommentary = container.querySelector('[data-testid="commentary"]');

        _dom.fireEvent.change(expenseCommentary, {
          target: {
            value: 'Test Commentaire'
          }
        });

        var expenseFile = container.querySelector('[data-testid="file"]');

        _dom.fireEvent.change(expenseFile, {
          target: {
            files: ['file.jpg']
          }
        });

        var form = container.querySelector('[data-testid="form-new-bill"]');
        var handleSubmit = jest.fn(container.handleSubmit);
        form.addEventListener('submit', handleSubmit);

        _dom.fireEvent.submit(form);

        expect(handleSubmit).toHaveBeenCalled();
      });
      test("Then, I should be redirected to the Bills page", function () {
        var onNavigate = function onNavigate(pathname) {
          document.body.innerHTML = (0, _routes.ROUTES)({
            pathname: pathname
          });
        };

        Object.defineProperty(window, 'localStorage', {
          value: _localStorage.localStorageMock
        });
        window.localStorage.setItem('user', JSON.stringify({
          type: 'employee'
        }));
        var newBillsInstance = new _NewBill["default"]({
          document: document,
          onNavigate: onNavigate,
          localStorage: localStorage
        });
        var handleSubmitNewBill = jest.fn(newBillsInstance.handleSubmit);

        var form = _dom.screen.getByTestId('form-new-bill');

        form.addEventListener('submit', handleSubmitNewBill);

        _dom.fireEvent.submit(form);

        expect(handleSubmitNewBill).toHaveBeenCalled();
        expect(_dom.screen.getByText('Mes notes de frais')).toBeTruthy();
      });
    });
    describe("When the file type of the image is not supported", function () {
      test("It should display an alert", function () {
        Object.defineProperty(window, 'localStorage', {
          value: _localStorage.localStorageMock
        });
        window.localStorage.setItem('user', JSON.stringify({
          type: 'employee',
          email: 'test@email.com'
        }));
        var html = (0, _NewBillUI["default"])();
        document.body.innerHTML = html;
        var onNavigate = jest.fn();
        var store = null;
        var newBill = new _NewBill["default"]({
          document: document,
          onNavigate: onNavigate,
          store: store,
          localStorage: window.localStorage
        });
        window.alert = jest.fn(); //mock l'alert de handleChangeFile

        var fileInput = _dom.screen.getByTestId('file'); // va chercher l'input où l'utilisateur upload le fichier
        // crée un fichier avec mauvais format


        var file = new File(["dummy content"], "test-file.pdf", {
          type: "application/pdf"
        });

        _userEvent["default"].upload(fileInput, file);

        expect(window.alert).toHaveBeenCalledWith('Seuls les fichiers jpg, jpeg et png sont acceptés'); // vérifie que l'alerte est bien déclenchée
      });
    });
  });
});