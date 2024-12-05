import json
import yagmail
from confluent_kafka import Consumer
import os
from dotenv import load_dotenv
load_dotenv()


# Configuración del consumidor
consumer_config = {
    'bootstrap.servers': 'localhost:29092',
    'group.id': 'test-group',
    'auto.offset.reset': 'earliest'
}

consumer = Consumer(consumer_config)
consumer.subscribe(['user-location-updates'])

yag = yagmail.SMTP(user=os.getenv("EMAIL_USER"), password=os.getenv("EMAIL_PASS"), host='smtp.gmail.com', port=465, smtp_ssl=True)
print(f"EMAIL_USER: {os.getenv('EMAIL_USER')}")

def send_email_to_parent(email, movie_name):
    """Enviar el correo al padre."""
    subject = "Acceso a película de menor de edad"
    body = f"Hola, tu hijo está viendo la película '{movie_name}'. Por favor, asegúrate de que sea apropiada para su edad."
    
    try:
        yag.send(to=email, subject=subject, contents=body)
        print(f"Correo enviado a: {email}")
    except Exception as e:
        print(f"Error al enviar el correo: {e}")

def process_message(message):
    try:
        obj = json.loads(message.value().decode('utf-8'))
        user = {
            'name': obj.get('name', ''),
            'movie': obj.get('movie', ''),
            'age': obj.get('age', 0),
            'mail': obj.get('mail', '')
        }

        if not user['mail'] or '@' not in user['mail']:
            print(f"Correo inválido o faltante en el mensaje recibido: {user}")
            return

        if user['age'] < 18:
            send_email_to_parent(user['mail'], user['movie'])
    except Exception as e:
        print(f"Error al procesar el mensaje: {e}")



# Bucle para leer mensajes
try:
    while True:
        message = consumer.poll(1.0)  # Espera hasta 1 segundo para recibir un mensaje
        if message is None:  # Si no hay mensajes, continúa
            continue
        if message.error():  # Si hay un error en el mensaje
            print(f"Error en el mensaje: {message.error()}")
            continue

        process_message(message)

except KeyboardInterrupt:
    print("Finalizando consumidor.")

finally:
    consumer.close()
