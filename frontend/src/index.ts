import { app, BrowserWindow, Menu, MenuItem } from "electron";
import contextMenu from "electron-context-menu";
import { API } from "aws-amplify";

// This allows TypeScript to pick up the magic constant that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

const menu = new Menu();

menu.append(
  new MenuItem({
    label: "Hello",
    submenu: [
      {
        role: "help",
        accelerator: process.platform === "darwin" ? "Cmd+S" : "Ctrl+S",
        click: (menuItem, browserWindow, event) => {
          console.log(browserWindow);
        },
      },
    ],
  })
);

Menu.setApplicationMenu(menu);

contextMenu({
  prepend: (defaultActions, parameters, browserWindow) => [
    {
      label: "Convert to Definition",
      // Only show it when right-clicking text
      visible: parameters.selectionText.trim().length > 0,
      click: () => {
        console.log(parameters.selectionText);
      },
    },
    {
      label: "View Definitions",
      visible: parameters.selectionText.trim().length > 0,
      click: () => {
        console.log(parameters.selectionText);
      },
    },
  ],
});
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  // if (process.platform !== "darwin") {
  app.quit();
  // }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
