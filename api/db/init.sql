CREATE TABLE IF NOT EXISTS cv_info (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  name        VARCHAR(100),
  profession  VARCHAR(100),
  experience  TEXT,
  email       VARCHAR(100),
  moreinfo    TEXT
);

INSERT INTO cv_info (name, profession, experience, email, moreinfo)
SELECT 'Jan Vizcaino',
       'Desarrollador Full Stack & DevOps',
       'Despliegue automatizado con Jenkins y Docker en Raspberry Pi.',
       'jan.vizbb@gmail.com',
       'Estudiante de DAW con experiencia en CI/CD, Docker y Node.js.'
WHERE NOT EXISTS (SELECT 1 FROM cv_info);
