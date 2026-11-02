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
id_habitacion INT UNSIGNED NOT NULL PRIMARY KEY, 
num INT UNSIGNED NOT NULL, 
piso INT UNSIGNED NOT NULL, 
precio DECIMAL(10,2) NOT NULL
);

SELECT * FROM Habitaciones; 
ALTER TABLE Habitaciones ADD categoria VARCHAR(50) NOT NULL DEFAULT 'Standard' AFTER piso; -- Categorias para simplificar
ALTER TABLE Habitaciones ADD preview VARCHAR(2048) AFTER categoria; -- Tamaño estandar para url
ALTER TABLE Habitaciones DROP COLUMN num; -- Mejor usare el propio id, como num de habitacion

-- Insertar las 12 habitaciones distribuidas en los 3 pisos con sus respectivas categorías, precios y URLs de imágenes
INSERT INTO Habitaciones (id_habitacion, piso, categoria, preview, precio) VALUES
-- Piso 1: Habitaciones Standard (IDs 101 al 104)
(101, 1, 'Standard', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80', 950.00),
(102, 1, 'Standard', 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80', 950.00),
(103, 1, 'Standard', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80', 1100.00),
(104, 1, 'Standard', 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80', 1100.00),

-- Piso 2: Habitaciones Deluxe (IDs 201 al 204)
(201, 2, 'Deluxe', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80', 1500.00),
(202, 2, 'Deluxe', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80', 1500.00),
(203, 2, 'Deluxe', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80', 1650.00),
(204, 2, 'Deluxe', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80', 1650.00),

-- Piso 3: Habitaciones Suite (IDs 301 al 304)
(301, 3, 'Suite', 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80', 2500.00),
(302, 3, 'Suite', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80', 2500.00),
(303, 3, 'Suite', 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80', 2800.00),
(304, 3, 'Suite', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80', 2800.00);

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

SELECT * FROM Reservaciones; 

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


