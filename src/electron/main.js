const { app, BrowserWindow, ipcMain, Notification } = require("electron");

const path = require("path");

const isDev = !app.packaged;

const URL = isDev
  ? "http://localhost:3000"
  : `file://${path.join(__dirname, "../../build/index.html")}`;

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadURL(URL);

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
};

ipcMain.on("notify", (_, message) => {
  // new Notification({ title: "Notification", body: message }).show();
  new Notification({
    title: "Notification",
    body: message, // toastXml: `
    toastXml: `
    <toast launch="myapp:action=navigate&amp;contentId=351" activationType="protocol">
      <visual>
          <binding template="ToastGeneric">
              <text>Hello world</text>
              <text>Hey, wanna dress up as wizards and ride around on hoverboards?</text>
              <image placement='appLogoOverride' src='https://picsum.photos/48?image=883' hint-crop='circle'/>
          </binding>
      </visual>
      <actions>
          <action
              content="See more details"
              arguments="myapp:action=viewDetails&amp;contentId=351"
              activationType="protocol"/>

          <action
              content="Remind me later"
              arguments="myapp:action=remindlater&amp;contentId=351"
              activationType="protocol"/>
      </actions>
    </toast>`,
  }).show();
});

app.on("ready", createWindow);

app.on("window-all-closed", () => process.platform !== "darwin" && app.quit());

app.on("activate", () => mainWindow === null && createWindow());
