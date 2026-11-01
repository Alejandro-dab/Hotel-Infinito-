DROP DATABASE IF EXISTS Hotel_infinito; 
CREATE DATABASE Hotel_infinito; 
USE Hotel_infinito; 

CREATE TABLE Huespedes(
id_huesped INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY, 
nombre VARCHAR(40) NOT NULL, 
ap_paterno VARCHAR(50), /*Algunos huespedes podrian preferir no dar sus apellidos*/
ap_materno VARCHAR(50),
num INT UNSIGNED, 
email VARCHAR(60), 
pass VARCHAR(50) NOT NULL
);

ALTER TABLE Huespedes MODIFY COLUMN num VARCHAR(20); /*Excede el limite de un INT*/
SELECT * FROM Huespedes; 

INSERT INTO Huespedes(nombre, ap_paterno, ap_materno, num, email, pass)
VALUES ('Alejandro', 'Del Angel', '', null, 'hotel_infinito@gmail.com', '123456'); 

CREATE TABLE Habitaciones(
id_habitacion INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY, 
num INT UNSIGNED NOT NULL, 
piso INT UNSIGNED NOT NULL, 
precio DECIMAL(10,2) NOT NULL
);

CREATE TABLE Reservaciones(
id_reservacion INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, 
id_huesped_fk INT UNSIGNED NOT NULL, 
id_habitacion_fk INT UNSIGNED NOT NULL, 
fecha_inicio DATE NOT NULL, 
fecha_fin DATE NOT NULL,
precio DECIMAL(10,2) NOT NULL, 

FOREIGN KEY (id_huesped_fk) REFERENCES Huespedes(id_huesped), 
FOREIGN KEY (id_habitacion_fk) REFERENCES Habitaciones(id_habitacion)
);

CREATE TABLE Pagos(
id_pago INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, 
pago DECIMAL(10, 2) NOT NULL, 
fecha DATETIME NOT NULL, 
id_huesped_fk INT UNSIGNED NOT NULL, 
id_habitacion_fk int UNSIGNED NOT NULL,
FOREIGN KEY (id_huesped_fk) REFERENCES Huespedes(id_huesped),
FOREIGN KEY (id_habitacion_fk) REFERENCES Habitaciones(id_habitacion)
);

SHOW TABLES; 
DESCRIBE Huespedes; 


