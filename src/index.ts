import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { BarcodeScannerClosed, BarcodeScannerOpened } from './events';
import { MachineEvent, DataProducer } from './data-producer';

class BarcodeScanner {
  public open(): Observable<MachineEvent> {
    return new Observable(observer => {
      const sub = DataProducer.data$.subscribe(e => {
        if (e.name === BarcodeScannerOpened) {
          observer.next(e);
        }
      });
      DataProducer.openBarcodeScanner();
      return () => sub.unsubscribe();
    });
  }

  public close(): Observable<MachineEvent> {
    return new Observable(observer => {
      const sub = DataProducer.data$.subscribe(e => {
        if (e.name === BarcodeScannerClosed) {
          observer.next(e);
        }
      });
      DataProducer.closeBarcodeScanner();
      return () => sub.unsubscribe();
    });
  }
}

const barcodeScanner = new BarcodeScanner();

// first connection
const sub = barcodeScanner
  .open()
  .pipe(
    tap(e => console.log('s1', e)),
    switchMap(() => barcodeScanner.close()),
  )
  .subscribe(e => console.log('s1', e));

// second connection 4 second later
setTimeout(() => {
  sub.unsubscribe();
  barcodeScanner.open().subscribe(e => console.log('s2', e));
}, 4000);

// since it's a "cold" observable, a new connection is created
// each time you subscribe to the same observable.
