const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
    fullscreen: true, // Set the window to fullscreen
    autoHideMenuBar: true, // Hide the menu bar
    toolbar: false, // Hide the toolbar
  });

  // Load the URL from the server running at localhost:3000
  win.loadURL('http://localhost:3000');

  // Launch the server.mjs file
  const serverPath = path.join(__dirname, 'server.mjs');
  const serverProcess = spawn('node', [serverPath]);

  // Log server output to the console
  serverProcess.stdout.on('data', (data) => {
    console.log(`Server output: ${data}`);
  });

  // Handle server errors
  serverProcess.on('error', (err) => {
    console.error('Error starting server:', err);
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});