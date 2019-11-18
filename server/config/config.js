// ===================
// ======PUERTO=======
// ===================
process.env.PORT = process.env.PORT || 3000;

// ===================
// ======ENTORNO======
// ===================
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

// =================================
// ======VENCIMIENTO DEL TOKEN======
// =================================
// 60 SEGUNDOS * 60 MINUTOS * 24 HORAS * 30 DÍAS
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// =================================
// ======SEED DE AUTENTICACIÓN======
// =================================
process.env.SEED = process.env.SEED || "este-es-el-seed-desarrollo";

// ===================
// ===BASE de DATOS===
// ===================
process.env.URLDB =
    process.env.NODE_ENV === "dev" ?
    "mongodb://localhost:27017/cafe" :
    process.env.MONGO_URI;