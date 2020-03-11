import feathers from "@feathersjs/feathers";

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

const app = feathers();

// Registra el servicio de mensajes en la app
app.use("messages", new MessageService());

// Log cada vez que se cree un nuevo mensaje
app.service("messages").on("created", (message: Message) => {
  console.log("Un nuevo mensaje ha sido agregado", message);
});

// Crea un mensaje y despues loggea todos los
// mensajes del servicio

const main = async () => {
  // Crea un nuevo mensaje en nuestro servicio
  await app.service("messages").create({
    text: "Hello again"
  });

  // Encuentra todos los mensajes existentes
  const messages = await app.service("messages").find();

  console.log("All messages", messages);
};

main();
