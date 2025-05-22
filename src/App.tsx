import React, { useEffect } from 'react';
import AppRoutes from './routes/app-routing.module';
import { setupIonicReact } from '@ionic/react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

// Configuración del StatusBar
const initializeStatusBar = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      // Configuración común
      await StatusBar.setOverlaysWebView({ overlay: false });
      await StatusBar.show();

      // Configuración específica por plataforma
      if (Capacitor.getPlatform() === 'ios') {
        await StatusBar.setStyle({ style: Style.Light });
        await StatusBar.setBackgroundColor({ color: '#ffffff' });
      } else if (Capacitor.getPlatform() === 'android') {
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#000000' });
      }
    } catch (error) {
      console.error('Error al configurar StatusBar:', error);
    }
  }
};

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
/* import '@ionic/react/css/palettes/dark.system.css'; */

/* Theme variables */
import './theme/variables.css';

setupIonicReact({
  mode: 'md',
  statusTap: true
});

const App: React.FC = () => {
  useEffect(() => {
    initializeStatusBar();
  }, []);

  return <AppRoutes />;
};

export default App;
