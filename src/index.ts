import { natsWrapper } from "./nats-wrapper";
import { randomUUID } from "crypto";
import { OrderCreatedListener } from "./events/listener/order-created-listener";

const start = async () => {
  try {
    await natsWrapper.connect(
      "ticketing",
      randomUUID(),
      "http://nats-srv:4222"
    );
    natsWrapper.client.on("close", () => {
      console.log("Nats Connection closed");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());
    new OrderCreatedListener(natsWrapper.client).listen();
  } catch (err) {
    console.log(err);
  }
};

start();
