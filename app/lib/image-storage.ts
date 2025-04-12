// https://chatgpt.com/share/67f8f9bb-0894-8013-9065-b5a7bb628af3
export class ImageStorage {
  private dbName = "imageStorageDB";
  private storeName = "images";
  private dbVersion = 1;

  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: "id" });
        }
      };
    });
  }

  async saveImage(id: string, buffer: string): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, "readwrite");
      const store = tx.objectStore(this.storeName);
      store.put({ id, buffer });

      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        reject(tx.error);
      };
    });
  }

  async deleteImage(id: string): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, "readwrite");
      const store = tx.objectStore(this.storeName);
      store.delete(id);

      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        reject(tx.error);
      };
    });
  }

  // Yeni fonksiyon: Birden fazla ID'yi kullanarak kayıtları JSON formatında döndürme
  async loadImagesById(ids: string[]): Promise<any[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, "readonly");
      const store = tx.objectStore(this.storeName);
      const results: any[] = [];
      let count = 0;

      // ID dizisini her birine karşılık gelen kayıtları çekmek için kullanıyoruz
      ids.forEach((id) => {
        const request = store.get(id);
        request.onsuccess = () => {
          const result = request.result;
          if (result) {
            results.push(result);
          }
          count++;

          // Tüm istekler tamamlandığında sonuçları döndür
          if (count === ids.length) {
            db.close();
            resolve(results);
          }
        };
        request.onerror = () => {
          db.close();
          reject(request.error);
        };
      });
    });
  }
}
