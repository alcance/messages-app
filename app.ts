import feathers from "@feathersjs/feathers";
import "@feathersjs/transport-commons";
import express from "@feathersjs/express";
import socketio from "@feathersjs/socketio";

// This is the interface for the message
interface Message {
  id?: number;
  text: string;
}

// Un servicio de mensajes que nos permita crear uno nuevo
// y regresar todos los mensajes existentes.
class MessageService {
  messages: Message[] = [];

  async find() {
    // Regresa todos los mensajes
    return this.messages;
  }

  async create(data: Pick<Message, "text">) {
    const message: Message = {
      id: this.messages.length,
      text: data.text
    };

    // Agregar un nuevo mensaje a la lista
    this.messages.push(message);

    return message;
  }
}

// Crea una app Express compatible con Feathers
const app = express(feathers());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.configure(express.rest());
app.configure(socketio());

// Registra el servicio de mensajes en la app
app.use("messages", new MessageService());

app.use(express.errorHandler());

// Agregar un nueva conexion al canal 'guarap'
app.on("connection", connection => {
  app.channel("guarap").join(connection);
});

// Publica todos los eventos al canal de guarap
app.publish(data => app.channel("guarap"));

// Inicia el servidor
app.listen(3030).on("listening", () => {
  console.log("Feathers server funcionando correctamente! 🎯");
});

// Crear un mensaje
app.service("messages").create({
  text: "Hola chaval, desde el server! 💬"
});

// Log cada vez que se cree un nuevo mensaje
/*
app.service("messages").on("created", (message: Message) => {
  console.log("Un nuevo mensaje ha sido agregado", message);
});

Crea un mensaje y despues loggea todos los
mensajes del servicio

const main = async () => {
  // Crea un nuevo mensaje en nuestro servicio
  await app.service("messages").create({
    text: "Hola Mundo"
  });

  await app.service("messages").create({
    text: "Hello World"
  });

  // Encuentra todos los mensajes existentes
  const messages = await app.service("messages").find();

  console.log("All messages", messages);
};

main();
*/
