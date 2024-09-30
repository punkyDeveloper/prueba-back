import request from 'supertest';
import app from '../src/index'; // Asegúrate de importar tu aplicación Express
import Usuarios from '../src/api/models/registrar'; // Asegúrate de importar tu modelo

describe('Controlador de Usuarios', () => {
  const mockUser = {
    name: 'Test User',
    correo: 'test@example.com',
    contrasena: 'password123',
  };

  beforeAll(async () => {
    // Limpia la base de datos de prueba antes de iniciar las pruebas
    await Usuarios.deleteMany({});
  });

  afterAll(async () => {
    // Desconectar de la base de datos si es necesario
  });

  describe('Registrar', () => {
    it('debería registrar un nuevo usuario', async () => {
      const response = await request(app)
        .post('/registrar') // Asegúrate de que esta ruta sea correcta
        .send(mockUser);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Usuario registrado correctamente!');
      expect(response.body.user).toEqual(expect.objectContaining({
        fullName: mockUser.name,
        email: mockUser.correo,
      }));
    });
    
    it('debería devolver un error si falta algún dato', async () => {
      const response = await request(app)
        .post('/registrar')
        .send({ correo: 'test@example.com' }); // Falta el nombre y la contraseña
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Por favor ingresa todos los datos.');
    });

    it('debería devolver un error si el correo ya está registrado', async () => {
      await request(app)
        .post('/registrar')
        .send(mockUser); // Registrar el usuario primero

      const response = await request(app)
        .post('/registrar')
        .send(mockUser); // Intentar registrar el mismo usuario de nuevo
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'El correo ya está registrado. Por favor usa otro.');
    });
  });

  describe('Actualizar Usuario', () => {
    let userId: string;

    beforeAll(async () => {
      const response = await request(app)
        .post('/registrar')
        .send(mockUser);
      userId = response.body.user._id; // Guarda el ID del usuario registrado
    });

    it('debería actualizar un usuario existente', async () => {
      const updatedData = { nombre: 'Updated User', correo: 'updated@example.com' };
      
      const response = await request(app)
        .put(`/actualizar/${userId}`) // Asegúrate de que esta ruta sea correcta
        .send(updatedData);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Usuario actualizado exitosamente');
      expect(response.body.user).toEqual(expect.objectContaining(updatedData));
    });

    it('debería devolver un error si el usuario no existe', async () => {
      const response = await request(app)
        .put(`/actualizar/invalidId`) // ID no válido
        .send({ nombre: 'Updated User' });
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Usuario no encontrado');
    });
  });

  describe('Obtener Usuario', () => {
    let userId: string;

    beforeAll(async () => {
      const response = await request(app)
        .post('/registrar')
        .send(mockUser);
      userId = response.body.user._id; // Guarda el ID del usuario registrado
    });

    it('debería obtener un usuario existente', async () => {
      const response = await request(app)
        .get(`/obtener/${userId}`) // Asegúrate de que esta ruta sea correcta
        .send();
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({ email: mockUser.correo }));
    });

    it('debería devolver un error si el usuario no existe', async () => {
      const response = await request(app)
        .get(`/obtener/invalidId`) // ID no válido
        .send();
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Usuario no encontrado');
    });
  });
  
  describe('Eliminar Usuario', () => {
    let userId: string;

    beforeAll(async () => {
      const response = await request(app)
        .post('/registrar')
        .send(mockUser);
      userId = response.body.user._id; // Guarda el ID del usuario registrado
    });

    it('debería eliminar un usuario existente', async () => {
      const response = await request(app)
        .delete(`/eliminar/${userId}`) // Asegúrate de que esta ruta sea correcta
        .send();
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Usuario eliminado exitosamente');
      expect(response.body.user).toEqual(expect.objectContaining({ email: mockUser.correo }));
    });

    it('debería devolver un error si el usuario no existe', async () => {
      const response = await request(app)
        .delete(`/eliminar/invalidId`) // ID no válido
        .send();
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Usuario no encontrado');
    });
  });


});
