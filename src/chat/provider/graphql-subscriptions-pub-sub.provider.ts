import { Injectable } from "@nestjs/common";
import { Message } from "../entities/messages.entity";
import { PubSubProvider } from "./pub-sub.provider";
import { PubSub } from "graphql-subscriptions";

@Injectable()
export class GraphqlSubscriptionsPubSubProvider implements PubSubProvider<Message> {
    private readonly pubSub = new PubSub();

    async publish(topic: string, payload: Message): Promise<void> {
        await this.pubSub.publish(topic, payload);
    }

    watch(topic: string): AsyncIterableIterator<Message> {
        return this.pubSub.asyncIterableIterator(topic);
    }

}