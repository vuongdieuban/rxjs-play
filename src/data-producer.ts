import { Subject } from 'rxjs';
import { BarcodeScannerClosed, BarcodeScannerOpened } from './events';

export interface MachineEvent {
  name: string;
  data: any;
}

export class DataProducer {
  private static dataSource = new Subject<MachineEvent>();

  public static get data$() {
    return this.dataSource.asObservable();
  }

  public static openBarcodeScanner() {
    console.log('Calling machine to open barcode scanner....');
    // Calling to the machine (VbObject.Show)
    setTimeout(() => {
      this.showMessage({
        name: BarcodeScannerOpened,
        data: 'Open Success',
      });
    }, 1000);
  }

  public static closeBarcodeScanner() {
    console.log('Calling machine to close barcode scanner....');
    setTimeout(() => {
      this.showMessage({
        name: BarcodeScannerClosed,
        data: 'Close Success',
      });
    }, 1000);
  }

  private static showMessage(event: MachineEvent) {
    // In our atm, we will listen to the window.ShowMessage here and next the data out.
    // window.ShowMessage = (e) => dataSource.next(e)
    // No need to filter, the function itself will filter the events that it needs.
    this.dataSource.next(event);
  }
}
