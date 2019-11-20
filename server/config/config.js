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
// ===BASE DE DATOS===
// ===================
process.env.URLDB =
    process.env.NODE_ENV === "dev" ?
    "mongodb://localhost:27017/cafe" :
    process.env.MONGO_URI;

// ====================
// ==GOOGLE CLIENT ID==
// ====================
process.env.CLIENT_ID =
    process.env.CLIENT_ID ||
    "579173395800-3kb8cj1tj2mcvbj4a3tpd074mch1j2d0.apps.googleusercontent.com";