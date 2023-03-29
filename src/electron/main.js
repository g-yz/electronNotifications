const {
  app,
  BrowserWindow,
  ipcMain,
  Notification,
  nativeImage,
} = require("electron");

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
      nodeIntegration: true,
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
    icon: "https://upload.wikimedia.org/wikipedia/commons/6/63/Icon_Bird_512x512.png",
    // icon: path.join(__dirname, "logo512.png"),
    // icon: "https://freepngimg.com/static/img/twitter.png",
    // toastXml: `
    // <toast launch="myapp:action=navigate&amp;contentId=351" activationType="protocol">
    //   <visual>
    //       <binding template="ToastGeneric">
    //           <text>Hello world</text>
    //           <text>Hey, wanna dress up as wizards and ride around on hoverboards?</text>
    //           <image placement='appLogoOverride' src="${path.join(
    //             __dirname,
    //             "Icon_Bird_512x512.png"
    //           )}" hint-crop='circle'/>
    //       </binding>
    //   </visual>
    //   <actions>
    //       <action
    //           content="See more details"
    //           arguments="myapp:action=viewDetails&amp;contentId=351"
    //           activationType="protocol"/>

    //       <action
    //           content="Remind me later"
    //           arguments="myapp:action=remindlater&amp;contentId=351"
    //           activationType="protocol"/>
    //   </actions>
    // </toast>`,
  }).show();
});

if (process.platform === "win32") {
  const iconPath = "https://picsum.photos/48?image=883";
  let icon = nativeImage.createFromPath(iconPath);
  app.setAppUserModelId(app.name, icon);
}

app.on("ready", createWindow);

app.on("window-all-closed", () => process.platform !== "darwin" && app.quit());

app.on("activate", () => mainWindow === null && createWindow());
