import { Injectable } from "@nestjs/common";
import { PubSubProvider } from "./pub-sub.provider";
import { Message } from "../entities/messages.entity";

import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

@Injectable()
export class RedisPubSubProvider implements PubSubProvider<Message> {
    constructor(
        private readonly client: ClientProxy<Record<string, Function>>
    ) { }

    async publish(topic: string, payload: Message): Promise<void> {
        await firstValueFrom(this.client.send(topic, payload.content));
    }

    // TODO: Implement this
    async* watch(topic: string): AsyncIterableIterator<Message> {
    }
    
}
