/*
===========================================================
DATABASE : ESI Dashboard 3.0
ENGINE   : MySQL 8+
AUTHOR   : Zenkaizer
===========================================================
*/

DROP DATABASE IF EXISTS esi_db;
CREATE DATABASE esi_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE esi_db;

/*=========================================================
TABLA: instrumento
=========================================================*/

DROP TABLE IF EXISTS instrumento;

CREATE TABLE instrumento
(
    id INT AUTO_INCREMENT,

    nombre VARCHAR(60) NOT NULL,

    activo BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    UNIQUE KEY uk_instrumento_nombre (nombre)

);

/*=========================================================
TABLA: iglesia
=========================================================*/

DROP TABLE IF EXISTS iglesia;

CREATE TABLE iglesia
(
    id INT AUTO_INCREMENT,

    nombre VARCHAR(120) NOT NULL,

    direccion TEXT,

    contacto VARCHAR(120),

    telefono VARCHAR(20),

    activo BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    INDEX idx_iglesia_nombre(nombre)

);

/*=========================================================
TABLA: profesor
=========================================================*/

DROP TABLE IF EXISTS profesor;

CREATE TABLE profesor
(
    id INT AUTO_INCREMENT,

    nombre VARCHAR(50) NOT NULL,

    apellido VARCHAR(50) NOT NULL,

    email VARCHAR(120) NOT NULL,

    password_hash VARCHAR(255),

    google_id VARCHAR(255),

    foto_url TEXT,

    ultimo_login DATETIME NULL,

    activo BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    UNIQUE KEY uk_profesor_email(email),

    INDEX idx_profesor_nombre(nombre),

    INDEX idx_profesor_apellido(apellido)

);

/*=========================================================
TABLA: profesor_iglesia
=========================================================*/

DROP TABLE IF EXISTS profesor_iglesia;

CREATE TABLE profesor_iglesia
(
    id INT AUTO_INCREMENT,

    profesor_id INT NOT NULL,

    iglesia_id INT NOT NULL,

    activo BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY(id),

    CONSTRAINT fk_profesoriglesia_profesor
        FOREIGN KEY (profesor_id)
        REFERENCES profesor(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_profesoriglesia_iglesia
        FOREIGN KEY (iglesia_id)
        REFERENCES iglesia(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    UNIQUE KEY uk_profesor_iglesia(profesor_id, iglesia_id),

    INDEX idx_pi_profesor(profesor_id),

    INDEX idx_pi_iglesia(iglesia_id)

);

/*=========================================================
DATOS INICIALES
=========================================================*/

INSERT INTO instrumento(nombre)
VALUES
('Guitarra'),
('Piano'),
('Batería'),
('Canto'),
('Bajo'),
('Ukelele'),
('Lenguaje Musical');

/*=========================================================
TABLA: profesor_instrumento
=========================================================*/

DROP TABLE IF EXISTS profesor_instrumento;

CREATE TABLE profesor_instrumento
(
    id INT AUTO_INCREMENT,

    profesor_id INT NOT NULL,

    instrumento_id INT NOT NULL,

    activo BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY(id),

    CONSTRAINT fk_pi_profesor
        FOREIGN KEY(profesor_id)
        REFERENCES profesor(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_pi_instrumento
        FOREIGN KEY(instrumento_id)
        REFERENCES instrumento(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    UNIQUE KEY uk_profesor_instrumento
    (
        profesor_id,
        instrumento_id
    ),

    INDEX idx_pi_profesor(profesor_id),

    INDEX idx_pi_instrumento(instrumento_id)

);

/*=========================================================
TABLA: alumno
=========================================================*/

DROP TABLE IF EXISTS alumno;

CREATE TABLE alumno
(
    id INT AUTO_INCREMENT,

    nombre VARCHAR(50) NOT NULL,

    apellido VARCHAR(50) NOT NULL,

    fecha_nacimiento DATE NULL,

    celular VARCHAR(20),

    genero ENUM('M','F') NOT NULL,

    imagen TEXT NULL,

    iglesia_id INT NULL,

    activo BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY(id),

    CONSTRAINT fk_alumno_iglesia
        FOREIGN KEY (iglesia_id)
        REFERENCES iglesia(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    INDEX idx_alumno_nombre(nombre),

    INDEX idx_alumno_apellido(apellido),

    INDEX idx_alumno_iglesia(iglesia_id)

);

/*=========================================================
TABLA: inscripcion
=========================================================*/

DROP TABLE IF EXISTS inscripcion;

CREATE TABLE inscripcion
(
    id INT AUTO_INCREMENT,

    alumno_id INT NOT NULL,

    profesor_instrumento_id INT NOT NULL,

    tipo_clase ENUM('grupal','particular') NOT NULL,

    fecha_inicio DATE NOT NULL,

    fecha_fin DATE NULL,

    observaciones TEXT NULL,

    activo BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY(id),

    CONSTRAINT fk_inscripcion_alumno
        FOREIGN KEY(alumno_id)
        REFERENCES alumno(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_inscripcion_profesor_instrumento
        FOREIGN KEY(profesor_instrumento_id)
        REFERENCES profesor_instrumento(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    UNIQUE KEY uk_inscripcion
    (
        alumno_id,
        profesor_instrumento_id,
        tipo_clase
    ),

    INDEX idx_inscripcion_alumno(alumno_id),

    INDEX idx_inscripcion_profesor_instrumento(profesor_instrumento_id),

    INDEX idx_inscripcion_tipo(tipo_clase),

    INDEX idx_inscripcion_activo(activo)

);

/*=========================================================
TABLA: clase
=========================================================*/

DROP TABLE IF EXISTS clase;

CREATE TABLE clase
(
    id INT AUTO_INCREMENT,

    inscripcion_id INT NOT NULL,

    fecha DATE NOT NULL,

    hora_inicio TIME NOT NULL,

    hora_fin TIME NULL,

    tema VARCHAR(150) NOT NULL,

    observaciones TEXT,

    activo BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY(id),

    CONSTRAINT fk_clase_inscripcion
        FOREIGN KEY(inscripcion_id)
        REFERENCES inscripcion(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    INDEX idx_clase_fecha(fecha),

    INDEX idx_clase_inscripcion(inscripcion_id)

);

/*=========================================================
TABLA: asistencia
=========================================================*/

DROP TABLE IF EXISTS asistencia;

CREATE TABLE asistencia
(
    id INT AUTO_INCREMENT,

    clase_id INT NOT NULL,

    inscripcion_id INT NOT NULL,

    estado ENUM('presente','ausente','tarde','justificado') NOT NULL,

    observacion TEXT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY(id),

    CONSTRAINT fk_asistencia_clase
        FOREIGN KEY(clase_id)
        REFERENCES clase(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_asistencia_inscripcion
        FOREIGN KEY(inscripcion_id)
        REFERENCES inscripcion(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    UNIQUE KEY uk_asistencia
    (
        clase_id,
        inscripcion_id
    ),

    INDEX idx_asistencia_clase(clase_id),

    INDEX idx_asistencia_inscripcion(inscripcion_id),

    INDEX idx_asistencia_estado(estado)

);

/*=========================================================
TABLA: calificacion
=========================================================*/

DROP TABLE IF EXISTS calificacion;

CREATE TABLE calificacion
(
    id INT AUTO_INCREMENT,

    clase_id INT NOT NULL,

    inscripcion_id INT NOT NULL,

    tipo ENUM
    (
        'practica',
        'evaluacion',
        'parcial',
        'final'
    ) NOT NULL DEFAULT 'practica',

    nota DECIMAL(5,2) NOT NULL,

    comentario TEXT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY(id),

    CONSTRAINT fk_calificacion_clase
        FOREIGN KEY(clase_id)
        REFERENCES clase(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_calificacion_inscripcion
        FOREIGN KEY(inscripcion_id)
        REFERENCES inscripcion(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    UNIQUE KEY uk_calificacion
    (
        clase_id,
        inscripcion_id,
        tipo
    ),

    INDEX idx_calificacion_clase(clase_id),

    INDEX idx_calificacion_inscripcion(inscripcion_id),

    INDEX idx_calificacion_tipo(tipo),

    INDEX idx_calificacion_nota(nota)

);

/*=========================================================
TABLA: tarea
=========================================================*/

DROP TABLE IF EXISTS tarea;

CREATE TABLE tarea
(
    id INT AUTO_INCREMENT,

    clase_id INT NOT NULL,

    titulo VARCHAR(120) NOT NULL,

    descripcion TEXT NOT NULL,

    fecha_entrega DATE,

    estado ENUM(
        'pendiente',
        'en_progreso',
        'completada',
        'cancelada'
    ) DEFAULT 'pendiente',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY(id),

    CONSTRAINT fk_tarea_clase
        FOREIGN KEY(clase_id)
        REFERENCES clase(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    INDEX idx_tarea_estado(estado),

    INDEX idx_tarea_fecha(fecha_entrega)

);