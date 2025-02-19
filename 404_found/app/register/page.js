import React from "react";
import styles from "@/page.module.css";

export default function Register() {
  return (
    <>
    <html key="1" lang="es">
    <body>
        <main>
        <h2>Introduce tus datos para registrarte en el sistema</h2>
        <form action="">
            <fieldset>
            <legend>
                Por favor, rellena los siguientes datos para registrarte en elsistema
            </legend>
            <br />
            <label htmlFor="name">Nombre *</label>
            <br />
            <input id="name" placeholder="Pepito" type="text" />
            <br />
            <br />
            <label htmlFor="surname">Apellido *</label>
            <br />
            <input id="surname" placeholder="Pérez" type="text" />
            <br />
            <br />
            <label htmlFor="dni">DNI *</label>
            <br />
            <input id="dni" placeholder="54327401B" type="text" />
            <br />
            <br />
            <label htmlFor="mail">Correo electrónico *</label>
            <br />
            <input id="mail" placeholder="usuario@comillas.edu" type="email" />
            <br />
            <span className="hide_span" id="spanMail">
                El correo debe de ser del formato: usuario@dominio.com
            </span>
            <br />
            <label htmlFor="telephone">Número de teléfono</label>
            <br />
            <input id="telephone" placeholder="607 54 23 67" type="tel" />
            <br />
            <br />
            <label htmlFor="user">Usuario</label>
            <br />
            <input id="user" placeholder="PetitoP" type="text" />
            <br />
            <br />
            <label htmlFor="birthday">Fecha de nacimiento</label>
            <br />
            <input id="birthday" type="date" />
            <br />
            <span className="hide_span" id="spanBday">
                Debes ser mayor de edad para participar en la subasta
            </span>
            <br />
            <label htmlFor="direction">Dirección</label>
            <br />
            <input
                id="direction"
                placeholder="Calle Estrella 12, Madrid"
                type="text"
            />
            <br />
            <br />
            <label htmlFor="comunity">Comunidad Autónoma</label>
            <br />
            <select id="comunity">
                <option value="">Selecciona una comunidad</option>
                <option value="Andalucia">Andalucía</option>
                <option value="Cataluña">Cataluña</option>
                <option value="Madrid">Madrid</option>
                <option value="Valencia">Comunidad Valenciana</option>
                <option value="Galicia">Galicia</option>
                <option value="CastillaLaMancha">Castilla-La Mancha</option>
                <option value="CastillaYLeon">Castilla y León</option>
                <option value="Catalunya">Cataluña</option>
                <option value="Extremadura">Extremadura</option>
                <option value="Madrid">Madrid</option>
                <option value="Murcia">Murcia</option>
                <option value="Navarra">Navarra</option>
                <option value="PaisVasco">País Vasco</option>
                <option value="Aragon">Aragón</option>
                <option value="Cantabria">Cantabria</option>
                <option value="LaRioja">La Rioja</option>
                <option value="IslasCanarias">Islas Canarias</option>
                <option value="IslasBaleares">Islas Baleares</option>
                <option value="Ceuta">Ceuta</option>
                <option value="Melilla">Melilla</option>
            </select>
            <br />
            <br />
            <label htmlFor="city">Ciudad</label>
            <br />
            <select id="city">
                <option value="">Selecciona una ciudad</option>
                <option value="Sevilla">Sevilla</option>
                <option value="Málaga">Málaga</option>
                <option value="Granada">Granada</option>
                <option value="Córdoba">Córdoba</option>
                <option value="Jaén">Jaén</option>
                <option value="Huelva">Huelva</option>
                <option value="Almería">Almería</option>
                <option value="Linares">Linares</option>
                <option value="Cádiz">Cádiz</option>
                <option value="Murcia">Murcia</option>
                <option value="Cartagena">Cartagena</option>
                <option value="Alicante">Alicante</option>
                <option value="Valencia">Valencia</option>
                <option value="Castellón">Castellón</option>
                <option value="Zaragoza">Zaragoza</option>
                <option value="Huesca">Huesca</option>
                <option value="Teruel">Teruel</option>
                <option value="Barcelona">Barcelona</option>
                <option value="Girona">Girona</option>
                <option value="Lleida">Lleida</option>
                <option value="Tarragona">Tarragona</option>
                <option value="Vigo">Vigo</option>
                <option value="Santiago de Compostela">
                Santiago de Compostela
                </option>
                <option value="A Coruña">A Coruña</option>
                <option value="Ourense">Ourense</option>
                <option value="Logroño">Logroño</option>
                <option value="Palma de Mallorca">Palma de Mallorca</option>
                <option value="Las Palmas de Gran Canaria">
                Las Palmas de Gran Canaria
                </option>
                <option value="Santa Cruz de Tenerife">
                Santa Cruz de Tenerife
                </option>
                <option value="Bilbao">Bilbao</option>
                <option value="Vitoria-Gasteiz">Vitoria-Gasteiz</option>
                <option value="Pamplona">Pamplona</option>
                <option value="Badajoz">Badajoz</option>
                <option value="Cáceres">Cáceres</option>
                <option value="Ávila">Ávila</option>
                <option value="Segovia">Segovia</option>
                <option value="Salamanca">Salamanca</option>
                <option value="Valladolid">Valladolid</option>
                <option value="León">León</option>
                <option value="Palencia">Palencia</option>
                <option value="Burgos">Burgos</option>
                <option value="Álava">Álava</option>
                <option value="Guipúzcoa">Guipúzcoa</option>
                <option value="Vizcaya">Vizcaya</option>
                <option value="Ceuta">Ceuta</option>
                <option value="Melilla">Melilla</option>
            </select>
            <br />
            <br />
            <label htmlFor="payment">Datos de pago</label>
            <br />
            <input id="payment" type="text" />
            <br />
            <br />
            <label htmlFor="psw">Contraseña</label>
            <br />
            <input id="psw" placeholder="Contraseña" type="password" />
            <br />
            <span className="hide_span" id="spanpswl">
                La contraseña tiene que tener al menos 8 caracteres
            </span>
            <br />
            <label htmlFor="confirmationpsw">Confirma la contraseña</label>
            <br />
            <input
                id="confirmationpsw"
                placeholder="Confirmar contraseña"
                type="password"
            />
            <br />
            <span className="hide_span" id="spanpsw">
                Las contraseñas no coinciden
            </span>
            <br />
            <label htmlFor="upimg">Carga una foto de tú DNI: </label>
            <input id="upimg" name="filename" type="file" />
            <br />
            <br />
            <input type="submit" value="Registrar" />
            <input type="reset" value="Limpiar" />
            <input
                defaultValue="Inicio de Sesión"
                id="return"
                onclick="window.location.href='Formulario_Login.html';"
                type="button"
            />
            </fieldset>
        </form>
        </main>
    </body>
    </html>;
    </>
  );
}