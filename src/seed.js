require('dotenv').config();
const bcrypt = require('bcryptjs');
const { createDatabaseIfNotExists } = require('./config/database');
const { sequelize, User, Categoria, Medicamento } = require('./models');

(async () => {
  try {
    await createDatabaseIfNotExists();
    await sequelize.sync({ force: true }); // recrea las tablas desde cero
    console.log('Tablas recreadas.');

    // Usuarios (uno por rol)
    await User.bulkCreate([
      { nombre: 'Ana Administradora', email: 'admin@farmacia.com', password: await bcrypt.hash('Admin123', 10), rol: 'administrador' },
      { nombre: 'Mario Moderador', email: 'moderador@farmacia.com', password: await bcrypt.hash('Moder123', 10), rol: 'moderador' },
      { nombre: 'Ursula Usuaria', email: 'usuario@farmacia.com', password: await bcrypt.hash('Usuario123', 10), rol: 'usuario' },
    ]);

    // Tabla 1: categorias
    const cats = await Categoria.bulkCreate(
      [
        { nombre: 'Analgésicos', descripcion: 'Alivio del dolor y la fiebre' },
        { nombre: 'Antibióticos', descripcion: 'Tratamiento de infecciones bacterianas' },
        { nombre: 'Vitaminas', descripcion: 'Suplementos vitamínicos y minerales' },
        { nombre: 'Antialérgicos', descripcion: 'Control de síntomas alérgicos' },
      ],
      { returning: true }
    );
    const byName = Object.fromEntries(cats.map((c) => [c.nombre, c.id]));

    // Tabla 2: medicamentos (relacionada con categorias por categoriaId)
    await Medicamento.bulkCreate([
      { nombre: 'Paracetamol 500 mg', laboratorio: 'Genfar', precio: 4.5, stock: 120, fecha_vencimiento: '2027-08-31', categoriaId: byName['Analgésicos'] },
      { nombre: 'Ibuprofeno 400 mg', laboratorio: 'Bayer', precio: 6.9, stock: 80, fecha_vencimiento: '2027-05-15', categoriaId: byName['Analgésicos'] },
      { nombre: 'Naproxeno 550 mg', laboratorio: 'Medifarma', precio: 8.2, stock: 45, fecha_vencimiento: '2027-02-28', categoriaId: byName['Analgésicos'] },
      { nombre: 'Amoxicilina 500 mg', laboratorio: 'Portugal', precio: 12.0, stock: 60, fecha_vencimiento: '2027-03-20', categoriaId: byName['Antibióticos'] },
      { nombre: 'Azitromicina 500 mg', laboratorio: 'Pfizer', precio: 18.5, stock: 35, fecha_vencimiento: '2027-11-10', categoriaId: byName['Antibióticos'] },
      { nombre: 'Ciprofloxacino 500 mg', laboratorio: 'Teva', precio: 14.3, stock: 28, fecha_vencimiento: '2027-06-30', categoriaId: byName['Antibióticos'] },
      { nombre: 'Vitamina C 1 g', laboratorio: 'Bayer', precio: 9.9, stock: 200, fecha_vencimiento: '2028-01-31', categoriaId: byName['Vitaminas'] },
      { nombre: 'Complejo B', laboratorio: 'Medifarma', precio: 11.5, stock: 90, fecha_vencimiento: '2027-12-15', categoriaId: byName['Vitaminas'] },
      { nombre: 'Loratadina 10 mg', laboratorio: 'Genfar', precio: 3.8, stock: 150, fecha_vencimiento: '2027-09-30', categoriaId: byName['Antialérgicos'] },
      { nombre: 'Cetirizina 10 mg', laboratorio: 'Teva', precio: 5.4, stock: 110, fecha_vencimiento: '2027-10-25', categoriaId: byName['Antialérgicos'] },
    ]);

    console.log('Datos de ejemplo insertados:');
    console.log('  admin@farmacia.com      / Admin123     (administrador)');
    console.log('  moderador@farmacia.com  / Moder123     (moderador)');
    console.log('  usuario@farmacia.com    / Usuario123   (usuario)');
    process.exit(0);
  } catch (err) {
    console.error('Error en el seed:', err);
    process.exit(1);
  }
})();
