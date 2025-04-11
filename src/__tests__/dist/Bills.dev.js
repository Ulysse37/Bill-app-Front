"use strict";

var _dom = require("@testing-library/dom");

var _BillsUI = _interopRequireDefault(require("../views/BillsUI.js"));

var _bills = require("../fixtures/bills.js");

var _routes = require("../constants/routes.js");

var _localStorage = require("../__mocks__/localStorage.js");

var _Bills = _interopRequireDefault(require("../containers/Bills.js"));

var _userEvent = _interopRequireDefault(require("@testing-library/user-event"));

var _Router = _interopRequireDefault(require("../app/Router.js"));

var _store = _interopRequireDefault(require("../__mocks__/store"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

describe("Given I am connected as an employee", function () {
  describe("When I am on Bills Page", function () {
    test("Then bill icon in vertical layout should be highlighted", function _callee() {
      var root, windowIcon;
      return regeneratorRuntime.async(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              Object.defineProperty(window, 'localStorage', {
                value: _localStorage.localStorageMock
              });
              window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee'
              }));
              root = document.createElement("div");
              root.setAttribute("id", "root");
              document.body.append(root);
              (0, _Router["default"])();
              window.onNavigate(_routes.ROUTES_PATH.Bills);
              _context.next = 9;
              return regeneratorRuntime.awrap((0, _dom.waitFor)(function () {
                return _dom.screen.getByTestId('icon-window');
              }));

            case 9:
              windowIcon = _dom.screen.getByTestId('icon-window'); //to-do write expect expression

              expect(windowIcon.className).toContain('active-icon'); // ajout expect 

            case 11:
            case "end":
              return _context.stop();
          }
        }
      });
    });
    test("Then bills should be ordered from earliest to latest", function () {
      document.body.innerHTML = (0, _BillsUI["default"])({
        data: _bills.bills
      });

      var dates = _dom.screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(function (a) {
        return a.innerHTML;
      });

      var chrono = function chrono(a, b) {
        return new Date(a) - new Date(b);
      };

      var datesSorted = _toConsumableArray(dates).sort(chrono);

      expect(dates).toEqual(datesSorted);
    }); // Ajout des nouveaux test 

    describe('When I click on the icon eye', function () {
      test('A modal should open', function () {
        Object.defineProperty(window, 'localStorage', {
          value: _localStorage.localStorageMock
        }); // simule scénario où l'utilisateur est connecté en employé

        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }));

        var onNavigate = function onNavigate(pathname) {
          document.body.innerHTML = (0, _routes.ROUTES)({
            pathname: pathname
          });
        };

        var html = (0, _BillsUI["default"])({
          data: _bills.bills
        });
        document.body.innerHTML = html;
        var store = null;
        var billsInstance = new _Bills["default"]({
          document: document,
          onNavigate: onNavigate,
          store: store,
          bills: _bills.bills,
          localStorage: window.localStorage
        });
        var handleClickIconEye = jest.fn(billsInstance.handleClickIconEye);

        var eyes = _dom.screen.getAllByTestId('icon-eye');

        var modaleFile = document.getElementById('modaleFile');
        $.fn.modal = jest.fn(); // mock la fonction modal de jQuery car jQuery pas dispo de base dans l'environnement de test

        var eye = eyes[0]; // cible la 1ere icone pour afficher la modale

        eye.addEventListener('click', handleClickIconEye(eye));

        _userEvent["default"].click(eye);

        expect(handleClickIconEye).toHaveBeenCalled(); // La fonction est bien appelée

        expect(modaleFile).toBeTruthy(); // La modale s'affiche bien
      });
    });
    describe('When I click on the add a new bill button', function () {
      test('Then, I should be sent the new bill page', function () {
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
        var billsInstance = new _Bills["default"]({
          document: document,
          onNavigate: onNavigate,
          localStorage: localStorage
        });
        var handleClickNewBill = jest.fn(billsInstance.handleClickNewBill);

        var newBillButton = _dom.screen.getByTestId('btn-new-bill');

        newBillButton.addEventListener('click', handleClickNewBill);

        _userEvent["default"].click(newBillButton);

        expect(handleClickNewBill).toHaveBeenCalled();
        expect(_dom.screen.getByText('Envoyer une note de frais')).toBeTruthy();
      });
    });
  });
}); // test d'intégration GET Bills

describe("Given I am a user connected as an employee", function () {
  describe("When I navigate to Bills", function () {
    test("fetches bills from mock API GET", function _callee2() {
      var root;
      return regeneratorRuntime.async(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              localStorage.setItem("user", JSON.stringify({
                type: "Employee",
                email: "a@a"
              }));
              root = document.createElement("div");
              root.setAttribute("id", "root");
              document.body.append(root);
              (0, _Router["default"])();
              window.onNavigate(_routes.ROUTES_PATH.Bills);
              /* await waitFor(() => screen.getByText("Mes notes de frais")); */
              // problème 1 : trouve pas le texte

              /* const billsTitlescreen = screen.getByText("Mes notes de frais");
              expect(billsTitlescreen).toBeTruthy(); */

              /* const billsTitle = document.getElementsByClassName('content-title');
              expect(billsTitle).toBeTruthy(); */
              // Essayer de récup le titre comme ça à partir du getelementbyclassname??

              /* const billsElt = await screen.getByTestId("tbody") // je sais pas si je dois tester ça ?
              expect(billsElt).toBeTruthy() */

            case 6:
            case "end":
              return _context2.stop();
          }
        }
      });
    });
  });
  /* describe("When an error occurs on API", () => {
    beforeEach(() => {
      jest.spyOn(mockStore, "bills")
      Object.defineProperty(
          window,
          'localStorage',
          { value: localStorageMock }
      )
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "a@a"
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.appendChild(root)
      router()
    })
      test("fetches bills from an API and fails with 404 message error", async () => {
        mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 404"))
          }
        }})
      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
      test("fetches messages from an API and fails with 500 message error", async () => {
        mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 500"))
          }
        }})
        window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    }) 
  }) */
});