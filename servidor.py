from http.server import BaseHTTPRequestHandler, HTTPServer

# Define el manejador de las solicitudes HTTP
class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Define la respuesta HTTP
        self.send_response(200)  # Código 200 significa que la solicitud fue exitosa
        self.send_header("Content-type", "text/html")
        self.end_headers()

        # Contenido HTML que queremos devolver
        html_content = """<!DOCTYPE html>
        <html lang='en'>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>Servidor Python</title>
        </head>
        <body>
            <h1>Hola desde un servidor Python</h1>
            <p>Este es un servidor simple que responde a solicitudes GET.</p>
            <p>Web del grupo DAS 404 FOUND.</p>
            <img src='https://www.bing.com/images/search?view=detailV2&ccid=2mPetpQP&id=784CB547BF535D85C5A58A0D450F3235769ECD81&thid=OIP.2mPetpQPLX6nNauefmAlHQAAAA&mediaurl=https%3a%2f%2fremote-tools-images.s3.amazonaws.com%2fprogrammer-memes%2f53.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.da63deb6940f2d7ea735ab9e7e60251d%3frik%3dgc2edjUyD0UNig%26pid%3dImgRaw%26r%3d0&exph=266&expw=474&q=memes+prgrammers&simid=608001167751911178&FORM=IRPRST&ck=75DDA8337D924F1FBD88C39C243A86E9&selectedIndex=1&itb=0&ajaxhist=0&ajaxserp=0'> 
        </body>
        </html>"""

        # Escribir el contenido HTML en la respuesta
        self.wfile.write(html_content.encode("utf-8"))

# Configura el servidor
if __name__ == "__main__":
    # Define la dirección y el puerto
    server_address = ("", 8000)  # Escucha en todas las interfaces en el puerto 8000
    httpd = HTTPServer(server_address, SimpleHTTPRequestHandler)

    print("Servidor corriendo en el puerto 8000...")
    try:
        httpd.serve_forever()  # Mantiene el servidor ejecutándose
    except KeyboardInterrupt:
        print("\nServidor detenido.")
        httpd.server_close()
