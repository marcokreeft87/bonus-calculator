import { IClientTab } from "../models/client";
import { Injectable } from "@angular/core";
import { LocalStorageService } from "./localStorage.service";

@Injectable({
    providedIn: 'root'
  })
export class ClientService extends LocalStorageService {
    key = 'clients';

    saveClient(client: IClientTab): void {
        const clients = this.getClients();

        const index = clients.findIndex(c => c.id === client.id);

        if (index !== -1) {
            clients[index] = client;
        } else {
            client.id = clients.length + 1;
            clients.push(client);
        }

        this.saveData(this.key, JSON.stringify(clients));    
    }

    getClients() : IClientTab[] {
        return this.getData(this.key) ? JSON.parse(this.getData(this.key)!) : [];
    }
}
