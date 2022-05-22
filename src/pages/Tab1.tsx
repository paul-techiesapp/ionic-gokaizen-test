import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { BLE } from "@awesome-cordova-plugins/ble";
import ExploreContainer from "../components/ExploreContainer";
import "./Tab1.css";
import { useEffect, useState } from "react";
import { connect } from "http2";
// import ConvertString from "convert-string";

const Tab1: React.FC = () => {
  const [devices, setDevices] = useState<any[]>([]);
  const convertStringToBytes = (str: string) => {
    const myBuffer: any = [];
    const buffer = new Buffer(str, "utf16le");
    for (var i = 0; i < buffer.length; i++) {
      myBuffer.push(buffer[i]);
    }

    return myBuffer;
  };
  const connectBle = async (deviceId: string) => {
    try {
      BLE.connect(deviceId).subscribe(async (e) => {
        const res = await BLE.requestMtu(deviceId, 400);
        console.log(e);
        BLE.writeWithoutResponse(
          deviceId,
          "f000ffc0-0451-4000-b000-000000000000",
          "f000ffc1-0451-4000-b000-000000000000",
          convertStringToBytes("5AA5AA00130000691D0D0A")
        );
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
  // useEffect(() => {
  //   // check();
  // }, []);

  console.log("devicess", devices);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>
        {/* <ExploreContainer name="Tab 1 page" /> */}
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
    </IonPage>
  );
};

export default Tab1;
