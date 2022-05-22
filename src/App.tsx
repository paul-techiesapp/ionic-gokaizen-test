import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { ellipse, square, triangle } from "ionicons/icons";
import Tab1 from "./pages/Tab1";
import Tab2 from "./pages/Tab2";
import Tab3 from "./pages/Tab3";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import { BLE } from "@awesome-cordova-plugins/ble";
import { useState } from "react";
const { stringToBytes } = require("convert-string");
setupIonicReact();

const App: React.FC = () => {
  const [devices, setDevices] = useState<any[]>([]);

  const connectBle = async (deviceId: string) => {
    try {
      BLE.connect(deviceId).subscribe(async (e) => {
        const res = await BLE.requestMtu(deviceId, 400);
        console.log(e);
        const writeRes = await BLE.writeWithoutResponse(
          deviceId,
          "f000ffc0-0451-4000-b000-000000000000",
          "f000ffc1-0451-4000-b000-000000000000",
          stringToBytes("5AA5AA00130000691D0D0A")
        );
        console.log("writeRes", writeRes);
      });
    } catch (e) {
      console.log("errors", e);
    }
  };
  const scan = async () => {
    try {
      console.log("checkk");
      BLE.scan([], 4).subscribe((peripheral) => {
        if (peripheral && peripheral.name) {
          console.log(peripheral);
          const list = devices;
          list.push(peripheral);
          // console.log("list");
          setDevices(list);
        }
      });
      // console.log(res._subscribe);
    } catch (e) {
      console.log(e);
    }
  };
  console.log("device", devices);
  return (
    <IonApp>
      <IonContent>
        <IonButton onClick={() => scan()}>Scan</IonButton>

        {/*-- List of Text Items --*/}
        <IonList>
          {devices.map((device, index) => (
            <IonItemSliding key={`device-${index}`}>
              <IonItem>
                <IonLabel>{device.name}</IonLabel>
              </IonItem>
              <IonItemOptions side="end">
                <IonItemOption onClick={() => connectBle(device.id)}>
                  connect
                </IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
          ))}
        </IonList>
      </IonContent>
    </IonApp>
  );
};

export default App;
