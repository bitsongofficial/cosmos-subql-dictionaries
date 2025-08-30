import { CosmosEvent, CosmosMessage } from "@subql/types-cosmos";
import { Event, Message } from "../types";
import { stripObjectUnicode } from "../utils";

export async function handleEvent(event: CosmosEvent) {
    const blockHeight = BigInt(event.block.block.header.height);

    const eventStore = Event.create({
        id: `${event.block.block.id}-${event.idx}`,
        blockHeight,
        txHash: event.tx?.hash,
        type: event.event.type,
        msgType: event.msg?.msg.typeUrl,
        data: stripObjectUnicode(event.msg?.msg.decodedMsg),
    });

    await eventStore.save();
}

export async function handleMessage(message: CosmosMessage) {
    const blockHeight = BigInt(message.block.block.header.height);

    // Strip escaped unicode characters
    // Example problem message https://www.mintscan.io/crypto-org/txs/6DB02272D59D920EE9058E59231E9906C240FB82F2E756761CBADCEDF4EBFAE0
    // Example with escaped chars https://www.mintscan.io/osmosis/txs/155E8725A9983F6B696A067BFA5C24D4B0B0ADC6EE6C007B6C080C233B501BA7
    // Not supported by postgres jsonb https://www.postgresql.org/docs/current/datatype-json.html
    const data = stripObjectUnicode(message.msg.decodedMsg);

    const messageStore = Message.create({
        id: `${message.block.block.id}-${message.tx.hash}-${message.idx}`,
        blockHeight,
        txHash: message.tx.hash,
        type: message.msg.typeUrl,
        data,
    });

    await messageStore.save();
}
